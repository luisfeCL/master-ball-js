import { scrape } from '../src/index';

async function main() {
    const result = await scrape({
        url: 'https://pokecabook.com/archives/26148',
        schema: {
        title: {
            selector: 'h1',
            extract: 'text',
        },
        images: {
            selector: 'img.lozad-img',
            extract: 'attr:data-src',
            multiple: true,
        },
        content: {
            selector: '.entry-content p',
            extract: 'text',
            multiple: true,
        },
        },
    });

    console.log('Title:', result.data[0]?.title);
    console.log('Duration:', result.meta.durationMs + 'ms');
    console.log('\nImages found:', (result.data[0]?.images as string[]).length);
    console.log((result.data[0]?.images as string[]).slice(0, 3));
    console.log('\nFirst paragraph:');
    console.log((result.data[0]?.content as string[])[0]);
}

main().catch(console.error);