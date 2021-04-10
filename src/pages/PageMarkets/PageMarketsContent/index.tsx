import React from 'react';
import { useParams } from 'react-router-dom';

import { ReactComponent as IconArrowDownWhite } from '../../../assets/icons/arrow-down-white.svg';
import { ReactComponent as IconExchange } from '../../../assets/icons/exchange.svg';
import { ReactComponent as IconGear } from '../../../assets/icons/gear.svg';
import imageTokenPay from '../../../assets/images/token.png';
import Button from '../../../components/Button';
import { CryptoCompareService } from '../../../services/CryptoCompareService';

import s from './style.module.scss';

const imageTokenReceive = 'https://www.cryptocompare.com/media/37746238/eth.png';

const CryptoCompare = new CryptoCompareService();

type TypeUseParams = {
  symbolOne?: string;
  symbolTwo?: string;
};

type TypeToken = {
  symbol?: string;
  name?: string;
  price?: number;
  priceChange?: number | string;
  image?: string;
};

export const PageMarketsContent: React.FC = () => {
  const { symbolOne, symbolTwo } = useParams<TypeUseParams>();

  const data: TypeToken = {
    symbol: 'ETH',
    name: 'Ethereum',
    price: 1813.04,
    priceChange: 3.04,
  };

  let { priceChange } = data;
  const { symbol, name, price } = data;

  let classPriceChange = s.containerTitlePriceChange;

  if (priceChange && priceChange > 0) {
    priceChange = `+${priceChange}`;
    classPriceChange = s.containerTitlePriceChangePlus;
  } else if (priceChange && priceChange < 0) {
    classPriceChange = s.containerTitlePriceChangeMinus;
  } else {
    priceChange = '';
  }

  const getPrice = React.useCallback(async () => {
    const result = await CryptoCompare.getPrice({
      symbolOne,
      symbolTwo: symbolTwo || 'USD',
    });
    console.log('getPrice:', result);
  }, [symbolOne, symbolTwo]);

  React.useEffect(() => {
    getPrice();
  }, [getPrice]);

  return (
    <div className={s.container}>
      <section className={s.containerTitle}>
        <div className={s.containerTitleFirst}>
          <div className={s.containerTitleName}>
            {name} ({symbol})
          </div>
          <div className={s.containerTitlePrice}>${price}</div>
          <div className={classPriceChange}>{priceChange}%</div>
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
              <div className={s.containerTradingCardName}>
                Bitcoin
                <IconArrowDownWhite className={s.containerTradingCardArrowDown} />
              </div>
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
          <div className={s.containerTradingCardLabel}>You Pay</div>
          <div className={s.containerTradingCardImage}>
            <img src={imageTokenReceive} alt="" />
          </div>
          <div className={s.containerTradingCardContainer}>
            <div className={s.containerTradingCardContainerInner}>
              <div className={s.containerTradingCardName}>
                Ethereum
                <IconArrowDownWhite className={s.containerTradingCardArrowDown} />
              </div>
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
        <div className={s.containerTradingButton}>
          <Button>Trade</Button>
        </div>
      </section>
    </div>
  );
};
