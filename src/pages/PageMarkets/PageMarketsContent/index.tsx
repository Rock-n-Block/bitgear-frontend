import React from 'react';
import { useParams } from 'react-router-dom';
import { v1 as uuid } from 'uuid';

import { ReactComponent as IconArrowDownWhite } from '../../../assets/icons/arrow-down-white.svg';
import { ReactComponent as IconExchange } from '../../../assets/icons/exchange.svg';
import { ReactComponent as IconGear } from '../../../assets/icons/gear.svg';
import { ReactComponent as IconSearchWhite } from '../../../assets/icons/search-white.svg';
import imageTokenPay from '../../../assets/images/token.png';
import { Dropdown, Input, LineChart } from '../../../components';
import Button from '../../../components/Button';
import { CryptoCompareService } from '../../../services/CryptoCompareService';

import s from './style.module.scss';

const imageTokenReceive = 'https://www.cryptocompare.com/media/37746238/eth.png';

const CryptoCompare = new CryptoCompareService();

type TypeUseParams = {
  symbolOne: string;
  symbolTwo?: string;
};

type TypeToken = {
  symbol?: string;
  name?: string;
  price?: number;
  priceChange: number | string;
  image?: string;
};

const tokens: TypeToken[] = [
  {
    symbol: 'WETH',
    name: 'Ethereum',
    price: 1813.04,
    priceChange: 0,
    image: undefined,
  },
  {
    symbol: 'WBTC',
    name: 'Bitcoin',
    price: 1813.04,
    priceChange: 5.96,
    image: undefined,
  },
  {
    symbol: 'GEAR',
    name: 'Gear',
    price: 1813.04,
    priceChange: -1.4,
    image: undefined,
  },
  {
    symbol: 'GEAR',
    name: 'Ethereum',
    price: 1813.04,
    priceChange: -1.4,
    image: undefined,
  },
  {
    symbol: 'WETH',
    name: 'Ethereum',
    price: 1813.04,
    priceChange: 5.96,
    image: undefined,
  },
  {
    symbol: 'WBTC',
    name: 'Ethereum',
    price: 1813.04,
    priceChange: 5.96,
    image: undefined,
  },
  {
    symbol: 'GEAR',
    name: 'Ethereum',
    price: 1813.04,
    priceChange: -1.4,
    image: undefined,
  },
  {
    symbol: 'GEAR',
    name: 'Ethereum',
    price: 1813.04,
    priceChange: -1.4,
    image: undefined,
  },
];

export const PageMarketsContent: React.FC = () => {
  const { symbolOne, symbolTwo } = useParams<TypeUseParams>();

  const [price, setPrice] = React.useState(0);
  const [history, setHistory] = React.useState<any[]>([]);
  const [points, setPoints] = React.useState<number[]>([]);
  const [period, setPeriod] = React.useState<number>(1);
  const [searchValue, setSearchValue] = React.useState<string>('');

  const data: TypeToken = {
    symbol: 'ETH',
    name: 'Currency',
    priceChange: 3.04,
  };

  const { priceChange } = data;
  const { name } = data;

  const classPriceChange = s.containerTitlePriceChange;
  const isPriceChangePositive = +priceChange > 0;
  const isPriceChangeNegative = +priceChange < 0;

  const handleChangeSearch = (newSearchValue: string) => {
    setSearchValue(newSearchValue);
  };

  const handleSetPeriod = (newPeriod: number) => {
    setPeriod(newPeriod);
  };

  const getPrice = React.useCallback(async () => {
    try {
      const result = await CryptoCompare.getMarketData({
        symbolOne,
        symbolTwo: symbolTwo || 'USD',
      });
      setPrice(result.data.PRICE);
      console.log('getPrice:', result);
    } catch (e) {
      console.error(e);
    }
  }, [symbolOne, symbolTwo]);

  const getHistory = React.useCallback(async () => {
    try {
      const result = await CryptoCompare.getHistory({
        symbolOne,
        symbolTwo: symbolTwo || 'USD',
        limit: 100,
        aggregate: period,
        exchange: 'Kraken',
      });
      console.log('getHistory:', result);
      setHistory(result.data);
    } catch (e) {
      console.error(e);
    }
  }, [symbolOne, symbolTwo, period]);

  const getPoints = React.useCallback(() => {
    try {
      const newPoints = history.map((item: any) => {
        return item.close;
      });
      setPoints(newPoints);
      console.log('getPoints:', history);
    } catch (e) {
      console.error(e);
    }
  }, [history]);

  React.useEffect(() => {
    getPrice();
    getHistory();
    getPoints();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    getPoints();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [history]);

  React.useEffect(() => {
    getHistory();
    getPoints();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [period]);

  const DropdownLabel = (
    <div className={s.containerTradingCardSearch}>
      <div className={s.containerTradingCardSearchName}>{name}</div>
      <IconArrowDownWhite className={s.containerTradingCardSearchArrowDown} />
    </div>
  );

  const DropdownItems = (
    <div>
      <div className={s.containerTradingCardSearchInput}>
        <Input
          placeholder="Search"
          label={<IconSearchWhite />}
          value={searchValue}
          onChange={handleChangeSearch}
        />
      </div>
      <div className={s.containerTradingCardSearchItems}>
        {tokens.map((item) => {
          const { name: tokenName, symbol, price: tokenPrice, image = imageTokenPay } = item;
          return (
            <div key={uuid()} className={s.containerTradingCardSearchItem}>
              <img src={image} alt="" className={s.containerTradingCardSearchItemImage} />
              <div className={s.containerTradingCardSearchItemFirst}>
                <div className={s.containerTradingCardSearchItemName}>{tokenName}</div>
                <div className={s.containerTradingCardSearchItemPrice}>{tokenPrice}</div>
              </div>
              <div className={s.containerTradingCardSearchItemSymbol}>
                <div>{symbol}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className={s.container}>
      <section className={s.containerTitle}>
        <div className={s.containerTitleFirst}>
          <div className={s.containerTitleName}>
            {name} ({symbolOne})
          </div>
          <div className={s.containerTitlePrice}>
            {!symbolTwo && '$'}
            {price.toString().slice(0, 8)} {symbolTwo}
          </div>
          <div
            className={classPriceChange}
            data-positive={isPriceChangePositive}
            data-negative={isPriceChangeNegative}
          >
            {isPriceChangePositive && '+'}
            {priceChange}%
          </div>
        </div>
        <div className={s.containerTitleSecond}>
          <div className={s.containerTitleSecondInner}>
            <div className={s.containerTitleSecondItemActive}>Market</div>
            <div className={s.containerTitleSecondItem}>Limit</div>
            <div className={s.containerTitleSecondItem}>
              <IconGear />
            </div>
          </div>
        </div>
      </section>
      <section className={s.containerTrading}>
        <div className={s.containerTradingCard}>
          <div className={s.containerTradingCardLabel}>You Pay</div>
          <div className={s.containerTradingCardImage}>
            <img src={imageTokenPay} alt="" />
          </div>
          <div className={s.containerTradingCardContainer}>
            <div className={s.containerTradingCardContainerInner}>
              <Dropdown label={DropdownLabel}>{DropdownItems}</Dropdown>
              <div className={s.containerTradingCardSymbol}>BTC</div>
            </div>
            <div className={s.containerTradingCardInput}>
              {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
              <label htmlFor="inputPay" />
              <input id="inputPay" type="number" />
            </div>
            <div className={s.containerTradingCardBalance}>
              Current balance (BTC)<span>32,424</span>
            </div>
          </div>
        </div>
        <div className={s.containerTradingDivider}>
          <div className={s.containerTradingDividerInner}>
            <IconExchange />
          </div>
        </div>
        <div className={s.containerTradingCard}>
          <div className={s.containerTradingCardLabel}>You Receive</div>
          <div className={s.containerTradingCardImage}>
            <img src={imageTokenReceive} alt="" />
          </div>
          <div className={s.containerTradingCardContainer}>
            <div className={s.containerTradingCardContainerInner}>
              <div className={s.containerTradingCardName}>
                Ethereum
                <IconArrowDownWhite className={s.containerTradingCardArrowDown} />
              </div>
              <div className={s.containerTradingCardSymbol}>ETH</div>
            </div>
            <div className={s.containerTradingCardInput}>
              {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
              <label htmlFor="inputPay" />
              <input id="inputPay" type="number" />
            </div>
            <div className={s.containerTradingCardBalance}>
              Current balance (ETH)<span>24</span>
            </div>
          </div>
        </div>
        <div className={s.containerTradingButton}>
          <Button>Trade</Button>
        </div>
      </section>
      <section className={s.containerChart}>
        <div className={s.chart}>
          <LineChart data={points} />
        </div>
        <div className={s.chartData}>
          <div className={s.chartDataFirst}>
            <div className={s.chartDataPriceName}>Current price</div>
            <div className={s.chartDataPrice}>
              {!symbolTwo && '$'}
              {price.toString().slice(0, 8)} {symbolTwo}
            </div>
          </div>
          <div className={s.chartDataSecond}>
            <div className={s.chartDataPeriod}>
              <div
                role="button"
                tabIndex={0}
                data-active={period === 1}
                onClick={() => handleSetPeriod(1)}
                onKeyDown={() => {}}
              >
                24H
              </div>
              <div
                role="button"
                tabIndex={0}
                data-active={period === 7}
                onClick={() => handleSetPeriod(7)}
                onKeyDown={() => {}}
              >
                1W
              </div>
              <div
                role="button"
                tabIndex={0}
                data-active={period === 30}
                onClick={() => handleSetPeriod(30)}
                onKeyDown={() => {}}
              >
                1M
              </div>
            </div>
            <div
              className={s.chartDataPriceChange}
              data-positive={isPriceChangePositive}
              data-negative={isPriceChangeNegative}
            >
              {priceChange}%
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
