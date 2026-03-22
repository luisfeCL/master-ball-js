import type { ScraperConfig } from './types';

type FetchConfig = Pick<ScraperConfig, 'headers' | 'timeout'>;

export async function fetchHtml(
        url: string,
        config?: FetchConfig,
    ): Promise<string> {
        const timeout = config?.timeout ?? 10_000;
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), timeout);

        try {
            const response = await fetch(url, {
            signal: controller.signal,
            headers: buildHeaders(config?.headers),
            });

            if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${url}`);
            }

            return await response.text();
        } catch (err) {
            if ((err as Error).name === 'AbortError') {
            throw new Error(`Timeout after ${timeout}ms: ${url}`);
            }
            throw err;
        } finally {
            clearTimeout(timer);
        }
}

function buildHeaders(custom: Record<string, string> = {}): Record<string, string> {
    return {
        'User-Agent': 'master-ball-js/0.1.0',
        ...custom,
    };
}