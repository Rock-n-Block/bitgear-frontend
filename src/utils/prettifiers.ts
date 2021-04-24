export const prettyAmount = (value: string) => {
  let newValue = value;
  if (newValue.length > 1 && Number(newValue) >= 1 && newValue.slice(0, 1)[0] === '0') {
    newValue = newValue.slice(1);
  }
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
