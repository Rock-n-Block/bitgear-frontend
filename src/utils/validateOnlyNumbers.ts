export const validateOnlyNumbers = (value: string): boolean => {
  // eslint-disable-next-line no-restricted-globals
  if (!value.match(/^\d+(\.)?(\d{1,9})?$|^$/) || value === '00') {
    return false;
  }

  return true;
};
