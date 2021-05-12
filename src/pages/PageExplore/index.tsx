import React from 'react';
import { useSelector } from 'react-redux';
import cns from 'classnames';
import { useMedia } from 'use-media';
import { v1 as uuid } from 'uuid';

import ArrowDownIcon from '../../assets/icons/arrow-down-icon.svg';
import ArrowUpIcon from '../../assets/icons/arrow-up-icon.svg';
import CoinIcon from '../../assets/images/coin.png';
import RocketIcon from '../../assets/images/rocket.png';
import { LineChart, Pagination, Search } from '../../components';
import { CoinGeckoService } from '../../services/CoinGecko';
// import { CryptoCompareService } from '../../services/CryptoCompareService';
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

// const CryptoCompare = new CryptoCompareService();
const CoinGecko = new CoinGeckoService();

export const PageExplore: React.FC = () => {
  const isWide = useMedia({ minWidth: '767px' });
  const { tokens } = useSelector(({ zx }: any) => zx);
  const [isPending, setIsPending] = React.useState<boolean>(true);
  const [data, setData] = React.useState<TableType[]>([] as any);
  const [pageCount, setPageCount] = React.useState<number>(1);
  const [sortFlagChanged, setSortFlagChanged] = React.useState<boolean>(false);
  const [activeColumn, setActiveColumn] = React.useState<string>('');

  // const getHistory = React.useCallback(
  //   async ({ symbolOne, symbolTwo, limit, aggregate, exchange }: any): Promise<any> => {
  //     try {
  //       const resultGetHistory = await CryptoCompare.getHistory({
  //         symbolOne,
  //         symbolTwo,
  //         limit,
  //         aggregate,
  //         exchange,
  //       });
  //       return resultGetHistory.data;
  //     } catch (e) {
  //       console.error('getHistory', e);
  //       return { status: 'ERROR', data: undefined };
  //     }
  //   },
  //   [],
  // );

  // const getExchangeOfPair = React.useCallback(
  //   async ({ symbolOne, symbolTwo }: any): Promise<any> => {
  //     try {
  //       const resultExchangeOfPair = await CryptoCompare.getExchangeOfPair({
  //         symbolOne,
  //         symbolTwo,
  //       });
  //       return resultExchangeOfPair;
  //     } catch (e) {
  //       return { e };
  //       console.error('getExchangeOfPair', e);
  //     }
  //   },
  //   [],
  // );

  const [dataForTable, setDataForTable] = React.useState<TableType[]>([] as any);
  const getCoinInfo = React.useCallback(async ({ symbol }): Promise<any> => {
    try {
      const resultGetCoinInfo = await CoinGecko.getCoinInfo({ symbol });
      return resultGetCoinInfo;
    } catch (e) {
      console.error('getTokenInfo', e);
      return { status: 'ERROR', data: undefined };
    }
  }, []);

  const emitChanges = (arg: any) => {
    setDataForTable(arg);
  };

  const countDataForPagination = React.useCallback(() => {
    setPageCount(Math.ceil(data.length / 12));
  }, [data.length]);

  React.useEffect(() => {
    countDataForPagination();
  }, [countDataForPagination]);

  const fillData = React.useCallback(async () => {
    setIsPending(true);
    console.log('Loading *explore table data*...');
    const dataForTableLocal: any = [];

    // eslint-disable-next-line no-restricted-syntax
    for (const token of tokens) {
      // eslint-disable-next-line no-await-in-loop
      const resultGetCoinInfo = await getCoinInfo({ symbol: token.symbol });

      const marketCap = resultGetCoinInfo.data?.market_data.market_cap.usd;
      const volume = resultGetCoinInfo.data?.market_data.total_volume.usd;
      // const market = resultGetCoinInfo.data?.market_data.tickers.market.name;
      const price = resultGetCoinInfo.data?.market_data.current_price.usd;
      const priceChange = resultGetCoinInfo?.data.market_data.price_change_percentage_24h;

      // const resultGetExchangeOfPair = await getExchangeOfPair({
      //   symbolOne: token?.symbol,
      //   symbolTwo: 'USD',
      // });

      // const market = resultGetExchangeOfPair?.data[0];

      // const resultGetHistory = await getHistory({
      //   symbolOne: token?.symbol,
      //   symbolTwo: 'USD',
      //   limit: '1',
      //   aggregate: '1',
      //   exchange: market,
      // });

      // const price = resultGetHistory[0]?.close;
      // const priceChange = (resultGetHistory[1]?.close / resultGetHistory[0]?.close) * 100 - 100;

      dataForTableLocal.push({
        name: token.name,
        symbol: token.symbol,
        marketCap,
        price,
        priceChange,
        volume,
      });
    }
    setIsPending(false);
    console.log('DONE! *explore table data*');
    setDataForTable([...dataForTableLocal].slice(0, 12));
    setData([...dataForTableLocal]);
  }, [getCoinInfo, tokens]);

  React.useEffect(() => {
    fillData();
  }, [fillData]);

  const [flagSort, setFlagSort] = React.useState<string>('');

  const onSort = (param: string): void => {
    if (isPending) {
      return;
    }
    setData(sortColumn(param, data, flagSort));
    setDataForTable(sortColumn(param, data, flagSort).slice(0, 12));
    setFlagSort(param);
    setSortFlagChanged(true);
    setActiveColumn(param);
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
              <tr>
                <th
                  className={cns(activeColumn === 'name' ? s.ExploreTableActive : null)}
                  onClick={onSort.bind(this, 'name')}
                >
                  Token
                </th>
                <th>Symbol</th>
                <th
                  className={cns(activeColumn === 'price' ? s.ExploreTableActive : null)}
                  onClick={onSort.bind(this, 'price')}
                >
                  Price
                </th>
                <th
                  className={cns(activeColumn === 'priceChange' ? s.ExploreTableActive : null)}
                  onClick={onSort.bind(this, 'priceChange')}
                >
                  Last 24h
                </th>
                <th
                  className={cns(activeColumn === 'market' ? s.ExploreTableActive : null)}
                  onClick={onSort.bind(this, 'market')}
                >
                  Market cap
                </th>
                <th
                  className={cns(activeColumn === 'volume' ? s.ExploreTableActive : null)}
                  onClick={onSort.bind(this, 'volume')}
                >
                  Volume
                </th>
                <th> </th>
              </tr>
            </thead>
          ) : (
            <thead>
              <tr>
                <th className={s.ExploreTableActive} onClick={onSort.bind(this, 'name')}>
                  Token
                </th>
                <th> </th>
                <th onClick={onSort.bind(this, 'priceChange')}>Last 24h</th>
              </tr>
            </thead>
          )}
          {
            isWide ? (
              <tbody>
                {dataForTable.map((item: any) => {
                  const { name, symbol, price, priceChange, marketCap, volume } = item;

                  let priceChangeModel = (
                    <td className={s.priceChangeUp}>
                      <img src={ArrowUpIcon} alt="arrow up" /> {`${priceChange}`}%
                    </td>
                  );

                  if (priceChange < 0) {
                    priceChangeModel = (
                      <td className={`${s.ExploreTableDown}`}>
                        <img src={ArrowDownIcon} alt="arrow down" />
                        {priceChange}%
                      </td>
                    );
                  }
                  if (priceChange === 0) {
                    priceChangeModel = <td>{`${priceChange}%`}</td>;
                  }

                  return (
                    <tr key={uuid()}>
                      <td>{name}</td>
                      <td>{symbol}</td>
                      <td>${price}</td>
                      {priceChangeModel}
                      <td>{marketCap}</td>
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
            ) : // mobile table body waits for a new design...
            // <tbody>
            // {tableData.map((token: TableType) => {
            //   const { symbol, name, price, priceChange, volume, market } = token;
            //
            //   let priceChangeModel = (
            //     <td>
            //       <img src={ArrowUpIcon} alt="arrow up" /> {`${priceChange}`}%
            //     </td>
            //   );
            //
            //   if (priceChange < 0) {
            //     priceChangeModel = (
            //       <td className={`${s.accountTradeTableDown}`}>
            //         <img src={ArrowDownIcon} alt="arrow down" />
            //         {priceChange}%
            //       </td>
            //     );
            //   }
            //
            //   return (
            //     <tr>
            //       <td>{name}</td>
            //       <td>{symbol}</td>
            //       <td>{price}$</td>
            //       {priceChangeModel}
            //       <td>{market}</td>
            //       <td>{volume}</td>
            //       <td>
            //         <LineChart
            //           containerStyle={s.chartContainer}
            //           svgStyle={s.chartSvg}
            //           data={points.map((point) => point.close)}
            //         />
            //       </td>
            //     </tr>
            //   );
            // })}
            // </tbody>
            null
            // <tbody>
            //   {tableData.map((token: TableType, index: number) => {
            //     const { symbol, name, price, priceChange } = token;
            //
            //     let priceChangeModel = (
            //       <td className={`${s.mobilePriceChangeModel}`}>
            //         <div className={s.flexContainerRow}>
            //           <img src={ArrowUpIcon} alt="arrow up" />
            //           {`${priceChange}`}%
            //         </div>
            //       </td>
            //     );
            //
            //     if (priceChange < 0) {
            //       priceChangeModel = (
            //         <td className={`${s.accountTradeTableDown} ${s.mobilePriceChangeModel}`}>
            //           <img src={ArrowDownIcon} alt="arrow down" />
            //           {priceChange}%
            //         </td>
            //       );
            //     }
            //
            //     return (
            //       <>
            //         {index < 5 && (
            //           <tr>
            //             <td>
            //               <div>
            //                 {name}
            //                 <div className={s.mobileSymbol}>{symbol}</div>
            //               </div>
            //             </td>
            //             <td>
            //               <LineChart
            //                 containerStyle={s.chartContainer}
            //                 svgStyle={s.chartSvg}
            //                 data={points.map((point) => point.close)}
            //               />
            //             </td>
            //             <td>
            //               <div className={s.mobilePriceAndChangeContainer}>
            //                 <div className={s.mobilePrice}>${price}</div>
            //                 {priceChangeModel}
            //               </div>
            //             </td>
            //           </tr>
            //         )}
            //       </>
            //     );
            //   })}
            // </tbody>
          }
        </table>
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
