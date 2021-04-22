export const setToStorage = (key: string, data: any) => {
  localStorage.setItem(key, JSON.stringify(data));
};
