import React from 'react';
import { useSelector } from 'react-redux';
import BigNumber from 'bignumber.js/bignumber';
import cns from 'classnames';
import moment from 'moment/moment';
import { useMedia } from 'use-media';
import { v1 as uuid } from 'uuid';

import ArrowDownIcon from '../../assets/icons/arrow-down-icon.svg';
import ArrowUpIcon from '../../assets/icons/arrow-up-icon.svg';
import CopyIcon from '../../assets/icons/copy-icon.svg';
import EthGlassIcon from '../../assets/images/logo/eth-glass-icon.svg';
import { Pagination } from '../../components';
import { Service0x } from '../../services/0x';
import { CryptoCompareService } from '../../services/CryptoCompareService';
import { sortColumn } from '../../utils/sortColumn';

import s from './style.module.scss';

type TableType = {
  symbol?: string;
  name?: string;
  price?: number;
  priceChange: number;
};

const address = {
  addressMaker: '0x9641494bfb611b7348c10ee7f57805cf4aca0e09',
};

const Zx = new Service0x();
const CryptoCompare = new CryptoCompareService();

export const PageAccount: React.FC = () => {
  const [data, setData] = React.useState<TableType[]>([] as any);
  const [orders, setOrders] = React.useState<any[]>([]);
  const [pageCount, setPageCount] = React.useState<number>(1);
  const { tokens } = useSelector(({ zx }: any) => zx);

  const [isPending, setIsPending] = React.useState<boolean>(true);
  const [sortFlagChanged, setSortFlagChanged] = React.useState<boolean>(false);
  const [activeColumn, setActiveColumn] = React.useState<string>('');

  const countDataForPagination = React.useCallback((): void => {
    setPageCount(Math.ceil(data.length / 12));
  }, [data.length]);

  React.useEffect(() => {
    countDataForPagination();
  }, [countDataForPagination]);

  const getExchangeOfPair = React.useCallback(
    async ({ symbolOne, symbolTwo }: any): Promise<any> => {
      try {
        const resultExchangeOfPair = await CryptoCompare.getExchangeOfPair({
          symbolOne,
          symbolTwo,
        });
        return resultExchangeOfPair;
      } catch (e) {
        console.error('getExchangeOfPair', e);
        return { status: 'ERROR', data: undefined };
      }
    },
    [],
  );

  const getHistory = React.useCallback(
    async ({ symbolOne, symbolTwo, limit, aggregate, exchange }: any): Promise<any> => {
      try {
        const resultGetHistory = await CryptoCompare.getHistory({
          symbolOne,
          symbolTwo,
          limit,
          aggregate,
          exchange,
        });
        return resultGetHistory.data;
      } catch (e) {
        console.error('getHistory', e);
        return { status: 'ERROR', data: undefined };
      }
    },
    [],
  );

  const [dataForTable, setDataForTable] = React.useState([] as any);

  const getOrders = React.useCallback(async (props: any) => {
    try {
      const resultGetOrdersMaker = await Zx.getOrders({
        trader: props.addressMaker,
      });
      const newOrders = resultGetOrdersMaker.data.records;
      setOrders(newOrders);
    } catch (e) {
      console.error('getOrders', e);
    }
  }, []);

  const findToken = React.useCallback(
    (tokenAddress: string) => {
      return tokens.find((token: any) => {
        return token.address.toLowerCase() === tokenAddress.toLowerCase();
      });
    },
    [tokens],
  );

  const fillData = React.useCallback(async (): Promise<void> => {
    setIsPending(true);
    console.log('Loading *account table data*...');
    const dataForTableLocal: any = [];
    const arr = [...orders];

    // eslint-disable-next-line no-restricted-syntax
    for (const item of arr) {
      const symbolMaker = findToken(item.order.makerToken)?.symbol;
      const symbolTaker = findToken(item.order.takerToken)?.symbol;

      if (!symbolTaker || !symbolTaker) {
        return;
      }

      // eslint-disable-next-line no-await-in-loop
      const resultGetExchangeOfPair = await getExchangeOfPair({
        symbolOne: symbolMaker,
        symbolTwo: symbolTaker,
      });

      const market = resultGetExchangeOfPair.data[0];
      // eslint-disable-next-line no-await-in-loop
      const resultOfGetHistory = await getHistory({
        symbolOne: symbolMaker,
        symbolTwo: symbolTaker,
        limit: '1',
        aggregate: '1',
        exchange: market,
      });

      const price = resultOfGetHistory[1]?.close - resultOfGetHistory[0]?.close;
      const amount = new BigNumber(item.order.takerAmount)
        .dividedBy(10 ** findToken(item.order.takerToken).decimals)
        .toString();
      dataForTableLocal.push({
        orderCreate: moment(item.metaData.createdAt).format('yyyy.MM.DD hh:mm'),
        orderExpire: moment(new Date(+item.order.expiry).toString()).format('yyyy.MM.DD hh:mm'),
        tradingPair: {
          symbolMaker,
          symbolTaker,
        },
        price,
        market,
        amount,
      });
    }
    setIsPending(false);
    console.log('DONE! *account table data*');
    setData([...dataForTableLocal]);
    setDataForTable([...dataForTableLocal].slice(0, 12));
  }, [findToken, getExchangeOfPair, getHistory, orders]);

  React.useEffect(() => {
    getOrders(address);
  }, [getOrders]);

  React.useEffect(() => {
    fillData();
  }, [fillData]);

  const isWide = useMedia({ minWidth: '767px' });

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

  const emitChanges = (arg: any) => {
    setDataForTable(arg);
    setSortFlagChanged(false);
  };
  React.useEffect(() => {}, [data, dataForTable]);

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
                <tr>
                  <th
                    className={cns(activeColumn === 'timestart' ? s.accountTradeTableActive : null)}
                    onClick={onSort.bind(this, 'timestart')}
                  >
                    Time start
                  </th>
                  <th>Time end</th>
                  <th>Trading pair</th>
                  <th>Amount</th>
                  <th>Price</th>
                </tr>
              </thead>
            ) : (
              <thead>
                <tr>
                  <th className={s.accountTradeTableActive} onClick={onSort.bind(this, 'name')}>
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
                    const { orderCreate, orderExpire, price, tradingPair, amount } = item;
                    let priceChangeModel = (
                      <td>
                        <img src={ArrowUpIcon} alt="arrow up" /> {`$${price}`}
                      </td>
                    );
                    if (price < 0) {
                      priceChangeModel = (
                        <td className={`${s.accountTradeTableDown}`}>
                          <img src={ArrowDownIcon} alt="arrow down" /> {`$${price}`}
                        </td>
                      );
                    }
                    if (price === 0) {
                      priceChangeModel = <td>{`$${price}`}</td>;
                    }
                    return (
                      <tr key={uuid()}>
                        <td>{orderCreate}</td>
                        <td>{orderExpire}</td>
                        <td>
                          {tradingPair.symbolMaker} / {tradingPair.symbolTaker}
                        </td>
                        <td>{amount}</td>
                        {priceChangeModel}
                      </tr>
                    );
                  })}
                </tbody>
              ) : null
              // mobile table body waits for a new design...
              // <tbody>
              //   {tableData.map((token: TableType) => {
              //     const { name, symbol, price, priceChange } = token;
              //
              //     let priceChangeModel = (
              //       <td>
              //         <img src={ArrowUpIcon} alt="arrow up" /> {`${priceChange}`}%
              //       </td>
              //     );
              //
              //     if (priceChange < 0) {
              //       priceChangeModel = (
              //         <td className={`${s.accountTradeTableDown}`}>
              //           <img src={ArrowDownIcon} alt="arrow down" />
              //           {priceChange}%
              //         </td>
              //       );
              //     }
              //
              //     return (
              //       <tr>
              //         <td>{name}</td>
              //         <td>{symbol}</td>
              //         <td>{price}$</td>
              //         {priceChangeModel}
              //       </tr>
              //     );
              //   })}
              // </tbody>
              // <tbody>
              //   {tableData.map((token: TableType, index: number) => {
              //     const { symbol, price, priceChange } = token;
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
              //               {dataForTable.orderCreate}
              //               <div className={s.mobileSymbol}>{symbol}</div>
              //             </td>
              //             <td />
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
        </div>
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
