import React from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { useSelector } from 'react-redux';
import { Link, Route, Switch, useLocation, useRouteMatch } from 'react-router-dom';
import BigNumber from 'bignumber.js/bignumber';
import cns from 'classnames';
import _ from 'lodash';
import moment from 'moment/moment';
import { useMedia } from 'use-media';
import { v1 as uuid } from 'uuid';

import ArrowDownIcon from '../../assets/icons/arrow-down-icon.svg';
import { ReactComponent as IconArrowDownWhite } from '../../assets/icons/arrow-down-white.svg';
import ArrowUpIcon from '../../assets/icons/arrow-up-icon.svg';
import { ReactComponent as IconCopy } from '../../assets/icons/copy-icon.svg';
import EthGlassIcon from '../../assets/images/logo/eth-glass-icon.svg';
import imageTokenPay from '../../assets/images/token.png';
import { Pagination } from '../../components';
import { Service0x } from '../../services/0x';
import { CryptoCompareService } from '../../services/CryptoCompareService';
import { numberTransform } from '../../utils/numberTransform';
import { prettyPrice } from '../../utils/prettifiers';
import { sortColumn } from '../../utils/sortColumn';

import s from './style.module.scss';

type TableType = {
  symbol?: string;
  name?: string;
  price?: number;
  priceChange: number;
};

const Zx = new Service0x();
const CryptoCompare = new CryptoCompareService();

export const PageAccount: React.FC = () => {
  const match = useRouteMatch();
  const location = useLocation();
  const { pathname } = location;
  // console.log('PageAccount match, location:', match, location);

  const [data, setData] = React.useState<any[]>([] as any);
  const [dataForTable, setDataForTable] = React.useState<any[]>([] as any);
  const [dataForTableMobile, setDataForTableMobile] = React.useState<TableType[]>([] as any);
  const [orders, setOrders] = React.useState<any[]>([]);
  const [pageCount, setPageCount] = React.useState<number>(1);
  const [pageCountMobile, setPageCountMobile] = React.useState<number>(1);
  const [flagSort, setFlagSort] = React.useState<string>('');
  const [isAddressCopied, setIsAddressCopied] = React.useState<boolean>(false);

  const { tokens, tokensByAddress, tokensBySymbol } = useSelector(({ zx }: any) => zx);
  const { address: userAddress = 'Address', balance: userBalance = 0 } = useSelector(
    ({ user }: any) => user,
  );
  const { balances: userBalances } = useSelector(({ user }: any) => user);
  const { loadingBalances } = useSelector(({ status }: any) => status);

  const [isPending, setIsPending] = React.useState<boolean>(true);
  const [sortFlagChanged, setSortFlagChanged] = React.useState<boolean>(false);
  const [isArrowUp, setIsArrowUp] = React.useState<boolean>(true);
  const [activeColumn, setActiveColumn] = React.useState<string>('');
  const [userBalancesFiltered, setUserBalancesFiltered] = React.useState<any>({});

  const userBalancesAsArray = Object.entries(userBalancesFiltered);

  const isWide = useMedia({ minWidth: '767px' });

  const isBalancePage = pathname === '/account';
  const isOrdersPage = pathname === '/account/orders';

  const isLoadingBalancesDone = loadingBalances === 'done';
  const isLoadingBalancesError = loadingBalances === 'error';
  const isNoBalances = userBalancesAsArray.length === 0;

  const countDataForPagination = React.useCallback((): void => {
    setPageCount(Math.ceil(data.length / 12));
    setPageCountMobile(Math.ceil(data.length / 5));
  }, [data.length]);

  const getTokenBySymbol = React.useCallback(
    (symbol: string) => {
      const tokenEmpty = { name: 'Currency', symbol: null, image: imageTokenPay };
      try {
        const token = tokens.filter((item: any) => item.symbol === symbol);
        return token.length > 0 ? token[0] : tokenEmpty;
      } catch (e) {
        console.error(e);
        return tokenEmpty;
      }
    },
    [tokens],
  );

  const filterAndSortUserBalances = React.useCallback(() => {
    try {
      const newBalances = _.pickBy(userBalances, (v) => v !== null && v !== undefined && v !== 0);
      const newBalancesWithSymbols: any = {};
      Object.entries(newBalances).map((item) => {
        const [address, balance] = item;
        const { symbol, decimals } = tokensByAddress[address];
        const newBalance = new BigNumber(balance).dividedBy(new BigNumber(10).pow(decimals));
        newBalancesWithSymbols[symbol] = newBalance;
        return null;
      });
      setUserBalancesFiltered(newBalancesWithSymbols);
    } catch (e) {
      console.error(e);
    }
  }, [tokensByAddress, userBalances]);

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

  const getPriceOfPairFrom0x = React.useCallback(
    async ({ symbolOne, symbolTwo, amount }: any): Promise<any> => {
      try {
        const { address: sellToken, decimals } = tokensBySymbol[symbolOne];
        const { address: buyToken } = tokensBySymbol[symbolTwo];
        const resultGetPriceOfPairFrom0x = await Zx.getPrice({
          buyToken,
          sellToken,
          sellAmount: amount,
          decimals,
        });
        console.log('PageAccount getPriceOfPairFrom0x', resultGetPriceOfPairFrom0x);
        return resultGetPriceOfPairFrom0x;
      } catch (e) {
        console.error('PageAccount getPriceOfPairFrom0x', e);
        return { status: 'ERROR', data: undefined };
      }
    },
    [tokensBySymbol],
  );

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

  const getOrders = React.useCallback(async (props: any) => {
    try {
      const resultGetOrdersMaker = await Zx.getOrders({
        trader: props,
      });
      const newOrders = resultGetOrdersMaker.data.records;
      setOrders(newOrders);
      console.error('PageAccount getOrders', resultGetOrdersMaker);
    } catch (e) {
      console.error('PageAccount getOrders', e);
    }
  }, []);

  const findToken = React.useCallback(
    (tokenAddress: string) => {
      try {
        return tokens.find((token: any) => {
          return token.address.toLowerCase() === tokenAddress.toLowerCase();
        });
      } catch (e) {
        console.error(e);
        return null;
      }
    },
    [tokens],
  );

  const fillData = React.useCallback(async (): Promise<void> => {
    try {
      setIsPending(true);
      console.log('PageAccount fillData:', 'loading...');
      const dataForTableLocal: any = [];
      const arrOrders = [...orders];

      // eslint-disable-next-line no-restricted-syntax
      for (const item of arrOrders) {
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

        let exchange;
        if (resultGetExchangeOfPair.status === 'SUCCESS') {
          [exchange] = resultGetExchangeOfPair.data;
        }
        // eslint-disable-next-line no-await-in-loop
        // const resultOfGetHistory = await getHistory({
        //   symbolOne: symbolMaker,
        //   symbolTwo: symbolTaker,
        //   limit: '1',
        //   aggregate: '1',
        //   exchange,
        // });

        // const price = resultOfGetHistory[0]?.close;
        const amount = new BigNumber(item.order.makerAmount)
          .dividedBy(10 ** findToken(item.order.makerToken).decimals)
          .toString();
        // eslint-disable-next-line no-await-in-loop
        const resultGetPriceOfPairFrom0x = await getPriceOfPairFrom0x({
          symbolOne: symbolMaker,
          symbolTwo: symbolTaker,
          amount,
        });
        let price;
        if (resultGetPriceOfPairFrom0x.status === 'SUCCESS') {
          price = resultGetPriceOfPairFrom0x.data.price;
        }
        dataForTableLocal.push({
          orderCreate: moment(item.metaData.createdAt).format('yyyy.MM.DD'),
          timeCreate: moment(item.metaData.createdAt).format('hh:mm a'),
          orderExpire: moment(new Date(+item.order.expiry).toString()).format('yyyy.MM.DD'),
          timeExpire: moment(new Date(+item.order.expiry).toString()).format('hh:mm a'),
          tradingPair: {
            symbolMaker,
            symbolTaker,
          },
          price,
          market: exchange,
          amount,
        });
      }
      setIsPending(false);
      console.log('PageAccount fillData:', 'loaded');
      setData([...dataForTableLocal]);
      setDataForTableMobile([...dataForTableLocal.slice(0, 5)]);
      setDataForTable([...dataForTableLocal].slice(0, 12));
    } catch (e) {
      console.error(e);
    }
  }, [findToken, getExchangeOfPair, getPriceOfPairFrom0x, orders]);

  const onSort = (param: string): void => {
    try {
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
    } catch (e) {
      console.log('PageAccount onSort:', e);
    }
  };

  const emitChanges = (arg: any) => {
    setDataForTable(arg);
    setSortFlagChanged(false);
    setDataForTableMobile(arg);
  };

  const handleCopyAddress = () => {
    setIsAddressCopied(true);
    setTimeout(() => {
      setIsAddressCopied(false);
    }, 1000);
  };

  React.useEffect(() => {
    getOrders(userAddress);
  }, [getOrders, userAddress]);

  React.useEffect(() => {
    fillData();
  }, [fillData]);

  React.useEffect(() => {
    countDataForPagination();
  }, [countDataForPagination]);

  React.useEffect(() => {
    if (!tokens || tokens?.length === 0) return;
    filterAndSortUserBalances();
  }, [tokens, filterAndSortUserBalances]);

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
        <div className={s.containerTitleBlock}>
          <h1>Your Account</h1>
          <CopyToClipboard text={userAddress} onCopy={handleCopyAddress}>
            <span>
              {isAddressCopied ? 'Copied to clipboard!' : userAddress}
              <IconCopy />
            </span>
          </CopyToClipboard>
        </div>
        <div className={s.accountMenu}>
          <Link
            to={`${match.url}`}
            className={isBalancePage ? s.accountMenuItemctive : s.accountMenuItem}
          >
            Balance
          </Link>
          <Link
            to={`${match.url}/orders`}
            className={isOrdersPage ? s.accountMenuItemActive : s.accountMenuItem}
          >
            Orders History
          </Link>
        </div>
      </section>

      <Switch>
        <Route path={match.path} exact>
          <section className={s.accountFunds}>
            <Link to="/markets/ETH" className={s.accountFundsCard}>
              <h3>Your balance:</h3>
              <span>{prettyPrice(userBalance)} ETH</span>
              <img src={EthGlassIcon} alt="ehereum logo" />
            </Link>
            <Link key={uuid()} className={s.accountFundsCard} to="/markets/GEAR">
              <h3>Your balance:</h3>
              <span>{prettyPrice(userBalancesFiltered.GEAR || 0)} GEAR</span>
              <img src={tokensBySymbol?.GEAR?.image || imageTokenPay} alt="ehereum logo" />
            </Link>
            {isNoBalances && (
              <div>
                {isLoadingBalancesDone
                  ? 'You do not have any tokens'
                  : isLoadingBalancesError
                  ? 'Not loaded'
                  : 'Loading...'}
              </div>
            )}
            {userBalancesAsArray.map((item: any) => {
              const [symbol, balance] = item;
              if (symbol === 'ETH' || symbol === 'GEAR') return null;
              const image = tokensBySymbol[symbol]?.image || imageTokenPay;
              return (
                <>
                  {balance > 0 ? (
                    <Link key={uuid()} className={s.accountFundsCard} to={`/markets/${symbol}`}>
                      <h3>Your balance:</h3>
                      <span>
                        {prettyPrice(balance)} {symbol}
                      </span>
                      <img className={s.accountFundsCardImage} src={image} alt="ehereum logo" />
                    </Link>
                  ) : null}
                </>
              );
            })}
          </section>
        </Route>
        <Route path={`${match.path}/orders`}>
          <section className={s.accountTrade}>
            <h2>Order History</h2>

            <div className={s.accountTradeHistory}>
              <table className={s.accountTradeTable}>
                {isWide ? (
                  <thead>
                    <tr key={uuid()}>
                      <th
                        className={cns(
                          activeColumn === 'timestart' ? s.accountTradeTableActive : null,
                        )}
                        onClick={onSort.bind(this, 'timestart')}
                      >
                        Time start
                        {activeColumn === 'timestart' ? (
                          <IconArrowDownWhite
                            fill="#0197E2"
                            className={cns(isArrowUp ? s.arrowSortUp : s.arrowSort)}
                          />
                        ) : null}
                      </th>
                      <th>Time end</th>
                      <th>Trading pair</th>
                      <th>Amount</th>
                      <th>Price</th>
                    </tr>
                  </thead>
                ) : (
                  <thead>
                    <tr />
                  </thead>
                )}
                {isWide ? (
                  <tbody>
                    {dataForTable.map((item: any) => {
                      const {
                        orderCreate,
                        orderExpire,
                        price,
                        tradingPair,
                        amount,
                        timeCreate,
                        timeExpire,
                      } = item;
                      const link = `/markets/${tradingPair.symbolMaker}/${tradingPair.symbolTaker}`;
                      let priceChangeModel = (
                        <td>
                          <img src={ArrowUpIcon} alt="arrow up" />{' '}
                          {`${price ? numberTransform(price) : '-'}`}
                        </td>
                      );
                      if (price < 0) {
                        priceChangeModel = (
                          <td className={`${s.accountTradeTableDown}`}>
                            <img src={ArrowDownIcon} alt="arrow down" />
                            {`${numberTransform(price)}`}
                          </td>
                        );
                      }
                      if (price === 0) {
                        priceChangeModel = <td>{`${numberTransform(price)}`}</td>;
                      }
                      return (
                        <tr key={uuid()}>
                          <td>
                            {orderCreate} <span className={s.time}>{timeCreate}</span>
                          </td>
                          <td>
                            {orderExpire} <span className={s.time}>{timeExpire}</span>
                          </td>
                          <td>
                            <Link to={link}>
                              <img
                                className={s.tokenImageMaker}
                                src={getTokenBySymbol(tradingPair.symbolMaker).image}
                                alt=""
                              />
                              <img
                                className={s.tokenImageTaker}
                                src={getTokenBySymbol(tradingPair.symbolTaker).image}
                                alt=""
                              />
                              {tradingPair.symbolMaker} / {tradingPair.symbolTaker}
                            </Link>
                          </td>
                          <td>{amount}</td>
                          {priceChangeModel}
                        </tr>
                      );
                    })}
                  </tbody>
                ) : (
                  <tbody>
                    {dataForTableMobile.map((item: any) => {
                      const {
                        orderCreate,
                        orderExpire,
                        price,
                        tradingPair,
                        amount,
                        timeCreate,
                        timeExpire,
                      } = item;
                      const linkMakerToken = `/markets/${tradingPair.symbolMaker}`;
                      const linkTakerToken = `/markets/${tradingPair.symbolTaker}`;
                      let priceChangeModel = (
                        <div className={s.mobilePriceChangeModel}>
                          <img src={ArrowUpIcon} alt="arrow up" /> {`${numberTransform(price)}`}
                        </div>
                      );
                      if (price < 0) {
                        priceChangeModel = (
                          <div className={s.mobilePriceChangeModelDown}>
                            <img src={ArrowDownIcon} alt="arrow down" />{' '}
                            {`${numberTransform(price)}`}
                          </div>
                        );
                      }
                      if (price === 0) {
                        priceChangeModel = <div>{`${price}`}</div>;
                      }
                      return (
                        <tr key={uuid()}>
                          <td>
                            <div className={s.mobileContainer}>
                              <div className={s.mobilePair}>
                                <Link to={linkMakerToken}>
                                  <img
                                    className={s.tokenImageMaker}
                                    src={getTokenBySymbol(tradingPair.symbolMaker).image}
                                    alt=""
                                  />
                                </Link>
                                <Link to={linkTakerToken}>
                                  <img
                                    className={s.tokenImageTaker}
                                    src={getTokenBySymbol(tradingPair.symbolTaker).image}
                                    alt=""
                                  />
                                </Link>
                                {tradingPair.symbolMaker} / {tradingPair.symbolTaker}
                              </div>
                              <div className={s.mobileTime}>
                                <div className={s.flexContainerColumn}>
                                  <div className={s.mobileColumnTitle}>TIME START</div>
                                  <div>
                                    {orderCreate}
                                    <span className={s.time}>{timeCreate}</span>
                                  </div>
                                </div>
                                <div className={s.flexContainerColumn}>
                                  <div className={s.mobileColumnTitle}>TIME END</div>
                                  <div>
                                    {orderExpire}
                                    <span className={s.time}>{timeExpire}</span>
                                  </div>
                                </div>
                              </div>
                              <div className={s.mobileAmountPrice}>
                                <div className={s.flexContainerColumn}>
                                  <div className={s.mobileColumnTitle}>AMOUNT</div>
                                  <div>{numberTransform(amount)}</div>
                                </div>
                                <div className={s.flexContainerColumn}>
                                  <div className={s.mobileColumnTitle}>PRICE</div>
                                  <div>{priceChangeModel}</div>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                )}
              </table>
            </div>
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
        </Route>
      </Switch>
    </div>
  );
};
