const addressWithDots = (address: string): string => {
  if (!address) {
    return '';
  }
  return `${address.slice(0, 4)}....${address.slice(-4)}`;
};

export default addressWithDots;
