import { numberTransform } from './numberTransform';

export const prettyAmount = (value: string) => {
  let newValue = value;
  if (+newValue <= 0) return '0';
  if (+newValue < 1) {
    newValue = String(Number(newValue).toFixed(8));
    newValue = newValue.replace(/0*\s*$/, '');
  } else if (+newValue > 10 && +newValue <= 100) {
    newValue = String(Number(newValue).toFixed(5));
  } else if (+newValue > 100 && +newValue <= 1000) {
    newValue = String(Number(newValue).toFixed(4));
  } else if (+newValue > 1000 && +newValue <= 10000) {
    newValue = String(Number(newValue).toFixed(3));
  } else if (+newValue > 10000 && +newValue <= 100000) {
    newValue = String(Number(newValue).toFixed(2));
  } else {
    newValue = String(Number(newValue).toFixed(1));
  }
  return newValue;
};

export const prettyPrice = (value: string) => {
  let newValue = value;
  if (+newValue < 1) {
    newValue = String(Number(newValue).toFixed(8));
  } else if (+newValue > 10 && +newValue <= 100) {
    newValue = String(Number(newValue).toFixed(5));
  } else if (+newValue > 100 && +newValue <= 1000) {
    newValue = String(Number(newValue).toFixed(4));
  } else if (+newValue > 1000 && +newValue <= 10000) {
    newValue = String(Number(newValue).toFixed(3));
  } else if (+newValue > 10000 && +newValue <= 100000) {
    newValue = String(Number(newValue).toFixed(2));
  } else {
    newValue = String(Number(newValue).toFixed(1));
  }
  newValue = newValue.split(',').join('.');
  newValue = newValue.replace(/0*\s*$/, '');
  newValue = newValue.replace(/\.*\s*$/, '');
  return newValue;
};

export const prettyBalance = (value: string) => {
  let newValue = value;
  if (+newValue < 1) {
    newValue = String(Number(newValue).toFixed(16));
  } else if (+newValue > 10 && +newValue <= 100) {
    newValue = String(Number(newValue).toFixed(5));
  } else if (+newValue > 100 && +newValue <= 1000) {
    newValue = String(Number(newValue).toFixed(4));
  } else if (+newValue > 1000 && +newValue <= 10000) {
    newValue = String(Number(newValue).toFixed(3));
  } else if (+newValue > 10000 && +newValue <= 100000) {
    newValue = String(Number(newValue).toFixed(2));
  } else {
    newValue = String(Number(newValue).toFixed(8));
  }
  newValue = newValue.split(',').join('.');
  newValue = newValue.replace(/0*\s*$/, '');
  newValue = newValue.replace(/\.*\s*$/, '');
  return newValue;
};

export const prettyPriceOld = (value: string) => {
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

/**
 * @example 'GEAR-ETH' -> 'LP GEAR-ETH'
 * @example 'GEAR' -> 'GEAR'
 * @example 'GEAR/ETH' -> 'GEAR/ETH'
 */
export const prettyToken = (token: string) => `${token.includes('-') ? 'LP ' : ''}${token}`;

/**
 * @example 'NaN' -> '0'
 * @example 'Infinity' -> '>1000000'
 * @example isMaybeExtraBigValue = true ===> '100000001' -> '>1000000'
 * @example isMaybeExtraBigValue = false ===> '100000001' -> numberTransform()
 * @example '13231.12321321' -> numberTransform() probably return '13231.12'
 */
export const getFormattedValue = (value: string | number, isMaybeExtraBigValue = false) => {
  const valueAsNumber = Number(value);
  if (Number.isNaN(valueAsNumber)) return '0';
  if (!Number.isFinite(valueAsNumber)) return '>1000000';
  if (isMaybeExtraBigValue && valueAsNumber > 1000000) return '>1000000';
  return numberTransform(value);
};
