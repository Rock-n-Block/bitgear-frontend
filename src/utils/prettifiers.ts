export const prettyAmount = (value: string) => {
  let newValue = value;
  if (+newValue < 0) newValue = '0';
  // if (newValue.length > 1 && Number(newValue) >= 1 && newValue.slice(0, 1)[0] === '0') {
  //   newValue = newValue.slice(1);
  // }
  // newValue = newValue.split(',').join('.');
  return newValue;
};

export const prettyPrice = (value: string) => {
  const parts = value.toString().split('.');
  const part0Length = parts[0].length;
  let sliceLength = 10 - part0Length;
  if (sliceLength < 0) sliceLength = 0;
  if (parts[1]) parts[1] = parts[1].slice(0, sliceLength);
  return parts.join('.');
};

export const prettyPriceChange = (value: string) => {
  const parts = value.toString().split('.');
  if (parts[1]) parts[1] = parts[1].slice(0, 2);
  return parts.join('.');
};

export const prettyExpiration = (expiration: number) => {
  let time = expiration;
  let period = 'min';
  if (expiration >= 60) {
    time = expiration / 60;
    period = 'hour';
  }
  if (expiration >= 2 * 60) {
    time = expiration / 60;
    period = 'hours';
  }
  if (expiration > 24 * 60) {
    time = expiration / (24 * 60);
    period = 'day';
  }
  if (expiration >= 2 * 24 * 60) {
    time = expiration / (24 * 60);
    period = 'days';
  }
  return `${time} ${period}`;
};
