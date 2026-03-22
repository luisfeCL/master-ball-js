import { fetchHtml } from './fetcher';
import { Parser } from './parser';
import type { ScraperConfig, ScrapeResult, ExtractedData } from './types';

export async function scrape(config: ScraperConfig): Promise<ScrapeResult> {
    const startedAt = Date.now();
    const urls = normalizeUrls(config.url);
    const data: ExtractedData[] = [];
    let pagesVisited = 0;

    for (const url of urls) {
        const result = await scrapeWithPagination(url, config);
        data.push(...result.data);
        pagesVisited += result.pagesVisited;
    }

    return buildResult(urls[0] ?? '', data, pagesVisited, startedAt);
}

async function scrapeWithPagination(
        startUrl: string,
        config: ScraperConfig,
    ): Promise<{ data: ExtractedData[]; pagesVisited: number }> {
        const maxPages = config.pagination?.maxPages ?? 10;
        const data: ExtractedData[] = [];
        let currentUrl: string | null = startUrl;
        let pagesVisited = 0;

        while (currentUrl !== null && pagesVisited < maxPages) {
            const { extracted, nextUrl } = await scrapePage(currentUrl, config);
            data.push(extracted);
            pagesVisited++;
            currentUrl = nextUrl;

            if (currentUrl !== null) {
            await wait(config.pagination?.delay ?? 1000);
            }
    }

    return { data, pagesVisited };
}

async function scrapePage(
    url: string,
    config: ScraperConfig,
): Promise<{ extracted: ExtractedData; nextUrl: string | null }> {
    const html = await fetchHtml(url, config);
    const parser = new Parser(html);
    const extracted = parser.extract(config.schema);
    const nextUrl = config.pagination
        ? getNextUrl(parser, url, config.pagination.nextSelector)
        : null;

    return { extracted, nextUrl };
}

function getNextUrl(
        parser: Parser,
        currentUrl: string,
        nextSelector: string,
    ): string | null {
        const result = parser.extract({
            next: { selector: nextSelector, extract: 'attr:href' },
        });

        const href = result['next'];
        if (typeof href !== 'string' || href.trim() === '') return null;

        try {
            return new URL(href, currentUrl).toString();
        } catch {
            return null;
        }
}

function normalizeUrls(url: string | string[]): string[] {
    return Array.isArray(url) ? url : [url];
}

function buildResult(
    url: string,
    data: ExtractedData[],
    pagesVisited: number,
    startedAt: number,
    ): ScrapeResult {
    return {
        url,
        data,
        meta: {
        scrapedAt: new Date(startedAt),
        durationMs: Date.now() - startedAt,
        pagesVisited,
        },
    };
}

function wait(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}