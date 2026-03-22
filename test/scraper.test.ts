import { scrape } from '../src/scraper';

const mockFetch = jest.fn();
global.fetch = mockFetch;

const HTML = `
    <div class="card">
        <h1 class="name">Pikachu</h1>
        <span class="hp">60</span>
        <span class="type">Electric</span>
    </div>
`;

describe('scrape', () => {
    beforeEach(() => {
        mockFetch.mockClear();
    });

    it('returns extracted data from a single url', async () => {
        mockFetch.mockResolvedValueOnce({
        ok: true,
        text: async () => HTML,
        });

        const result = await scrape({
        url: 'https://example.com',
        schema: {
            name: { selector: '.name', extract: 'text' },
            hp:   { selector: '.hp',   extract: 'text' },
        },
        });

        expect(result.data).toHaveLength(1);
        expect(result.data[0]?.name).toBe('Pikachu');
        expect(result.data[0]?.hp).toBe('60');
    });

    it('returns extracted data from multiple urls', async () => {
        mockFetch.mockResolvedValue({
        ok: true,
        text: async () => HTML,
        });

        const result = await scrape({
        url: ['https://example.com/1', 'https://example.com/2'],
        schema: {
            name: { selector: '.name', extract: 'text' },
        },
        });

        expect(result.data).toHaveLength(2);
        expect(mockFetch).toHaveBeenCalledTimes(2);
    });

    it('includes meta with scrapedAt and durationMs', async () => {
        mockFetch.mockResolvedValueOnce({
        ok: true,
        text: async () => HTML,
        });

        const result = await scrape({
        url: 'https://example.com',
        schema: {
            name: { selector: '.name', extract: 'text' },
        },
        });

        expect(result.meta.scrapedAt).toBeInstanceOf(Date);
        expect(result.meta.durationMs).toBeGreaterThanOrEqual(0);
        expect(result.meta.pagesVisited).toBe(1);
    });

    it('throws when fetch fails', async () => {
        mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        });

        await expect(
        scrape({
            url: 'https://example.com',
            schema: {
            name: { selector: '.name', extract: 'text' },
            },
        })
        ).rejects.toThrow('HTTP 500');
    });

    it('follows pagination until no next link', async () => {
        const HTML_PAGE_1 = `
            <div class="card"><h1 class="name">Pikachu</h1></div>
            <a class="next" href="/page/2">Next</a>
        `;
        const HTML_PAGE_2 = `
            <div class="card"><h1 class="name">Mewtwo</h1></div>
        `;

        mockFetch
            .mockResolvedValueOnce({ ok: true, text: async () => HTML_PAGE_1 })
            .mockResolvedValueOnce({ ok: true, text: async () => HTML_PAGE_2 });

        const result = await scrape({
            url: 'https://example.com/page/1',
            schema: {
            name: { selector: '.name', extract: 'text' },
            },
            pagination: {
            nextSelector: 'a.next',
            delay: 0,
            },
        });

        expect(result.data).toHaveLength(2);
        expect(result.data[0]?.name).toBe('Pikachu');
        expect(result.data[1]?.name).toBe('Mewtwo');
        expect(result.meta.pagesVisited).toBe(2);
        });

        it('stops at maxPages', async () => {
        const HTML_WITH_NEXT = `
            <div class="card"><h1 class="name">Pikachu</h1></div>
            <a class="next" href="/page/2">Next</a>
        `;

        mockFetch.mockResolvedValue({ ok: true, text: async () => HTML_WITH_NEXT });

        const result = await scrape({
            url: 'https://example.com/page/1',
            schema: {
            name: { selector: '.name', extract: 'text' },
            },
            pagination: {
            nextSelector: 'a.next',
            maxPages: 2,
            delay: 0,
            },
        });

        expect(result.meta.pagesVisited).toBe(2);
        expect(mockFetch).toHaveBeenCalledTimes(2);
    });
});