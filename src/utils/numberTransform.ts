// eslint-disable-next-line consistent-return
export const numberTransform = (arg: number | string) => {
  const num: any[number] = [];
  let letter = '';
  const value = arg.toString().replace(/,/g, '.');
  if (value.split('.')[0].length <= 6) {
    // eslint-disable-next-line radix
    if (!value.split('.')[1]) return parseInt(value);
    return parseFloat(<string>value).toFixed(2);
  }
  value
    .split('.')[0]
    .split('')
    .reverse()
    .forEach((item, i) => {
      num.push(item);
      if ((i + 1) % 3 === 0 && i !== value.length - 1) num.push('.');
    });

  const count = num.join('').split('.').length;

  if (count > 2) letter = 'M';
  if (count > 3) letter = 'B';
  if (count > 4) letter = 'T';

  return `${parseFloat(
    `${num.reverse().join('').split('.')[0]}.${num.reverse().join('').split('.')[1]}`,
  ).toFixed(2)}${letter}`;
};
