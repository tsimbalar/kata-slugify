describe('slugify should', () => {
  test.each([[''], ['foo'], ['baz'], ['qux'], ['123'], ['-'], ['po-po']])(
    'return initial value for lowercase ascii (%p)',
    (input) => {
      expect(slugify(input)).toBe(input);
    },
  );

  test.each([
    ['PoPo', 'popo', 'lowercase'],
    ['po po', 'po-po', 'space'],
    ['po po po', 'po-po-po', 'several spaces'],
    ['po"po\'po', 'po-po-po', 'punctuation'],
    ['po\tpo', 'po-po', 'tab'],
  ])('transform %p into %p (because %s)', (input, expected, reason) => {
    expect(slugify(input)).toEqual(expected);
  });

  test.each([
    ['po po', 'po-po'],
    ['po  po', 'po-po'],
    ['po\t po', 'po-po'],
    ['po...po', 'po-po'],
    ['po.!.po', 'po-po'],
  ])('collapse whitespaces and punction from %p into %p', (input, expected) => {
    expect(slugify(input)).toEqual(expected);
  });

  test.each([
    ['popo ', 'popo'],
    ['popo  ', 'popo'],
    [' popo', 'popo'],
    ['  popo', 'popo'],
    ['popo!', 'popo'],
    ['!popo', 'popo'],
  ])('remove trailing "-" from %p into %p', (input, expected) => {
    expect(slugify(input)).toEqual(expected);
  });

  describe('Acceptance tests (examples)', () => {
    test.each([
      ['This is my article', 'this-is-my-article', 'example #1'],
      ["You won't believe this...", 'you-won-t-believe-this', 'example #2'],
      ["Do this. Don't do that!", 'do-this-don-t-do-that', 'example #3'],
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
    .toLocaleLowerCase()
    .replace(/\W/g, '-')
    .replace(/-{2,}/, '-')
    .replace(/-$/, '')
    .replace(/^-/, '');
  if (transformed === '') {
    return '-';
  }
  return transformed;
}
