import React from 'react';
import { useSelector } from 'react-redux';

import { MainTable } from '../../components';
import excludedCoins from '../../data/excludedCoins';
import excludedSymbols from '../../data/excludedSymbols';
import { CoinMarketCapService } from '../../services/CoinMarketCap';
import { sortColumn } from '../../utils/sortColumn';
import { TableType } from '../PageExplore';

import s from './style.module.scss';

const CoinMarketCap = new CoinMarketCapService();

export const PageListsRecentlyAdded: React.FC = React.memo(() => {
  const { tokens } = useSelector(({ zx }: any) => zx);
  const [data, setData] = React.useState([] as any);
  const [dataForTable, setDataForTable] = React.useState<TableType[]>([] as any);
  const [dataForTableMobile, setDataForTableMobile] = React.useState<TableType[]>([] as any);
  const [symbolsList, setSymbolsList] = React.useState([] as any);

  const [activeColumn, setActiveColumn] = React.useState<string>('');
  const [isArrowUp, setIsArrowUp] = React.useState<boolean>(true);
  const [flagSort, setFlagSort] = React.useState<string>('');
  const [sortFlagChanged, setSortFlagChanged] = React.useState<boolean>(false);
  const [isPending, setIsPending] = React.useState<boolean>(true);

  const getAllCoinsInfo = async (symbols: any): Promise<any> => {
    try {
      if (!symbols || symbols.length === 0) return [];
      const interval = 1000;
      const count = symbols.length / interval;
      // get tokens info
      let pairInfo: any = {};
      for (let ir = 0; ir < count; ir += 1) {
        const newSymbols = symbols.slice(interval * ir, interval * ir + interval).join(',');
        const resultGetCoinInfo = await CoinMarketCap.getAllCoinsInfo(newSymbols);
        console.log('PageExplore getAllCoinsInfo:', ir, resultGetCoinInfo);
        if (resultGetCoinInfo.status === 'SUCCESS') {
          pairInfo = Object.assign(pairInfo, resultGetCoinInfo.data);
        }
      }
      return pairInfo;
    } catch (e) {
      return e;
      console.error('App getTokensFromCoinMarketCap', e);
    }
  };

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
      setDataForTable(
        sortColumn('genesisDate', dataForTableLocal, '')
          .reverse()
          .slice(0, 12)
          .filter((token) => token.genesisDate !== null),
      );
      setDataForTableMobile(
        sortColumn('genesisDate', dataForTableLocal, '')
          .reverse()
          .slice(0, 5)
          .filter((token) => token.genesisDate !== null),
      );
      setData(dataForTableLocal);
    } catch (e) {
      console.error('Page Explorer fillData', e);
    }
  }, [symbolsList]);

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
    setData(sortColumn(param, dataForTable, flagSort));
    setDataForTable(sortColumn(param, dataForTable, flagSort));
    setDataForTableMobile(sortColumn(param, dataForTableMobile, flagSort));
    setFlagSort(param);
    setActiveColumn(param);
  };

  React.useEffect(() => {
    const arrayExcluded = excludedCoins.map((item: any) => {
      return item.symbol.toUpperCase();
    });

    const arrayOfSymbolsFiltered = tokens
      .filter((token: any) => {
        return !arrayExcluded.includes(token.symbol.toUpperCase());
      })
      .filter((token: any) => {
        if (!token.image) return false;
        if (token.symbol.match(/[^A-Za-z0-9]+/gi)) return false;
        if (excludedSymbols.includes(token.symbol)) return false;
        return true;
      });

    const listOfSymbols = arrayOfSymbolsFiltered.map((token: any) => {
      return token.symbol.toUpperCase();
    });

    setSymbolsList(listOfSymbols);
  }, [tokens]);

  React.useEffect(() => {
    fillData();
  }, [fillData]);

  React.useEffect(() => {
    console.log(data);
  }, [data]);

  return (
    <div className={s.container}>
      <section className={s.containerTitle}>
        <h1>Hot and new</h1>
      </section>
      <section className={s.ExploreTable}>
        <MainTable
          data={dataForTable}
          emitSorting={emitSorting}
          activeColumn={activeColumn}
          isArrowUp={isArrowUp}
          dataForMobile={dataForTableMobile}
        />
      </section>
    </div>
  );
});
