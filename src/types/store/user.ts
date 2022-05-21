export type UserState = {
  address?: string | null;
  network: null; // literally isn't used, don't know why this is added to 'wallet/chainId'
  balance: number;
  balances: Record<string, string>; // map address to value @see https://github.com/Rock-n-Block/bitgear-frontend/blob/e91f95b11e2deef4a3ec726d2c31206543afde01/src/App.tsx#L376
};
