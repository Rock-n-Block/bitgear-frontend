import React from 'react';
import { useMedia } from 'use-media';

import ArrowDownIcon from '../../assets/icons/arrow-down-icon.svg';
import ArrowUpIcon from '../../assets/icons/arrow-up-icon.svg';
import CoinIcon from '../../assets/images/coin.png';
import RocketIcon from '../../assets/images/rocket.png';
import { LineChart, Search } from '../../components';
import { sortColumn } from '../../utils/sortColumn';

import points from './points.json';

import s from './style.module.scss';

export type TableType = {
  symbol?: string;
  name?: string;
  price?: number;
  market?: number | string;
  volume?: number | string;
  priceChange: number;
};

export const PageExplore: React.FC = () => {
  const isWide = useMedia({ minWidth: '767px' });
  const [tableData, setTableData] = React.useState<TableType[]>([
    {
      symbol: 'Aave',
      name: 'BAVE',
      price: 594.36,
      market: '5.92B',
      volume: '632.05M',
      priceChange: 9.89,
    },
    {
      symbol: 'Aave',
      name: 'DAVE',
      price: 394.36,
      market: '4.92B',
      volume: '532.05M',
      priceChange: 0.89,
    },
    {
      symbol: 'Aave',
      name: 'AAVE',
      price: 394.36,
      market: '4.92B',
      volume: '532.05M',
      priceChange: 1.89,
    },
    {
      symbol: 'Aave',
      name: 'AAVE',
      price: 394.36,
      market: '4.92B',
      volume: '532.05M',
      priceChange: 1.89,
    },
    {
      symbol: 'Aave',
      name: 'AAVE',
      price: 394.36,
      market: '4.92B',
      volume: '532.05M',
      priceChange: 7.89,
    },
    {
      symbol: 'Aave',
      name: 'AAVE',
      price: 394.36,
      market: '4.92B',
      volume: '532.05M',
      priceChange: 1.89,
    },
    {
      symbol: 'Aave',
      name: 'СAVE',
      price: 394.36,
      market: '4.92B',
      volume: '532.05M',
      priceChange: 3.89,
    },
    {
      symbol: 'Aave',
      name: 'AAVE',
      price: 394.36,
      market: '4.92B',
      volume: '532.05M',
      priceChange: 1.89,
    },
  ]);
  const [flagSort, setFlagSort] = React.useState<string>('');

  const onSort = (param: string): void => {
    setTableData(sortColumn(param, tableData, flagSort));
    setFlagSort(param);
  };

  return (
    <div className={s.container}>
      <section className={s.containerTitle}>
        <Search />
      </section>
      <section className={s.containerButtons}>
        <div className={s.containerButtonsItem}>
          <img src={CoinIcon} alt="" /> <span> Recently Added</span>
        </div>
        <div className={s.containerButtonsItem}>
          <img src={RocketIcon} alt="" /> <span> Top Gainers</span>
        </div>
      </section>
      <section className={s.ExploreTable}>
        <table>
          {isWide ? (
            <thead>
              <th className={s.ExploreTableActive} onClick={onSort.bind(this, 'name')}>
                Token
              </th>
              <th>Symbol</th>
              <th onClick={onSort.bind(this, 'price')}>Price</th>
              <th onClick={onSort.bind(this, 'priceChange')}>Last 24h</th>
              <th onClick={onSort.bind(this, 'market')}>Market cap</th>
              <th onClick={onSort.bind(this, 'volume')}>Volume</th>
              <th> </th>
            </thead>
          ) : (
            <thead>
              <th className={s.ExploreTableActive} onClick={onSort.bind(this, 'name')}>
                Token
              </th>
              <th> </th>
              <th onClick={onSort.bind(this, 'priceChange')}>Last 24h</th>
            </thead>
          )}
          {isWide ? (
            <tbody>
              {tableData.map((token: TableType) => {
                const { symbol, name, price, priceChange, volume, market } = token;

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
                    <td>{market}</td>
                    <td>{volume}</td>
                    <td>
                      <LineChart
                        containerStyle={s.chartContainer}
                        svgStyle={s.chartSvg}
                        data={points.map((point) => point.close)}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          ) : (
            <tbody>
              {tableData.map((token: TableType, index: number) => {
                const { symbol, name, price, priceChange } = token;

                let priceChangeModel = (
                  <td className={`${s.mobilePriceChangeModel}`}>
                    <div className={s.flexContainerRow}>
                      <img src={ArrowUpIcon} alt="arrow up" />
                      {`${priceChange}`}%
                    </div>
                  </td>
                );

                if (priceChange < 0) {
                  priceChangeModel = (
                    <td className={`${s.accountTradeTableDown} ${s.mobilePriceChangeModel}`}>
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
                          <div>
                            {name}
                            <div className={s.mobileSymbol}>{symbol}</div>
                          </div>
                        </td>
                        <td>
                          <LineChart
                            containerStyle={s.chartContainer}
                            svgStyle={s.chartSvg}
                            data={points.map((point) => point.close)}
                          />
                        </td>
                        <td>
                          <div className={s.mobilePriceAndChangeContainer}>
                            <div className={s.mobilePrice}>${price}</div>
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
      </section>
    </div>
  );
};
