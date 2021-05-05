export const sortColumn = (param: string, data: any[], flag: string): any[] => {
  const sortedTableData = [...data];
  if (flag !== param) {
    sortedTableData.sort((a: Record<string, any>, b: Record<string, any>) => {
      return a[param] > b[param] ? 1 : a[param] < b[param] ? -1 : 0;
    });
  } else sortedTableData.reverse();

  return sortedTableData;
};
