const DIGITS_IN_GROUP = 3;

export const numberTransform = (arg: number | string): number | string => {
  const value = arg.toString().replace(/,/g, '.');

  if (value.split('.')[0].length <= 6) {
    // eslint-disable-next-line radix
    if (!value.split('.')[1]) return parseInt(value);
    return parseFloat(<string>value).toFixed(2);
  }

  const num: string[] = [];
  value
    .split('.')[0]
    .split('')
    .reverse()
    .forEach((item, i) => {
      num.push(item);
      if ((i + 1) % DIGITS_IN_GROUP === 0 && i !== value.length - 1) {
        num.push('.');
      }
    });

  const count = num.join('').split('.').length;

  let letter = '';
  if (count > 2) letter = 'M';
  if (count > 3) letter = 'B';
  if (count > 4) letter = 'T';

  const builtNumberWithGroupedDigits = num.reverse().join('').split('.');
  const [integerPart, decimalPart] = builtNumberWithGroupedDigits;

  return `${parseFloat(`${integerPart}.${decimalPart}`).toFixed(2)}${letter}`;
};
