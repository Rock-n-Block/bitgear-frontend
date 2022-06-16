import { numberTransform } from '../../utils/numberTransform';

describe('numberTransform', () => {
  const amounts = ['1000000', '1000997', '1065997'];
  const transformedAmounts = ['1.00M', '1.00M', '1.06M'];
  it('should return rounded numbers like x.xxM', () => {
    amounts
      .map((amount) => numberTransform(amount))
      .forEach((transformedAmount, index) => {
        expect(transformedAmount).toBe(transformedAmounts[index]);
      });
  });

  // it('BigNumber if value is not null & nullable = true', () => {
  //   expect(toBigNumber('0', true)).toEqual(BIG_ZERO);
  //   expect(toBigNumber(0, true)).toEqual(BIG_ZERO);
  //   expect(toBigNumber(BIG_ZERO, true)).toEqual(BIG_ZERO);
  //   expect(toBigNumber(undefined, true)).toEqual(BIG_ZERO);
  // });

  // it('BigNumber if nullable is omitted', () => {
  //   const value = 1421;
  //   expect(toBigNumber(String(value))).toEqual(new BigNumber(value));
  //   expect(toBigNumber(value)).toEqual(new BigNumber(value));
  //   expect(toBigNumber(BIG_NUMBER)).toEqual(BIG_NUMBER);
  //   expect(toBigNumber(undefined)).toEqual(BIG_ZERO);
  // });
});
