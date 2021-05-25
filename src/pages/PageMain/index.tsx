import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { useMedia } from 'use-media';
import { v1 as uuid } from 'uuid';

import imageCoin from '../../assets/images/coin.png';
import imageRocket from '../../assets/images/rocket.png';
import { Search } from '../../components';
import { CoinMarketCapService } from '../../services/CoinMarketCap';
import { CryptoCompareService } from '../../services/CryptoCompareService';
import { prettyPrice, prettyPriceChange } from '../../utils/prettifiers';

import s from './style.module.scss';

const CryptoCompare = new CryptoCompareService();
const CoinMarketCap = new CoinMarketCapService();

type TypeToken = {
  symbol: string;
  name: string;
  price?: number;
  priceChange?: string | number;
  image?: string;
};

type TypeCardProps = {
  token: TypeToken;
  to: string;
};

const firstTokens = ['GEAR', 'WETH', 'WBTC', 'USDC'].reverse();

export const CardToken: React.FC<TypeCardProps> = ({ token, to = '/' }) => {
  const [price, setPrice] = React.useState<number>(0);
  const [priceChange, setPriceChange] = React.useState<string>('0');

  const { symbol, image = imageCoin } = token;
  let classPriceChange = s.cardPriceChange;
  let newPriceChange = priceChange.toString();
  if (priceChange && +priceChange > 0) {
    newPriceChange = `+${priceChange}`;
    classPriceChange = s.cardPriceChangePlus;
  } else if (priceChange && +priceChange < 0) {
    classPriceChange = s.cardPriceChangeMinus;
  }

  const getPricesFromCMC = React.useCallback(async () => {
    try {
      const resultGetPrice = await CoinMarketCap.getTwoCoinsInfo({
        symbolOne: symbol,
        symbolTwo: '',
      });
      if (resultGetPrice.status === 'SUCCESS') {
        const newPrice = prettyPrice(resultGetPrice.data[symbol.toUpperCase()].quote.USD.price);
        const newNewPriceChange = prettyPriceChange(
          resultGetPrice.data[symbol.toUpperCase()].quote.USD.percent_change_24h,
        );
        setPrice(+newPrice);
        setPriceChange(newNewPriceChange.toString());
      }
    } catch (e) {
      console.error(e);
    }
  }, [symbol]);

  const getPrices = React.useCallback(async () => {
    try {
      if (symbol === 'GEAR') {
        await getPricesFromCMC();
      }
      const resultGetExchangeOfPair = await CryptoCompare.getExchangeOfPair({
        symbolOne: symbol,
        symbolTwo: 'USD',
      });
      if (resultGetExchangeOfPair.status === 'ERROR') {
        await getPricesFromCMC();
      }
      if (resultGetExchangeOfPair.status === 'SUCCESS') {
        console.log('PageMain resultGetExchangeOfPair:', resultGetExchangeOfPair);
        const resultGetPrice = await CryptoCompare.getMarketData({
          symbolOne: symbol,
          symbolTwo: 'USD',
        });
        if (resultGetExchangeOfPair.status === 'SUCCESS') {
          const newPrice = prettyPrice(resultGetPrice.data.PRICE);
          const newNewPriceChange = prettyPriceChange(resultGetPrice.data.CHANGEPCTHOUR);
          setPrice(+newPrice);
          setPriceChange(newNewPriceChange.toString());
          console.log('PageMain resultGetPrice:', resultGetPrice);
        }
      }
    } catch (e) {
      console.error(e);
    }
  }, [getPricesFromCMC, symbol]);

  React.useEffect(() => {
    if (!token) return;
    getPrices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getPrices]);

  return (
    <Link to={to} className={s.card}>
      <div className={s.cardContainerFirst}>
        <div className={s.cardSymbol}>{symbol}</div>
        <div className={s.cardPrice}>${price}</div>
        <div className={classPriceChange}>{newPriceChange}%</div>
      </div>
      <div className={s.cardContainerSecond}>
        <img src={image} alt="" className={s.cardImage} />
      </div>
    </Link>
  );
};

export const PageMain: React.FC = () => {
  const { tokens } = useSelector(({ zx }: any) => zx);

  const [tokensList, setTokensList] = React.useState<TypeToken[]>([]);

  const isWide = useMedia({ minWidth: '767px' });

  const changeTokens = React.useCallback(async () => {
    try {
      let newTokens = tokens;
      newTokens.sort((a: TypeToken, b: TypeToken) => {
        return firstTokens.indexOf(b.symbol) - firstTokens.indexOf(a.symbol);
      });
      newTokens = newTokens.slice(0, 4);
      setTokensList(newTokens);
    } catch (e) {
      console.error(e);
    }
  }, [tokens]);

  React.useEffect(() => {
    if (!tokens || tokens.length === 0) return;
    changeTokens();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [changeTokens]);

  return (
    <div className={s.container}>
      <section className={s.containerTitle}>
        <h1>
          Find the <span>best prices</span> across exchange networks
        </h1>
        <Search wide={isWide} />
      </section>
      <section className={s.containerCards}>
        {tokensList.map((token: TypeToken) => {
          const { symbol } = token;
          return <CardToken key={uuid()} to={`/markets/${symbol}`} token={token} />;
        })}
      </section>
      <section className={s.containerLists}>
        <Link to="/lists/recently-added" className={s.cardList}>
          <img src={imageCoin} alt="" className={s.cardListImage} />
          Recently Added
        </Link>
        <Link to="/lists/top-gainers" className={s.cardList}>
          <img src={imageRocket} alt="" className={s.cardListImage} />
          Top Gainers
        </Link>
      </section>
    </div>
  );
};
