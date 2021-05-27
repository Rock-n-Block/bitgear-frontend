import React from 'react';
import { useSelector } from 'react-redux';

import { MainTable } from '../../components';
import excludedCoins from '../../data/excludedCoins';
import { CoinMarketCapService } from '../../services/CoinMarketCap';
import { sortColumn } from '../../utils/sortColumn';
import { TableType } from '../PageExplore';

import s from './style.module.scss';

const CoinMarketCap = new CoinMarketCapService();

export const PageListsTopGainers: React.FC = React.memo(() => {
  const { tokens } = useSelector(({ zx }: any) => zx);
  const [data, setData] = React.useState([] as any);
  const [dataForTable, setDataForTable] = React.useState<TableType[]>([] as any);
  const [symbolsList, setSymbolsList] = React.useState([] as any);

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

  const fillData = React.useCallback(async () => {
    try {
      console.log('Loading *explore table data*...');
      const dataForTableLocal: any = [];

      console.log('DONE! *explore table data*');
      console.log('DATA', dataForTableLocal);

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

      setDataForTable(
        sortColumn('priceChange', dataForTableLocal, '')
          .reverse()
          .slice(0, 12)
          .filter((token) => token.priceChange >= 0),
      );
      setData(dataForTableLocal);
    } catch (e) {
      console.error('Page Explorer fillData', e);
    }
  }, [symbolsList]);

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
    fillData();
  }, [fillData]);

  React.useEffect(() => {
    console.log(data);
  }, [data]);

  return (
    <div className={s.container}>
      <section className={s.containerTitle}>
        <h1>Top performers</h1>
      </section>
      <section className={s.ExploreTable}>
        <MainTable data={dataForTable} dataForMobile={dataForTable.slice(0, 5)} />
      </section>
    </div>
  );
});
