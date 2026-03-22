# master-ball-js

A lightweight, configurable web scraping library with declarative schema extraction.

## Installation
```bash
npm install master-ball-js
```

## Usage
```typescript
import { scrape } from 'master-ball-js';

const result = await scrape({
  url: 'https://example.com',
  schema: {
    title:  { selector: 'h1',          extract: 'text' },
    image:  { selector: 'img.hero',    extract: 'attr:src' },
    tags:   { selector: '.tag',        extract: 'text', multiple: true },
  },
});

console.log(result.data);
console.log(result.meta);
```

## Schema

Each field in the schema describes how to extract a single piece of data from the HTML.

| Property   | Type                          | Description                                      |
|------------|-------------------------------|--------------------------------------------------|
| `selector` | `string`                      | CSS selector pointing to the element             |
| `extract`  | `'text' \| 'html' \| 'attr:x'` | What to extract — text content, inner HTML, or an attribute value |
| `multiple` | `boolean`                     | If true, returns an array with all matching elements |

## Configuration
```typescript
const result = await scrape({
  url: 'https://example.com',
  schema: { ... },
  headers: { 'Accept-Language': 'ja' },  // custom HTTP headers
  timeout: 15000,                         // timeout in ms (default: 10000)
  pagination: {
    nextSelector: 'a.next',              // CSS selector for the "next page" link
    maxPages: 5,                         // max pages to visit (default: 10)
    delay: 1000,                         // delay between pages in ms (default: 1000)
  },
});
```

## Result
```typescript
{
  url: 'https://example.com',
  data: [
    { title: 'Hello World', image: '/img/hero.jpg', tags: ['news', 'tech'] }
  ],
  meta: {
    scrapedAt: Date,
    durationMs: 342,
    pagesVisited: 1,
  }
}
```

## Multiple URLs
```typescript
const result = await scrape({
  url: [
    'https://example.com/page/1',
    'https://example.com/page/2',
  ],
  schema: { ... },
});
```

## Notes

- Images are not downloaded — the library extracts the URL. Download them separately if needed.
- For JavaScript-rendered pages (SPAs), Playwright support is planned as an optional dependency.

## License

MIT