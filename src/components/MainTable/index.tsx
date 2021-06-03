import React from 'react';
import { Link } from 'react-router-dom';
import cns from 'classnames';
import { useMedia } from 'use-media';
import { v1 as uuid } from 'uuid';

import ArrowDownIcon from '../../assets/icons/arrow-down-icon.svg';
import { ReactComponent as IconArrowDownWhite } from '../../assets/icons/arrow-down-white.svg';
import ArrowUpIcon from '../../assets/icons/arrow-up-icon.svg';
import { CoinMarketCapService } from '../../services/CoinMarketCap';
import { numberTransform } from '../../utils/numberTransform';
import { LineChartWrapper } from '../LineChartWrapper';

import s from './style.module.scss';

type TableTypeProps = {
  data?: any[];
  dataForMobile?: any[];
  activeColumn?: string;
  emitSorting?: (T: any) => any;
  isArrowUp?: boolean;
};

const CoinMarketCap = new CoinMarketCapService();

export const MainTable: React.FC<TableTypeProps> = React.memo(
  ({
    data = [],
    dataForMobile = [],
    emitSorting = () => '',
    activeColumn = '',
    isArrowUp = true,
  }) => {
    const isWide = useMedia({ minWidth: '767px' });
    const [symbols, setSymbols] = React.useState<string[]>([]);
    const [dataPoints, setDataPoints] = React.useState<string[]>([]);
    const [marketHistory, setMarketHistory] = React.useState<any[]>([]);
    const [points, setPoints] = React.useState<number[]>([]);

    const isActiveColumnName = activeColumn === 'name';
    const isActiveColumnPrice = activeColumn === 'price';
    const isActiveColumnPriceChange = activeColumn === 'priceChange';
    const isActiveColumnMarketCap = activeColumn === 'marketCap';
    const isActiveColumnVolume = activeColumn === 'volume';

    const onSort = (columnName: any) => {
      emitSorting(columnName);
    };

    const getSymbolsList = React.useCallback(() => {
      const arrayOfSymbolsDesktop = dataPoints.map((token: any) => {
        return token.symbol.toUpperCase();
      });
      setSymbols(arrayOfSymbolsDesktop);
    }, [dataPoints]);

    const getHistoryCMC = React.useCallback(async (): Promise<any> => {
      try {
        if (!symbols || symbols.length === 0) return [];
        setPoints([]);
        const resultFromGetHistoryCMC = await CoinMarketCap.getAllCoinsHistoryDay(symbols);

        const marketHistoryArray = Object.keys(resultFromGetHistoryCMC.data.data).map(
          (token: any) => {
            return resultFromGetHistoryCMC.data.data[token];
          },
        );

        const marketHistoryArraySorted: any = [];

        symbols.forEach((symbol: any) => {
          // eslint-disable-next-line array-callback-return
          marketHistoryArray.find((token) => {
            if (symbol.toUpperCase() === token.symbol.toUpperCase()) {
              marketHistoryArraySorted.push(token);
            }
          });
        });

        setMarketHistory(marketHistoryArraySorted);

        console.log(marketHistoryArraySorted);

        return resultFromGetHistoryCMC;
      } catch (e) {
        console.error(e);
        return {
          status: 'ERROR',
          data: undefined,
        };
      }
    }, [symbols]);

    const getPoints = React.useCallback(() => {
      try {
        const arraysOfQuotes = marketHistory.map((token: any) => {
          return token.quotes;
        });

        const arrayOfPoints = arraysOfQuotes.map((item: any) => {
          return item.map((quote: any) => {
            return quote.quote.USD.close;
          });
        });
        setPoints(arrayOfPoints);
      } catch (e) {
        console.error(e);
      }
    }, [marketHistory]);

    React.useEffect(() => {
      getSymbolsList();
    }, [getSymbolsList]);

    React.useEffect(() => {
      getHistoryCMC();
    }, [getHistoryCMC]);

    React.useEffect(() => {
      getPoints();
    }, [getPoints]);

    React.useEffect(() => {
      setDataPoints(data);
    }, [data]);

    return (
      <>
        <table>
          {isWide ? (
            <thead>
              <tr>
                <th
                  className={cns(isActiveColumnName ? s.ExploreTableActive : null)}
                  onClick={() => onSort('name')}
                >
                  Token
                  {activeColumn === 'name' ? (
                    <IconArrowDownWhite
                      fill="#0197E2"
                      className={cns(isArrowUp ? s.arrowSortUp : s.arrowSort)}
                    />
                  ) : null}
                </th>
                <th>Symbol</th>
                <th
                  className={cns(isActiveColumnPrice ? s.ExploreTableActive : null)}
                  onClick={() => onSort('price')}
                >
                  Price
                  {activeColumn === 'price' ? (
                    <IconArrowDownWhite
                      fill="#0197E2"
                      className={cns(isArrowUp ? s.arrowSortUp : s.arrowSort)}
                    />
                  ) : null}
                </th>
                <th
                  className={cns(isActiveColumnPriceChange ? s.ExploreTableActive : null)}
                  onClick={() => onSort('priceChange')}
                >
                  Last 24h
                  {activeColumn === 'priceChange' ? (
                    <IconArrowDownWhite
                      fill="#0197E2"
                      className={cns(isArrowUp ? s.arrowSortUp : s.arrowSort)}
                    />
                  ) : null}
                </th>
                <th
                  className={cns(isActiveColumnMarketCap ? s.ExploreTableActive : null)}
                  onClick={() => onSort('marketCap')}
                  style={{ minWidth: '127px' }}
                >
                  Market cap
                  {activeColumn === 'marketCap' ? (
                    <IconArrowDownWhite
                      fill="#0197E2"
                      className={cns(isArrowUp ? s.arrowSortUp : s.arrowSort)}
                    />
                  ) : null}
                </th>
                <th
                  className={cns(isActiveColumnVolume ? s.ExploreTableActive : null)}
                  onClick={() => onSort('volume')}
                >
                  Volume
                  {activeColumn === 'volume' ? (
                    <IconArrowDownWhite
                      fill="#0197E2"
                      className={cns(isArrowUp ? s.arrowSortUp : s.arrowSort)}
                    />
                  ) : null}
                </th>
                <th> </th>
              </tr>
            </thead>
          ) : (
            <thead>
              <tr>
                <th
                  className={cns(isActiveColumnName ? s.ExploreTableActive : null)}
                  onClick={() => onSort('name')}
                >
                  Token
                  {activeColumn === 'name' ? (
                    <IconArrowDownWhite
                      fill="#0197E2"
                      className={cns(isArrowUp ? s.arrowSortUp : s.arrowSort)}
                    />
                  ) : null}
                </th>
                <th> </th>
                <th
                  className={cns(isActiveColumnPriceChange ? s.ExploreTableActive : null)}
                  onClick={() => onSort('priceChange')}
                >
                  {activeColumn === 'priceChange' ? (
                    <IconArrowDownWhite
                      fill="#0197E2"
                      className={cns(isArrowUp ? s.arrowSortUp : s.arrowSort)}
                    />
                  ) : null}
                  Last 24h
                </th>
              </tr>
            </thead>
          )}
          {isWide ? (
            <tbody>
              {data.map((item: any, index: number) => {
                const { name, symbol, price, priceChange, marketCap, volume } = item;
                const link = `/markets/${symbol}`;
                let priceChangeModel = (
                  <td className={s.priceChangeUp}>
                    <img src={ArrowUpIcon} alt="arrow up" /> {`${numberTransform(priceChange)}`}%
                  </td>
                );

                if (priceChange < 0) {
                  priceChangeModel = (
                    <td className={`${s.ExploreTableDown}`}>
                      <img src={ArrowDownIcon} alt="arrow down" />
                      {numberTransform(priceChange)}%
                    </td>
                  );
                }
                if (priceChange === 0) {
                  priceChangeModel = <td>{`${numberTransform(priceChange)}%`}</td>;
                }
                return (
                  <tr key={uuid()}>
                    <td>
                      <Link to={link}>{name}</Link>
                    </td>
                    <td>
                      <Link to={link}>{symbol}</Link>
                    </td>
                    <td>${numberTransform(price)}</td>
                    {priceChangeModel}
                    <td>{marketCap ? numberTransform(marketCap) : '-'}</td>
                    <td>{volume ? numberTransform(volume) : '-'}</td>
                    <td>
                      <LineChartWrapper points={points[index]} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          ) : (
            <tbody>
              {dataForMobile.map((token: any, index: number) => {
                const { symbol, name, price, priceChange } = token;
                const link = `/markets/${symbol}`;
                let priceChangeModel = (
                  <div className={`${s.mobilePriceChangeModel}`}>
                    <div className={s.flexContainerRow}>
                      <img src={ArrowUpIcon} alt="arrow up" />
                      {numberTransform(priceChange)}%
                    </div>
                  </div>
                );

                if (priceChange < 0) {
                  priceChangeModel = (
                    <div className={`${s.mobilePriceChangeModelDown}`}>
                      <div className={s.flexContainerRow}>
                        <img src={ArrowDownIcon} alt="arrow down" />
                        {numberTransform(priceChange)}%
                      </div>
                    </div>
                  );
                }
                if (priceChange === 0) {
                  priceChangeModel = <div>{`${numberTransform(priceChange)}%`}</div>;
                }

                return (
                  <>
                    <tr key={uuid()}>
                      <td>
                        <Link to={link}>
                          <div>
                            {name}
                            <div className={s.mobileSymbol}>{symbol}</div>
                          </div>
                        </Link>
                      </td>
                      <td>
                        <LineChartWrapper points={points[index]} />
                      </td>
                      <td>
                        <div className={s.mobilePriceAndChangeContainer}>
                          <div className={s.mobilePrice}>${numberTransform(price)}</div>
                          {priceChangeModel}
                        </div>
                      </td>
                    </tr>
                  </>
                );
              })}
            </tbody>
          )}
        </table>
      </>
    );
  },
);
