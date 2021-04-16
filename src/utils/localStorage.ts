export const setToStorage = (key: string, data: any) => {
  localStorage.setItem(key, JSON.stringify(data));
};

export const getFromStorage = (key: string) => {
  return JSON.parse(localStorage.getItem(key) || '');
};
