import React from 'react';
import { useSelector } from 'react-redux';

import { MainTable } from '../../components';
import excludedCoins from '../../data/excludedCoins';
import { CoinMarketCapService } from '../../services/CoinMarketCap';
import { sortColumn } from '../../utils/sortColumn';
import { TableType } from '../PageExplore';

import s from './style.module.scss';

const CoinMarketCap = new CoinMarketCapService();

export const PageListsRecentlyAdded: React.FC = React.memo(() => {
  const { tokens } = useSelector(({ zx }: any) => zx);
  const [data, setData] = React.useState([] as any);
  const [dataForTable, setDataForTable] = React.useState<TableType[]>([] as any);
  const [tokenPairs, setTokenPairs] = React.useState([] as any);

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

  const fillData = React.useCallback(async () => {
    try {
      console.log('Loading *explore table data*...');
      const dataForTableLocal: any = [];

      // eslint-disable-next-line no-restricted-syntax
      for (const token of tokenPairs) {
        // eslint-disable-next-line no-await-in-loop
        const resultGetPairInfo = await getCoinsInfo({
          symbolOne: token[0]?.symbol,
          symbolTwo: token[1]?.symbol,
        });

        if (token[1]?.symbol) {
          dataForTableLocal.push(
            {
              name: resultGetPairInfo[token[0].symbol.toUpperCase()].name,
              symbol: resultGetPairInfo[token[0].symbol.toUpperCase()].symbol,
              marketCap: resultGetPairInfo[token[0].symbol.toUpperCase()].quote.USD.market_cap,
              price: resultGetPairInfo[token[0].symbol.toUpperCase()].quote.USD.price,
              priceChange:
                resultGetPairInfo[token[0].symbol.toUpperCase()].quote.USD.percent_change_24h,
              volume: resultGetPairInfo[token[0].symbol.toUpperCase()].quote.USD.volume_24h,
              genesisDate: resultGetPairInfo[token[0].symbol.toUpperCase()].date_added,
            },
            {
              name: resultGetPairInfo[token[1].symbol.toUpperCase()].name,
              symbol: resultGetPairInfo[token[1].symbol.toUpperCase()].symbol,
              marketCap: resultGetPairInfo[token[1].symbol.toUpperCase()].quote.USD.market_cap,
              price: resultGetPairInfo[token[1].symbol.toUpperCase()].quote.USD.price,
              priceChange:
                resultGetPairInfo[token[1].symbol.toUpperCase()].quote.USD.percent_change_24h,
              volume: resultGetPairInfo[token[1].symbol.toUpperCase()].quote.USD.volume_24h,
              genesisDate: resultGetPairInfo[token[1].symbol.toUpperCase()].date_added,
            },
          );
        }

        if (!token[1]?.symbol) {
          dataForTableLocal.push({
            name: resultGetPairInfo[token[0].symbol.toUpperCase()].name,
            symbol: resultGetPairInfo[token[0].symbol.toUpperCase()].symbol,
            marketCap: resultGetPairInfo[token[0].symbol.toUpperCase()].quote.USD.market_cap,
            price: resultGetPairInfo[token[0].symbol.toUpperCase()].quote.USD.price,
            priceChange:
              resultGetPairInfo[token[0].symbol.toUpperCase()].quote.USD.percent_change_24h,
            volume: resultGetPairInfo[token[0].symbol.toUpperCase()].quote.USD.volume_24h,
            genesisDate: resultGetPairInfo[token[0].symbol.toUpperCase()].date_added,
          });
        }
      }
      console.log('DONE! *explore table data*');
      console.log('DATA', dataForTableLocal);
      setDataForTable(
        sortColumn('genesisDate', dataForTableLocal, '')
          .reverse()
          .slice(0, 12)
          .filter((token) => token.genesisDate !== null),
      );
      setData(dataForTableLocal);
    } catch (e) {
      console.error('Page Explorer fillData', e);
    }
  }, [tokenPairs]);

  const divideTokensOnPairs = React.useCallback((items: any) => {
    const arrayOfPairs: any = [];

    items.forEach((item: any, i: number) => {
      if (i % 2 === 0) {
        arrayOfPairs.push([items[i], items[i + 1]]);
      }
    });

    setTokenPairs(arrayOfPairs);
  }, []);

  React.useEffect(() => {
    const arrayExcluded = excludedCoins.map((item: any) => {
      return item.symbol;
    });

    divideTokensOnPairs(
      tokens.filter((token: any) => {
        return !arrayExcluded.includes(token.symbol.toUpperCase());
        // token.symbol.toUpperCase() !== 'BOOTY' &&
        // token.symbol.toUpperCase() !== 'BASED' &&
        // token.symbol.toUpperCase() !== 'CVL' &&
        // token.symbol.toUpperCase() !== 'ICN' &&
        // token.symbol.toUpperCase() !== 'YBCRV' &&
        // token.symbol.toUpperCase() !== 'YUSD' &&
        // token.symbol.toUpperCase() !== 'YDAI' &&
        // token.symbol.toUpperCase() !== 'YTUSD' &&
        // token.symbol.toUpperCase() !== 'YUSDC' &&
        // token.symbol.toUpperCase() !== 'SPANK'
      }),
    );
  }, [divideTokensOnPairs, tokens]);

  React.useEffect(() => {
    fillData();
  }, [fillData]);

  React.useEffect(() => {
    console.log(data);
  }, [data]);

  return (
    <div className={s.container}>
      <section className={s.containerTitle}>
        <h1>Recently Added</h1>
      </section>
      <section className={s.ExploreTable}>
        <MainTable data={dataForTable} dataForMobile={dataForTable.slice(0, 5)} />
      </section>
    </div>
  );
});
