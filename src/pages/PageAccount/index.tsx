import React from 'react';
import { useSelector } from 'react-redux';
import { useMedia } from 'use-media';

import ArrowDownIcon from '../../assets/icons/arrow-down-icon.svg';
import ArrowUpIcon from '../../assets/icons/arrow-up-icon.svg';
import CopyIcon from '../../assets/icons/copy-icon.svg';
import EthGlassIcon from '../../assets/images/logo/eth-glass-icon.svg';
import { sortColumn } from '../../utils/sortColumn';

import sE from '../PageExplore/style.module.scss';
import s from './style.module.scss';

type TableType = {
  symbol?: string;
  name?: string;
  price?: number;
  priceChange: number;
};

export const PageAccount: React.FC = () => {
  const isWide = useMedia({ minWidth: '767px' });
  const [tableData, setTableData] = React.useState<TableType[]>([
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
      price: 555.36,
      priceChange: -1.89,
    },
    {
      symbol: 'Aave',
      name: 'AAVE',
      price: 394.36,
      priceChange: 1.89,
    },
  ]);

  const [flagSort, setFlagSort] = React.useState<string>('');

  const onSort = (param: string): void => {
    setTableData(sortColumn(param, tableData, flagSort));
    setFlagSort(param);
  };

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
            {isWide ? (
              <thead>
                <th className={s.accountTradeTableActive} onClick={onSort.bind(this, 'name')}>
                  Token
                </th>
                <th>Symbol</th>
                <th onClick={onSort.bind(this, 'price')}>Price</th>
                <th onClick={onSort.bind(this, 'priceChange')}>Last 24h</th>
              </thead>
            ) : (
              <thead>
                <th className={s.accountTradeTableActive} onClick={onSort.bind(this, 'name')}>
                  Token
                </th>
                <th> </th>
                <th onClick={onSort.bind(this, 'priceChange')}>Last 24h</th>
              </thead>
            )}
            {isWide ? (
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
            ) : (
              <tbody>
                {tableData.map((token: TableType, index: number) => {
                  const { symbol, name, price, priceChange } = token;

                  let priceChangeModel = (
                    <td className={`${sE.mobilePriceChangeModel}`}>
                      <div className={sE.flexContainerRow}>
                        <img src={ArrowUpIcon} alt="arrow up" />
                        {`${priceChange}`}%
                      </div>
                    </td>
                  );

                  if (priceChange < 0) {
                    priceChangeModel = (
                      <td className={`${s.accountTradeTableDown} ${sE.mobilePriceChangeModel}`}>
                        <img src={ArrowDownIcon} alt="arrow down" />
                        {priceChange}%
                      </td>
                    );
                  }

                  return (
                    <>
                      {index < 5 && (
                        <tr>
                          <td>
                            {name}
                            <div className={sE.mobileSymbol}>{symbol}</div>
                          </td>
                          <td />
                          <td>
                            <div className={s.mobilePriceAndChangeContainer}>
                              <div className={sE.mobilePrice}>${price}</div>
                              {priceChangeModel}
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  );
                })}
              </tbody>
            )}
          </table>
        </div>
      </section>
    </div>
  );
};
