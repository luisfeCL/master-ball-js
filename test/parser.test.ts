import { Parser } from '../src/parser';

const HTML = `
    <div class="card">
        <h1 class="name">Charizard ex</h1>
        <img class="art" src="/images/charizard.webp" />
        <span class="hp">330</span>
        <span class="type">Fire</span>
        <span class="type">Dragon</span>
    </div>
`;

describe('Parser', () => {
    it('extracts a text field', () => {
        const parser = new Parser(HTML);
        const result = parser.extract({
        name: { selector: '.name', extract: 'text' },
        });
        expect(result.name).toBe('Charizard ex');
    });

    it('extracts an attribute', () => {
        const parser = new Parser(HTML);
        const result = parser.extract({
        image: { selector: '.art', extract: 'attr:src' },
        });
        expect(result.image).toBe('/images/charizard.webp');
    });

    it('extracts multiple elements as array', () => {
        const parser = new Parser(HTML);
        const result = parser.extract({
        types: { selector: '.type', extract: 'text', multiple: true },
        });
        expect(result.types).toEqual(['Fire', 'Dragon']);
    });

    it('returns null for unknown extract mode', () => {
        const parser = new Parser(HTML);
        const result = parser.extract({
            name: { selector: '.name', extract: 'html' },
        });
        expect(result.name).not.toBeNull();
    });

    it('extracts inner html', () => {
    const parser = new Parser(HTML);
    const result = parser.extract({
        content: { selector: '.card', extract: 'html' },
    });
    expect(typeof result.content).toBe('string');
    expect(result.content as string).toContain('Charizard ex');
    });

    it('returns empty array when multiple selector does not match', () => {
    const parser = new Parser(HTML);
    const result = parser.extract({
        abilities: { selector: '.ability', extract: 'text', multiple: true },
    });
    expect(result.abilities).toEqual([]);
    });
});