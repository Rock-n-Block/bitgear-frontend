import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import CoinIcon from '../../assets/images/coin.png';
import RocketIcon from '../../assets/images/rocket.png';
import { MainTable, Pagination, Search } from '../../components';
import { tableActions } from '../../redux/actions';
import { CoinMarketCapService } from '../../services/CoinMarketCap';
import { sortColumn } from '../../utils/sortColumn';

import s from './style.module.scss';

export type TableType = {
  symbol?: string;
  name?: string;
  price?: number;
  market?: number | string;
  volume?: number | string;
  priceChange: number;
};

const CoinMarketCap = new CoinMarketCapService();

export const PageExplore: React.FC = () => {
  const [isPending, setIsPending] = React.useState<boolean>(true);
  const [data, setData] = React.useState<TableType[]>([] as any);
  const [pageCount, setPageCount] = React.useState<number>(1);
  const [sortFlagChanged, setSortFlagChanged] = React.useState<boolean>(false);
  const [activeColumn, setActiveColumn] = React.useState<string>('');
  const [isArrowUp, setIsArrowUp] = React.useState<boolean>(true);
  const [flagSort, setFlagSort] = React.useState<string>('');
  const [dataForTable, setDataForTable] = React.useState<TableType[]>([] as any);
  const [tokenPairs, setTokenPairs] = React.useState([] as any);
  const { tokens } = useSelector(({ zx }: any) => zx);

  const dispatch = useDispatch();

  const setDataStore = React.useCallback((props: any) => dispatch(tableActions.setData(props)), [
    dispatch,
  ]);

  const getCoinsInfo = async ({ symbolOne, symbolTwo }: any): Promise<any> => {
    try {
      let pairInfo: any;
      const result = await CoinMarketCap.getTwoCoinsInfo({ symbolOne, symbolTwo });
      // console.log('App getTokensFromCoinMarketCap:', result.data);
      if (result.status === 'SUCCESS') {
        pairInfo = result.data;
      }
      return pairInfo;
    } catch (e) {
      return e;
      console.error('App getTokensFromCoinMarketCap', e);
    }
  };

  const divideTokensOnPairs = React.useCallback((items: any) => {
    const arrayOfPairs: any = [];

    items.forEach((item: any, i: number) => {
      if (i % 2 === 0) {
        arrayOfPairs.push([items[i], items[i + 1]]);
      }
    });

    setTokenPairs(arrayOfPairs);
  }, []);

  const countDataForPagination = React.useCallback(() => {
    setPageCount(Math.ceil(data.length / 12));
  }, [data.length]);

  const fillData = React.useCallback(async () => {
    try {
      setIsPending(true);
      console.log('Loading *explore table data*...');
      const dataForTableLocal: any = [];

      // eslint-disable-next-line no-restricted-syntax
      for (const token of tokenPairs) {
        // eslint-disable-next-line no-await-in-loop
        const resultGetPairInfo = await getCoinsInfo({
          symbolOne: token[0].symbol,
          symbolTwo: token[1]?.symbol,
        });

        if (token[1]?.symbol) {
          dataForTableLocal.push(
            {
              name: resultGetPairInfo[token[0].symbol].name,
              symbol: resultGetPairInfo[token[0].symbol].symbol,
              marketCap: resultGetPairInfo[token[0].symbol].quote.USD.market_cap,
              price: resultGetPairInfo[token[0].symbol].quote.USD.price,
              priceChange: resultGetPairInfo[token[0].symbol].quote.USD.percent_change_24h,
              volume: resultGetPairInfo[token[0].symbol].quote.USD.volume_24h,
              genesisDate: resultGetPairInfo[token[0].symbol].date_added,
            },
            {
              name: resultGetPairInfo[token[1].symbol].name,
              symbol: resultGetPairInfo[token[1].symbol].symbol,
              marketCap: resultGetPairInfo[token[1].symbol].quote.USD.market_cap,
              price: resultGetPairInfo[token[1].symbol].quote.USD.price,
              priceChange: resultGetPairInfo[token[1].symbol].quote.USD.percent_change_24h,
              volume: resultGetPairInfo[token[1].symbol].quote.USD.volume_24h,
              genesisDate: resultGetPairInfo[token[1].symbol].date_added,
            },
          );
        }

        if (!token[1]?.symbol) {
          dataForTableLocal.push({
            name: resultGetPairInfo[token[0].symbol].name,
            symbol: resultGetPairInfo[token[0].symbol].symbol,
            marketCap: resultGetPairInfo[token[0].symbol].quote.USD.market_cap,
            price: resultGetPairInfo[token[0].symbol].quote.USD.price,
            priceChange: resultGetPairInfo[token[0].symbol].quote.USD.percent_change_24h,
            volume: resultGetPairInfo[token[0].symbol].quote.USD.volume_24h,
            genesisDate: resultGetPairInfo[token[0].symbol].date_added,
          });
        }
      }

      setIsPending(false);
      console.log('DONE! *explore table data*');
      console.log('DATA', dataForTableLocal);
      setDataForTable([...dataForTableLocal].slice(0, 12));
      setData(dataForTableLocal);
      setDataStore({ dataFromStore: dataForTableLocal });
    } catch (e) {
      console.error('Page Explorer fillData', e);
    }
  }, [setDataStore, tokenPairs]);

  const emitChanges = (arg: any) => {
    setDataForTable(arg);
  };

  const emitSorting = (param: any) => {
    if (isPending) {
      return;
    }
    if (param !== activeColumn) {
      setIsArrowUp(true);
    }
    if (param === activeColumn) {
      setIsArrowUp(!isArrowUp);
    }
    setData(sortColumn(param, data, flagSort));
    setDataForTable(sortColumn(param, data, flagSort).slice(0, 12));
    setFlagSort(param);
    setSortFlagChanged(true);
    setActiveColumn(param);
  };

  React.useEffect(() => {
    divideTokensOnPairs(tokens);
  }, [divideTokensOnPairs, tokens]);

  React.useEffect(() => {
    fillData();
  }, [fillData]);

  React.useEffect(() => {
    countDataForPagination();
  }, [countDataForPagination]);

  return (
    <div className={s.container}>
      <section className={s.containerTitle}>
        <Search />
      </section>
      <section className={s.containerButtons}>
        <Link className={s.containerButtonsItem} to="/lists/recently-added">
          <img src={CoinIcon} alt="CoinIcon" /> <span> Recently Added</span>
        </Link>
        <Link className={s.containerButtonsItem} to="/lists/top-gainers">
          <img src={RocketIcon} alt="RocketIcon" /> <span> Top Gainers</span>
        </Link>
      </section>
      <section className={s.ExploreTable}>
        <MainTable
          data={dataForTable}
          emitSorting={emitSorting}
          activeColumn={activeColumn}
          isArrowUp={isArrowUp}
        />
      </section>
      <section className={s.paginationContainer}>
        <Pagination
          pageCount={pageCount}
          emitChanges={emitChanges}
          data={data}
          sortFlagChanged={sortFlagChanged}
        />
      </section>
    </div>
  );
};
