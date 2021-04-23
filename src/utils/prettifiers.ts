export const prettyAmount = (value: string) => {
  let newValue = value;
  if (newValue.length > 1 && Number(newValue) >= 1 && newValue.slice(0, 1)[0] === '0') {
    newValue = newValue.slice(1);
  }
  // newValue = newValue.split(',').join('.');
  return newValue;
};
