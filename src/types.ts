// schema
export interface  SchemaField {
    selector: string;
    extract?: 'text' | 'html' | `attr:${string}`;
    multiple?: boolean;
}

export type Schema = Record<string, SchemaField>;
export type ExtractedData = Record<string, unknown>;

// Scrapper config
export interface ScraperConfig {
    url: string | string[];
    schema: Schema;
    headers?: Record<string, string>;
    timeout?: number;
    pagination?: PaginationConfig;
}

// Result
export interface ScrapeResult {
    url: string;
    data: ExtractedData[];
    meta: {
        scrapedAt: Date;
        durationMs: number;
        pagesVisited: number;
    };
}

// Pagination
export interface PaginationConfig {
    nextSelector: string;
    maxPages?: number;
    delay?: number;
}