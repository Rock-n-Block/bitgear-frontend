export type Token = {
  address: string;
  symbol: string;
  decimals: number;
  image?: string;
};

/**
 *  @see https://docs.metamask.io/guide/registering-your-token.html#example
 */
export const addTokenToWallet = async ({
  address,
  decimals,
  symbol,
  image = '',
}: Token): Promise<boolean> => {
  try {
    // wasAdded is a boolean. Like any RPC method, an error may be thrown.
    const wasAdded = await window.ethereum.request({
      method: 'wallet_watchAsset',
      params: {
        type: 'ERC20', // Initially only supports ERC20, but eventually more!
        options: {
          address, // The address that the token is at.
          symbol, // A ticker symbol or shorthand, up to 5 chars.
          decimals, // The number of decimals in the token
          image, // A string url of the token logo
        },
      },
    });

    if (wasAdded) {
      return true;
    }
    return false;
  } catch (err) {
    console.log(err);
    return false;
  }
};
