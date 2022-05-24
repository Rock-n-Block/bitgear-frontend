export const validateOnlyNumbers = (value: string, decimals: number): boolean => {
  const regexpTemplate = String.raw`^\d+(\.)?(\d{0,${decimals}})?$|^$`;
  if (!value.match(new RegExp(regexpTemplate)) || value === '00') {
    return false;
  }

  return true;
};
