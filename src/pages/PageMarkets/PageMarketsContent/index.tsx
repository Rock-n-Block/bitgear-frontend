import React from 'react';
import { useParams } from 'react-router-dom';
import cns from 'classnames';
import { v1 as uuid } from 'uuid';

import { ReactComponent as IconArrowDownWhite } from '../../../assets/icons/arrow-down-white.svg';
import { ReactComponent as IconExchange } from '../../../assets/icons/exchange.svg';
import { ReactComponent as IconGear } from '../../../assets/icons/gear.svg';
import { ReactComponent as IconSearchWhite } from '../../../assets/icons/search-white.svg';
import imageTokenPay from '../../../assets/images/token.png';
import { Checkbox, Dropdown, Input, LineChart, Radio, Select } from '../../../components';
import Button from '../../../components/Button';
import { CryptoCompareService } from '../../../services/CryptoCompareService';
import { getFromStorage, setToStorage } from '../../../utils/localStorage';

import s from './style.module.scss';

const imageTokenReceive = 'https://www.cryptocompare.com/media/37746238/eth.png';

const CryptoCompare = new CryptoCompareService();

const exchangesList: string[] = [
  '0x',
  'Balancer',
  'Bancor',
  'CREAM',
  'CryptoCom',
  'Linkswap',
  'Mooniswap',
  'Curve',
  'DODO',
  'Kyber',
  'Shell',
  'SnowSwap',
  'mStable',
  'Oasis',
  'SushiSwap',
  'Swerve',
  'Uniswap',
];

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

type TypeUseParams = {
  symbolOne: string;
  symbolTwo?: string;
};

export const PageMarketsContent: React.FC = () => {
  const periodDefault = Number(getFromStorage('chartPeriod'));
  console.log('PageMarketsContent periodDefault:', periodDefault, periodDefault > 0);

  const { symbolOne, symbolTwo } = useParams<TypeUseParams>();

  const refDropdown = React.useRef<HTMLDivElement>(null);
  const refDropdownLabel = React.useRef<HTMLDivElement>(null);
  const refSelect = React.useRef<HTMLDivElement>(null);
  const refSelectLabel = React.useRef<HTMLDivElement>(null);

  const [price, setPrice] = React.useState(0);
  const [history, setHistory] = React.useState<any[]>([]);
  const [points, setPoints] = React.useState<number[]>([]);
  const [period, setPeriod] = React.useState<number>(periodDefault > 0 ? periodDefault : 1);
  const [searchValue, setSearchValue] = React.useState<string>('');
  const [exchanges, setExchanges] = React.useState<any>([]);
  const [openDropdown, setOpenDropdown] = React.useState<boolean>(false);
  const [openSelect, setOpenSelect] = React.useState<boolean>(false);
  const [openSettings, setOpenSettings] = React.useState<boolean>(false);
  const [mode, setMode] = React.useState<string>('market');

  const data: TypeToken = {
    symbol: 'ETH',
    name: 'Currency',
    priceChange: 3.04,
  };

  const { priceChange } = data;
  const { name } = data;
  const isModeMarket = mode === 'market';
  const isModeLimit = mode === 'limit';

  const classPriceChange = s.containerTitlePriceChange;
  const isPriceChangePositive = +priceChange > 0;
  const isPriceChangeNegative = +priceChange < 0;

  const handleOpenSettings = () => {
    setOpenSettings(!openSettings);
  };

  const handleOpenDropdown = () => {
    setOpenDropdown(!openDropdown);
  };

  const handleOpenSelect = () => {
    setOpenSelect(!openSelect);
  };

  const handleChangeExchanges = (e: boolean, exchange: string) => {
    console.log('handleChangeExchanges:', exchanges);
    const newExchanges = exchanges;
    if (exchanges.includes(exchange)) {
      const index = exchanges.indexOf(exchange);
      newExchanges.splice(index, 1);
    } else {
      newExchanges.push(exchange);
    }
    setExchanges(newExchanges);
  };

  const handleChangeSearch = (newSearchValue: string) => {
    setSearchValue(newSearchValue);
  };

  const handleSetPeriod = (newPeriod: number) => {
    setPeriod(newPeriod);
    setToStorage('chartPeriod', newPeriod);
  };

  const handleSetMode = (newMode: string) => {
    setMode(newMode);
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

  const handleClickOutsideDropdown = (e: any) => {
    if (
      !refDropdown?.current?.contains(e.target) &&
      !refDropdownLabel?.current?.contains(e.target)
    ) {
      setOpenDropdown(false);
    }
  };

  const handleClickOutsideSelect = (e: any) => {
    if (!refSelect?.current?.contains(e.target) && !refSelectLabel?.current?.contains(e.target)) {
      setOpenSelect(false);
    }
  };

  React.useEffect(() => {
    document.addEventListener('click', (e) => {
      handleClickOutsideDropdown(e);
      handleClickOutsideSelect(e);
    });
    return () => {
      document.removeEventListener('click', (e) => {
        handleClickOutsideDropdown(e);
        handleClickOutsideSelect(e);
      });
    };
  }, []);

  React.useEffect(() => {
    getPrice();
    getPrice();
    getHistory();
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

  const RadioLabelFast = (
    <div className={s.radioLabelGas}>
      <div>Fast</div>
      <div>161 WETH</div>
    </div>
  );

  const RadioLabelVeryFast = (
    <div className={s.radioLabelGas}>
      <div>Very Fast</div>
      <div>161 WETH</div>
    </div>
  );

  const RadioLabelCustom = (
    <div className={s.radioLabelGas}>
      <div>Custom</div>
      <div className={s.radioLabelGasInner}>
        <div className={s.radioLabelGasInput}>
          {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
          <label htmlFor="inputGas" />
          <input id="inputGas" type="number" />
        </div>
        <div>WETH</div>
      </div>
    </div>
  );

  const SelectLabel = (
    <div
      ref={refSelectLabel}
      className={s.containerSettingsSelectLabel}
      role="button"
      tabIndex={0}
      onKeyDown={() => {}}
      onClick={handleOpenSelect}
    >
      <div>1%</div>
      <IconArrowDownWhite />
    </div>
  );

  const DropdownLabel = (
    <div
      ref={refDropdownLabel}
      className={s.containerTradingCardSearch}
      onClick={handleOpenDropdown}
      role="button"
      tabIndex={0}
      onKeyDown={() => {}}
    >
      <div className={s.containerTradingCardSearchName}>{name}</div>
      <IconArrowDownWhite className={s.containerTradingCardSearchArrowDown} />
    </div>
  );

  const DropdownItems = (
    <div ref={refDropdown}>
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
            <div
              role="button"
              tabIndex={0}
              className={
                isModeMarket ? s.containerTitleSecondItemActive : s.containerTitleSecondItem
              }
              onClick={() => handleSetMode('market')}
              onKeyDown={() => {}}
            >
              Market
            </div>
            <div
              role="button"
              tabIndex={0}
              className={
                isModeLimit ? s.containerTitleSecondItemActive : s.containerTitleSecondItem
              }
              onClick={() => handleSetMode('limit')}
              onKeyDown={() => {}}
            >
              Limit
            </div>
            <div
              className={s.containerTitleSecondItem}
              onClick={handleOpenSettings}
              role="button"
              tabIndex={0}
              onKeyDown={() => {}}
            >
              <IconGear />
            </div>
          </div>
        </div>
      </section>

      {openSettings && (
        <section className={s.containerSettings}>
          <h1>Advanced Settings</h1>
          <div className={s.containerSettingsInner}>
            <div className={s.containerSettingsSlippage}>
              <h2>Max Slippage</h2>
              <Select open={openSelect} label={SelectLabel}>
                <div ref={refSelect} className={s.containerSettingsSelectItems}>
                  <div>2%</div>
                  <div>3%</div>
                </div>
              </Select>
            </div>
            <div className={s.containerSettingsExchanges}>
              <h2>Exchanges</h2>
              <div className={s.containerSettingsExchangesInner}>
                {exchangesList?.map((exchange) => {
                  return (
                    <Checkbox
                      key={uuid()}
                      text={exchange}
                      onChange={(e: boolean) => handleChangeExchanges(e, exchange)}
                    />
                  );
                })}
              </div>
            </div>
            <div className={s.containerSettingsGas}>
              <h2>Gas Price</h2>
              <div className={s.containerSettingsGasInner}>
                <Radio name="gas" text={RadioLabelFast} />
                <Radio name="gas" text={RadioLabelVeryFast} />
                <Radio name="gas" text={RadioLabelCustom} />
              </div>
            </div>
            <div className={s.containerSettingsButtons}>
              <Button secondary classNameCustom={s.containerSettingsButtonsButton}>
                Save
              </Button>
              <Button normal classNameCustom={s.containerSettingsButtonsButton}>
                Reset
              </Button>
            </div>
          </div>
        </section>
      )}

      <section className={s.containerTrading}>
        <div className={s.containerTradingCard}>
          <div className={s.containerTradingCardLabel}>You Pay</div>
          <div className={s.containerTradingCardInner}>
            <div className={s.containerTradingCardImage}>
              <img src={imageTokenPay} alt="" />
            </div>
            <div className={s.containerTradingCardContainer}>
              <div className={s.containerTradingCardContainerInner}>
                <Dropdown open={openDropdown} label={DropdownLabel}>
                  {DropdownItems}
                </Dropdown>
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
          {isModeLimit && (
            <div className={s.containerTradingCardLimit}>
              <div className={s.containerTradingCardLimitInner}>
                <div className={s.containerTradingCardLimitLabel}>
                  <div>ETH Price</div>
                </div>
                <div className={s.containerTradingCardLimitInput}>
                  {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                  <label htmlFor="inputPay">
                    <div>USD</div>
                  </label>
                  <input id="inputPay" type="number" />
                </div>
              </div>
              <div className={s.containerTradingCardLimitInner}>
                <div className={s.containerTradingCardLimitLabel}>
                  <div>Expires in</div>
                </div>
                <Select open={openSelect} label={SelectLabel}>
                  <div ref={refSelect} className={s.containerSettingsSelectItems}>
                    <div>30min</div>
                    <div>60min</div>
                  </div>
                </Select>
              </div>
            </div>
          )}
        </div>
        <div className={cns(s.containerTradingDivider, s.containerTradingCardLimitOpen)}>
          <div className={s.containerTradingDividerInner}>
            <IconExchange />
          </div>
        </div>
        <div className={cns(s.containerTradingCard, s.containerTradingCardLimitOpen)}>
          <div className={s.containerTradingCardLabel}>You Receive</div>
          <div className={s.containerTradingCardInner}>
            <div className={s.containerTradingCardImage}>
              <img src={imageTokenReceive} alt="" />
            </div>
            <div className={s.containerTradingCardContainer}>
              <div className={s.containerTradingCardContainerInner}>
                <Dropdown open={openDropdown} label={DropdownLabel}>
                  {DropdownItems}
                </Dropdown>
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
        </div>
        <div className={s.containerTradingButton}>
          <Button>Trade</Button>
        </div>
      </section>

      <section className={s.containerChart}>
        <div className={s.chart}>
          <LineChart interactive data={points} />
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
