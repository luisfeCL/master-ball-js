import { fetchHtml } from '../src/fetcher';

const mockFetch = jest.fn();
global.fetch = mockFetch;

describe('fetchHtml', () => {
    beforeEach(() => {
        mockFetch.mockClear();
    });

    it('returns html when response is ok', async () => {
        mockFetch.mockResolvedValueOnce({
        ok: true,
        text: async () => '<html><body>Hello</body></html>',
        });

        const html = await fetchHtml('https://example.com');

        expect(html).toBe('<html><body>Hello</body></html>');
        expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    it('throws when response is not ok', async () => {
        mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        });

        await expect(fetchHtml('https://example.com'))
        .rejects
        .toThrow('HTTP 404');
    });

    it('sends the correct user agent header', async () => {
        mockFetch.mockResolvedValueOnce({
        ok: true,
        text: async () => '<html></html>',
        });

        await fetchHtml('https://example.com');

        expect(mockFetch).toHaveBeenCalledWith(
        'https://example.com',
        expect.objectContaining({
            headers: expect.objectContaining({
            'User-Agent': 'master-ball-js/0.1.0',
            }),
        })
        );
    });

    it('merges custom headers', async () => {
        mockFetch.mockResolvedValueOnce({
        ok: true,
        text: async () => '<html></html>',
        });

        await fetchHtml('https://example.com', {
        headers: { 'Accept-Language': 'ja' },
        });

        expect(mockFetch).toHaveBeenCalledWith(
        'https://example.com',
        expect.objectContaining({
            headers: expect.objectContaining({
            'User-Agent': 'master-ball-js/0.1.0',
            'Accept-Language': 'ja',
            }),
        })
        );
    });

    it('throws when request times out', async () => {
        mockFetch.mockImplementationOnce(() =>
            new Promise((_, reject) =>
            setTimeout(() => reject(new DOMException('Aborted', 'AbortError')), 100)
            )
        );

        await expect(
            fetchHtml('https://example.com', { timeout: 50 })
        ).rejects.toThrow('Timeout');
    });
});