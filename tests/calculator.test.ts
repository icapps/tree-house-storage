import { plusTen } from '../src/lib/calculator';

describe('Calculator', () => {
  describe('plusTen', () => {
    it('Should increment a given number with 10', () => {
      const number = 10;
      const expectedResult = 20;

      expect(plusTen(number)).toEqual(expectedResult);
    })
  });
});
