import * as fc from 'fast-check';

describe('Slugify - PBT', () => {
  test('should generate URL-safe output', () => {
    fc.assert(
      fc.property(fc.fullUnicodeString({ minLength: 5, maxLength: 5 }), (input) => {
        const slugified = slugify(input);
        const urlEscaped = encodeURIComponent(slugified);
        expect(urlEscaped).toEqual(slugified);
      }),
    );
  });

  test('should not be longer than input', () => {
    fc.assert(
      fc.property(fc.fullUnicodeString({ minLength: 5, maxLength: 5 }), (input) => {
        const output = slugify(input);
        expect(output.length).toBeLessThanOrEqual(input.length);
      }),
    );
  });

  test('should be identity for safe (hexadecimal) chars', () => {
    fc.assert(
      fc.property(fc.hexaString(), (input) => {
        const output = slugify(input);
        expect(output).toEqual(input);
      }),
    );
  });

  test('should never contain mor than 1 consecutive dash (-)', () => {
    fc.assert(
      fc.property(fc.fullUnicodeString({ minLength: 3 }), (input) => {
        const output = slugify(input);
        expect(output).not.toMatch(/.*--.*/);
      }),
    );
  });

  test('should never start with a dash(-)', () => {
    fc.assert(
      fc.property(fc.fullUnicodeString({ minLength: 3 }), (input) => {
        const output = slugify(input);
        expect(output).not.toMatch(/^-.+/);
      }),
    );
  });

  test('should never end with a dash(-)', () => {
    fc.assert(
      fc.property(fc.fullUnicodeString({ minLength: 3 }), (input) => {
        const output = slugify(input);
        expect(output).not.toMatch(/.+-$/);
      }),
    );
  });

  test('slugify is stable (slugify(slugify(x)) == slugify(x))', () => {
    fc.assert(
      fc.property(fc.fullUnicodeString(), (input) => {
        const slugified = slugify(input);
        const doubleSlugified = slugify(slugify(input));

        expect(doubleSlugified).toEqual(slugified);
      }),
    );
  });

  describe('Acceptance tests (examples)', () => {
    test.each([
      ['This is my article', 'this-is-my-article', 'example #1'],
      ["You won't believe this...", 'you-won-t-believe-this', 'example #2'],
      ["Do this. Don't do that!", 'do-this-don-t-do-that', 'example #3'],
      // extended edge cases
      ['Olé ¿ que pasa peña ?', 'ole-que-pasa-pena', 'extended Castellano example'],
      // ['À ma façon, je suis écoeuré ...', 'a-ma-facon-je-suis-ecoeure', 'extended French example'],
      // ['Hur är det? Hur mår du?', 'hur-ar-det-hur-mar-du', 'extended Swedish example'],
    ])('transform %p into %p (because %s)', (input, expected, reason) => {
      expect(slugify(input)).toEqual(expected);
    });
  });
});

function slugify(input: string): string {
  if (input === '') {
    return '';
  }
  const transformed = input
    .normalize('NFD')
    // remove accents and variations (diacritics)
    .replace(/\p{Diacritic}/gu, '')
    .toLocaleLowerCase()
    .replace(/[^\p{Letter}\p{Number}]/gu, '-')
    .replace(/-{2,}/g, '-')
    .replace(/-$/, '')
    .replace(/^-/, '');
  if (transformed === '') {
    return '-';
  }
  return transformed;
}
