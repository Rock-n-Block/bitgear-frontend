import React from 'react';
import { useSelector } from 'react-redux';

import ArrowDownIcon from '../../assets/icons/arrow-down-icon.svg';
import ArrowUpIcon from '../../assets/icons/arrow-up-icon.svg';
import CopyIcon from '../../assets/icons/copy-icon.svg';
import EthGlassIcon from '../../assets/images/logo/eth-glass-icon.svg';

import s from './style.module.scss';

type TableType = {
  symbol?: string;
  name?: string;
  price?: number;
  priceChange: number;
};

const tableData: TableType[] = [
  {
    symbol: 'Aave',
    name: 'AAVE',
    price: 394.36,
    priceChange: 1.89,
  },
  {
    symbol: 'Aave',
    name: 'AAVE',
    price: 394.36,
    priceChange: 1.89,
  },
  {
    symbol: 'Aave',
    name: 'AAVE',
    price: 394.36,
    priceChange: 1.89,
  },
  {
    symbol: 'Aave',
    name: 'AAVE',
    price: 394.36,
    priceChange: -1.89,
  },
  {
    symbol: 'Aave',
    name: 'AAVE',
    price: 394.36,
    priceChange: 1.89,
  },
  {
    symbol: 'Aave',
    name: 'AAVE',
    price: 394.36,
    priceChange: -1.89,
  },
  {
    symbol: 'Aave',
    name: 'AAVE',
    price: 394.36,
    priceChange: 1.89,
  },
];

export const PageAccount: React.FC = () => {
  const { address: userAddress = 'Address', balance: userBalance = 0 } = useSelector(
    ({ user }: any) => user,
  );

  return (
    <div className={s.container}>
      <section className={s.containerTitle}>
        <div className={s.containerTitleBlock}>
          <h1>Your Account</h1>
          <span>{userAddress === '' ? '0xca807vad7fv...' : userAddress}</span>
        </div>
        <div className={s.accountMenu}>
          <span className={s.accountMenuActive}>Balance</span>
          <span className={s.accountMenuItem}>Trade History</span>
        </div>
      </section>

      <section className={s.accountFunds}>
        <div className={s.accountFundsItem}>
          <div className={s.accountFundsCard}>
            <h3>Your balance:</h3>
            <span>{userBalance} ETH</span>
            <img src={EthGlassIcon} alt="ehereum logo" />
          </div>
          <div className={s.accountFundsDeposit}>
            <h3>Deposit more funds</h3>
            <div className={s.accountFundsDepositCopy}>
              <span>0x9C3fD81263...337317c0404d</span>
              <img src={CopyIcon} alt="copy icon" />
            </div>
          </div>
        </div>
      </section>

      <section className={s.accountTrade}>
        <h2>Order History</h2>

        <div className={s.accountTradeHistory}>
          <table className={s.accountTradeTable}>
            <thead>
              <th className={s.accountTradeTableActive}>Token</th>
              <th>Symbol</th>
              <th>Price</th>
              <th>Last 24h</th>
            </thead>
            <tbody>
              {tableData.map((token: TableType) => {
                const { symbol, name, price, priceChange } = token;

                let priceChangeModel = (
                  <td>
                    <img src={ArrowUpIcon} alt="arrow up" /> {`${priceChange}`}%
                  </td>
                );

                if (priceChange < 0) {
                  priceChangeModel = (
                    <td className={`${s.accountTradeTableDown}`}>
                      <img src={ArrowDownIcon} alt="arrow down" />
                      {priceChange}%
                    </td>
                  );
                }

                return (
                  <tr>
                    <td>{name}</td>
                    <td>{symbol}</td>
                    <td>{price}$</td>
                    {priceChangeModel}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
