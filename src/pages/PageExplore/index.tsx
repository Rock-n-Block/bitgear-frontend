import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { useMedia } from 'use-media';

import CoinIcon from '../../assets/images/coin.png';
import RocketIcon from '../../assets/images/rocket.png';
import { MainTable, Pagination, Search } from '../../components';
import excludedCoins from '../../data/excludedCoins';
import { tableActions } from '../../redux/actions';
import { CoinMarketCapService } from '../../services/CoinMarketCap';
import { sortColumn } from '../../utils/sortColumn';

import s from './style.module.scss';

export type TableType = {
  symbol?: string;
  name?: string;
  price?: number | string;
  market?: number | string;
  volume?: number | string;
  priceChange: number | string;
};

const CoinMarketCap = new CoinMarketCapService();

export const PageExplore: React.FC = () => {
  const [isPending, setIsPending] = React.useState<boolean>(true);
  const [data, setData] = React.useState<TableType[]>([] as any);
  const [pageCount, setPageCount] = React.useState<number>(1);
  const [pageCountMobile, setPageCountMobile] = React.useState<number>(1);
  const [sortFlagChanged, setSortFlagChanged] = React.useState<boolean>(false);
  const [activeColumn, setActiveColumn] = React.useState<string>('');
  const [isArrowUp, setIsArrowUp] = React.useState<boolean>(true);
  const [flagSort, setFlagSort] = React.useState<string>('');
  const [dataForTable, setDataForTable] = React.useState<TableType[]>([] as any);
  const [dataForTableMobile, setDataForTableMobile] = React.useState<TableType[]>([] as any);
  const [symbolsList, setSymbolsList] = React.useState([] as any);
  const { tokens } = useSelector(({ zx }: any) => zx);

  const isWide = useMedia({ minWidth: '767px' });

  const dispatch = useDispatch();

  const setDataStore = React.useCallback((props: any) => dispatch(tableActions.setData(props)), [
    dispatch,
  ]);

  const getAllCoinsInfo = async (symbols: any): Promise<any> => {
    try {
      let pairInfo: any;
      const result = await CoinMarketCap.getAllCoinsInfo(symbols);
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

  const countDataForPagination = React.useCallback(() => {
    setPageCount(Math.ceil(data.length / 12));
    setPageCountMobile(Math.ceil(data.length / 5));
  }, [data.length]);

  const fillData = React.useCallback(async () => {
    try {
      setIsPending(true);
      console.log('Loading *explore table data*...');
      const dataForTableLocal: any = [];

      const resultGetAllCoinsInfo = await getAllCoinsInfo(symbolsList);

      const arrayOfTOkens = Object.keys(resultGetAllCoinsInfo).map((key) => {
        return resultGetAllCoinsInfo[key];
      });

      arrayOfTOkens.forEach((token: any) => {
        dataForTableLocal.push({
          name: token.name || token[0].name,
          symbol: token.symbol || token[1].symbol,
          marketCap: token.quote.USD.market_cap ?? '-',
          price: token.quote.USD.price ?? '-',
          priceChange: token.quote.USD.percent_change_24h ?? '-',
          volume: token.quote.USD.volume_24h ?? '-',
          genesisDate: token.date_added || '-',
        });
      });

      setIsPending(false);
      console.log('DONE! *explore table data*');
      console.log('DATA', dataForTableLocal);
      setDataForTable([...dataForTableLocal].slice(0, 12));
      setDataForTableMobile([...dataForTableLocal].slice(0, 5));
      setData(dataForTableLocal);
      setDataStore({ dataFromStore: dataForTableLocal });
    } catch (e) {
      console.error('Page Explorer fillData', e);
    }
  }, [setDataStore, symbolsList]);

  const emitChanges = (arg: any) => {
    setDataForTable(arg);
    setDataForTableMobile(arg);
  };
  const emitSorting = (param: any) => {
    if (isPending) {
      return;
    }
    if (param !== activeColumn) {
      setIsArrowUp(true);
      setSortFlagChanged(!sortFlagChanged);
    }
    if (param === activeColumn) {
      setIsArrowUp(!isArrowUp);
      setSortFlagChanged(!sortFlagChanged);
    }
    setData(sortColumn(param, data, flagSort));
    setDataForTable(sortColumn(param, data, flagSort).slice(0, 12));
    setDataForTableMobile(sortColumn(param, data, flagSort).slice(0, 5));
    setFlagSort(param);
    setActiveColumn(param);
  };

  React.useEffect(() => {
    const arrayExcluded = excludedCoins.map((item: any) => {
      return item.symbol.toUpperCase();
    });

    const arrayOfSymbolsFiltered = tokens.filter((token: any) => {
      return !arrayExcluded.includes(token.symbol.toUpperCase());
    });

    const listOfSymbols = arrayOfSymbolsFiltered.map((token: any) => {
      return token.symbol.toUpperCase();
    });

    setSymbolsList(listOfSymbols);
  }, [tokens]);

  React.useEffect(() => {
    if (tokens) {
      fillData();
    }
  }, [fillData, symbolsList, tokens]);

  React.useEffect(() => {
    countDataForPagination();
  }, [countDataForPagination]);

  React.useEffect(() => {
    if (isWide) {
      setDataForTable(data.slice(0, 12));
    }
    if (!isWide) {
      setDataForTableMobile(data.slice(0, 5));
    }
  }, [data, isWide]);

  return (
    <div className={s.container}>
      <section className={s.containerTitle}>
        <Search wide={isWide} />
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
          dataForMobile={dataForTableMobile}
          emitSorting={emitSorting}
          activeColumn={activeColumn}
          isArrowUp={isArrowUp}
        />
      </section>
      <section className={s.paginationContainer}>
        <Pagination
          pageCountProp={pageCount}
          pageCountMobileProp={pageCountMobile}
          emitChanges={emitChanges}
          data={data}
          sortFlagChangedProp={sortFlagChanged}
        />
      </section>
    </div>
  );
};
