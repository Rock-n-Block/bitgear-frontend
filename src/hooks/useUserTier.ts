import React, { useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';
import BigNumber from 'bignumber.js/bignumber';

import gearToken from '../data/gearToken';

interface ITierBounds {
  lowerBound: number;
  upperBound: number;
}

export const useUserTier = () => {
  const [gearBalance, setGearBalance] = React.useState<number | string>(0);
  const [userCurrentTier, setUserCurrentTier] = React.useState<number | string>(0);
  const { balances: userBalances } = useSelector(({ user }: any) => user);
  const userBalancesAsArray = React.useMemo(() => Object.entries(userBalances), [userBalances]);

  const getGearBalance = useCallback(() => {
    userBalancesAsArray.forEach((item: any) => {
      const [address, balance] = item;
      const { decimals, address: gearTokenAddress } = gearToken;
      const newBalance = +new BigNumber(balance)
        .dividedBy(new BigNumber(10).pow(decimals))
        .toString();
      if (address.toLowerCase() === gearTokenAddress.toLowerCase()) {
        setGearBalance(newBalance);
      }
      // const { decimals } = tokensByAddress[address];
    });
  }, [userBalancesAsArray]);

  const changeCurrentTier = useCallback(() => {
    const tiers: ITierBounds[] = [
      // {
      //   lowerBound: 70000,
      //   upperBound: 300000,
      // },
      {
        lowerBound: 4000,
        upperBound: 300000,
      },
      {
        lowerBound: 300000,
        upperBound: Infinity,
      },
      // {
      //   lowerBound: Infinity,
      //   upperBound: Infinity,
      // },
    ];
    tiers.forEach((tier, index) => {
      if (tier.lowerBound <= gearBalance && tier.upperBound > gearBalance) {
        setUserCurrentTier(index + 1);
      }
    });
  }, [gearBalance]);

  useEffect(() => {
    getGearBalance();
  }, [getGearBalance]);

  useEffect(() => {
    changeCurrentTier();
  }, [changeCurrentTier]);

  return { userCurrentTier };
};
