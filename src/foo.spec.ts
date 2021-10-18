import { doIt } from './foo';

describe('A Test', () => {
  test('should return true', () => {
    const actual = doIt();

    expect(actual).toBe(true);
  });
});
