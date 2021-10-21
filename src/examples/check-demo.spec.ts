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

  test('trim is stable', () => {
    fc.assert(
      fc.property(fc.fullUnicodeString(), (input) => {
        const trimmed = myTrim(input);
        const doubleTrimmed = myTrim(trimmed);
        expect(doubleTrimmed).toEqual(trimmed);
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

  test('does not impact strings without whitespace', () => {
    fc.assert(
      fc.property(
        fc.fullUnicodeString().filter((t) => containsWhitespace(t)),
        (input) => {
          expect(myTrim(input)).toEqual(input);
        },
      ),
    );
  });
});

function myTrim(input: string): string {
  if (input.length === 0) {
    return '';
  }
  return input.substring(0, input.length - 1);
}

function containsWhitespace(input: string): boolean {
  return /\s+/.test(input);
}
