import * as cheerio from 'cheerio';
import type { AnyNode } from 'domhandler';
import type { Schema, ExtractedData } from './types';

export class Parser {
    private $: cheerio.CheerioAPI;

    constructor(html: string) {
        this.$ = cheerio.load(html);
    }

    extract(schema: Schema): ExtractedData {
        const result: ExtractedData = {};

        for (const [key, field] of Object.entries(schema)) {
        const elements = this.$(field.selector);

        if (elements.length === 0) {
            result[key] = field.multiple ? [] : null;
            continue;
        }

        if (field.multiple) {
            result[key] = elements.map((_i, el) =>
            this.getValue(this.$(el), field.extract)
            ).get();
        } else {
            result[key] = this.getValue(elements.first(), field.extract);
        }
        }

        return result;
    }

    private getValue(
        element: cheerio.Cheerio<AnyNode>,
        mode: string = 'text'
    ): string | null {
        if (mode === 'text') return element.text().trim() || null;
        if (mode === 'html') return element.html() ?? null;
        if (mode.startsWith('attr:')) return element.attr(mode.slice(5)) ?? null;
        return null;
    }
    }