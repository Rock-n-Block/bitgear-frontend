import React from 'react';

import ArrowDownIcon from '../../assets/icons/arrow-down-icon.svg';
import ArrowUpIcon from '../../assets/icons/arrow-up-icon.svg';
import CoinIcon from '../../assets/images/coin.png';
import RocketIcon from '../../assets/images/rocket.png';
import { InputWithDropdown, LineChart } from '../../components';
import { Label, SearchDropdown, SearchLabel } from '../PageMain';

import points from './points.json';

import s from './style.module.scss';

type TableType = {
  symbol?: string;
  name?: string;
  price?: number;
  market?: number | string;
  volume?: number | string;
  priceChange: number;
};

const tableData: TableType[] = [
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
];

export const PageExplore: React.FC = () => {
  const [searchValue, setSearchValue] = React.useState<string>('');
  const [searchResult, setSearchResult] = React.useState<any[]>([]);
  const [coins] = React.useState<any[]>([]);

  const matchSearch = (value: string) => {
    try {
      let result = coins.filter((coin) => {
        const includesInCoinName = coin.CoinName.toLowerCase().includes(value.toLowerCase());
        const includesInName = coin.Name.toLowerCase().includes(value.toLowerCase());
        if (includesInCoinName || includesInName) return true;
        return false;
      });
      result = result.slice(0, 5);
      console.log('matchSearch:', result);
      setSearchResult(result);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSearch = (e: string) => {
    setSearchValue(e);
    matchSearch(e);
  };

  return (
    <div className={s.container}>
      <section className={s.containerTitle}>
        <InputWithDropdown
          // open
          classContainer={s.containerInput}
          onChange={handleSearch}
          // onFocus={() => setOpenSearchDropdown(true)}
          // onBlur={() => setOpenSearchDropdown(false)}
          value={searchValue}
          label={<Label />}
          labelInner={<SearchLabel />}
          dropdown={<SearchDropdown items={searchResult} />}
          placeholder="Search token or input token address..."
        />
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
          <thead>
            <th className={s.ExploreTableActive}>Token</th>
            <th>Symbol</th>
            <th>Price</th>
            <th>Last 24h</th>
            <th>Market cap</th>
            <th>Volume</th>
            <th> </th>
          </thead>
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
                    <LineChart data={points} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>

      {/* <LineChart data={points} /> */}
    </div>
  );
};
