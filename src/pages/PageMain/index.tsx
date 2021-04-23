import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { v1 as uuid } from 'uuid';

import imageCoin from '../../assets/images/coin.png';
import imageRocket from '../../assets/images/rocket.png';
import { Search } from '../../components';

import s from './style.module.scss';

type TypeToken = {
  symbol: string;
  name: string;
  price?: number;
  priceChange?: string | number;
  image?: string;
};

type TypeCardProps = {
  children: React.ReactElement[];
  to: string;
};

const firstTokens = ['DAI', 'WETH', 'GEAR'];

const tokenGear = {
  symbol: 'GEAR',
  name: 'Bitgear',
  price: null,
  image: imageCoin,
  decimals: 18,
  address: '0x1b980e05943dE3dB3a459C72325338d327B6F5a9', // not for kovan
};

export const Card: React.FC<TypeCardProps> = ({ children = [], to = '/' }) => {
  return (
    <Link to={to} className={s.card}>
      {children}
    </Link>
  );
};

export const PageMain: React.FC = () => {
  const { tokens } = useSelector(({ zx }: any) => zx);

  const [tokensList, setTokensList] = React.useState<TypeToken[]>([]);

  const changeTokens = React.useCallback(async () => {
    try {
      let newTokens = tokens;
      newTokens.splice(0, 0, tokenGear);
      newTokens.sort((a: TypeToken, b: TypeToken) => {
        return firstTokens.indexOf(b.symbol) - firstTokens.indexOf(a.symbol);
      });
      newTokens = newTokens.slice(0, 3);
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
        <Search />
      </section>
      <section className={s.containerCards}>
        {tokensList.map((token: TypeToken) => {
          let { priceChange } = token;
          const { symbol, price, image = imageCoin } = token;
          let classPriceChange = s.cardPriceChange;
          if (priceChange && priceChange > 0) {
            priceChange = `+${priceChange}`;
            classPriceChange = s.cardPriceChangePlus;
          } else if (priceChange && priceChange < 0) {
            classPriceChange = s.cardPriceChangeMinus;
          }
          return (
            <Card key={`token-${uuid()}`} to={`/markets/${symbol}`}>
              <div className={s.cardContainerFirst}>
                <div className={s.cardSymbol}>{symbol}</div>
                <div className={s.cardPrice}>${price}</div>
                <div className={classPriceChange}>{priceChange}%</div>
              </div>
              <div className={s.cardContainerSecond}>
                <img src={image} alt="" className={s.cardImage} />
              </div>
            </Card>
          );
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
