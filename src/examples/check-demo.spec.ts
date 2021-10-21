import * as fc from 'fast-check';

describe('examples - PBT', () => {
  test('trim shortens input', () => {
    fc.assert(
      fc.property(fc.fullUnicodeString(), (input) => {
        const trimmed = myTrim(input);
        expect(trimmed.length).toBeLessThanOrEqual(input.length);
      }),
    );
  });

  test('initial contains trimmed', () => {
    fc.assert(
      fc.property(fc.fullUnicodeString(), (input) => {
        const trimmed = myTrim(input);
        expect(input).toContain(trimmed);
      }),
    );
  });

  test('removed final whitespace', () => {
    fc.assert(
      fc.property(
        fc.fullUnicodeString().filter((t) => !containsWhitespace(t)),
        (initial) => {
          const trimmed = myTrim(initial + ' ');
          expect(trimmed).toEqual(initial);
        },
      ),
    );
  });
});

function myTrim(input: string): string {
  return '';
}

function containsWhitespace(input: string): boolean {
  return /\s+/.test(input);
}
