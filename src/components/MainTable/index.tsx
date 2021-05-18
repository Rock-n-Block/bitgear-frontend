import React from 'react';
import cns from 'classnames';
import { useMedia } from 'use-media';
import { v1 as uuid } from 'uuid';

import ArrowDownIcon from '../../assets/icons/arrow-down-icon.svg';
import { ReactComponent as IconArrowDownWhite } from '../../assets/icons/arrow-down-white.svg';
import ArrowUpIcon from '../../assets/icons/arrow-up-icon.svg';
import points from '../../pages/PageExplore/points.json';
import { numberTransform } from '../../utils/numberTransform';
import { LineChart } from '../LineChart';

import s from './style.module.scss';

type TableTypeProps = {
  data?: any[];
  dataForMobile?: any[];
  activeColumn?: string;
  emitSorting?: (T: any) => any;
  isArrowUp?: boolean;
};

export const MainTable: React.FC<TableTypeProps> = React.memo(
  ({
    data = [],
    dataForMobile = [],
    emitSorting = () => '',
    activeColumn = '',
    isArrowUp = true,
  }) => {
    const isWide = useMedia({ minWidth: '767px' });

    const isActiveColumnName = activeColumn === 'name';
    const isActiveColumnPrice = activeColumn === 'price';
    const isActiveColumnPriceChange = activeColumn === 'priceChange';
    const isActiveColumnMarketCap = activeColumn === 'marketCap';
    const isActiveColumnVolume = activeColumn === 'volume';

    const onSort = (columnName: any) => {
      emitSorting(columnName);
    };

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
              {data.map((item: any) => {
                const { name, symbol, price, priceChange, marketCap, volume } = item;

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
                    <td>{name}</td>
                    <td>{symbol}</td>
                    <td>${numberTransform(price)}</td>
                    {priceChangeModel}
                    <td>{numberTransform(marketCap)}</td>
                    <td>{numberTransform(volume)}</td>
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
          ) : (
            <tbody>
              {dataForMobile.map((token: any) => {
                const { symbol, name, price, priceChange } = token;

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
                        <div>
                          {name}
                          <div className={s.mobileSymbol}>{symbol}</div>
                        </div>
                      </td>
                      <td>
                        <LineChart
                          containerStyle={s.chartContainer}
                          svgStyle={s.chartSvg}
                          data={points.map((point) => point.close)}
                        />
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
