export const setToStorage = (key: string, data: any) => {
  localStorage.setItem(key, JSON.stringify(data));
};

export const getFromStorage = (key: string) => {
  const result = localStorage.getItem(key);
  if (result === null) return result;
  return JSON.parse(localStorage.getItem(key) || '');
};
