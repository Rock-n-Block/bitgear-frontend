import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import cns from 'classnames';
import { v1 as uuid } from 'uuid';

import { ReactComponent as IconArrowDownWhite } from '../../../assets/icons/arrow-down-white.svg';
import { ReactComponent as IconExchange } from '../../../assets/icons/exchange.svg';
import { ReactComponent as IconGear } from '../../../assets/icons/gear.svg';
import { ReactComponent as IconSearchWhite } from '../../../assets/icons/search-white.svg';
import imageTokenPay from '../../../assets/images/token.png';
import { Checkbox, Dropdown, Input, LineChart, Radio, Select } from '../../../components';
import Button from '../../../components/Button';
import { useWalletConnectorContext } from '../../../contexts/WalletConnect';
import { modalActions, walletActions } from '../../../redux/actions';
import { Service0x } from '../../../services/0x';
import { CryptoCompareService } from '../../../services/CryptoCompareService';
import { EtherscanService } from '../../../services/Etherscan';
import { getFromStorage, setToStorage } from '../../../utils/localStorage';
import { prettyAmount, prettyPrice } from '../../../utils/prettifiers';

import s from './style.module.scss';

const CryptoCompare = new CryptoCompareService();
const Zx = new Service0x();
const Etherscan = new EtherscanService();

// Native = 'Native',
// Uniswap = 'Uniswap',
// UniswapV2 = 'Uniswap_V2',
// Eth2Dai = 'Eth2Dai',
// Kyber = 'Kyber',
// Curve = 'Curve',
// LiquidityProvider = 'LiquidityProvider',
// MultiBridge = 'MultiBridge',
// Balancer = 'Balancer',
// Cream = 'CREAM',
// Bancor = 'Bancor',
// MStable = 'mStable',
// Mooniswap = 'Mooniswap',
// MultiHop = 'MultiHop',
// Shell = 'Shell',
// Swerve = 'Swerve',
// SnowSwap = 'SnowSwap',
// SushiSwap = 'SushiSwap',
// Dodo = 'DODO',

const exchangesList: string[] = [
  '0x',
  'Uniswap',
  'UniswapV2',
  'Eth2Dai',
  'Kyber',
  'Curve',
  'LiquidityProvider',
  'MultiBridge',
  'Balancer',
  'Bancor',
  'MStable',
  'Mooniswap',
  'MultiHop',
  'Shell',
  'Swerve',
  'SushiSwap',
  'Dodo',
];

type TypeToken = {
  symbol: string;
  name: string;
  price?: number;
  priceChange: number | string;
  image?: string;
};

type TypeUseParams = {
  symbolOne: string;
  symbolTwo?: string;
};

type TypeModalParams = {
  open: boolean;
  text?: string | React.ReactElement;
  header?: string | React.ReactElement;
  delay?: number;
};

export const PageMarketsContent: React.FC = () => {
  const history = useHistory();

  const periodDefault = Number(getFromStorage('chartPeriod'));
  // console.log('PageMarketsContent periodDefault:', periodDefault, periodDefault > 0);
  const { web3Provider } = useWalletConnectorContext();

  const dispatch = useDispatch();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const toggleModal = (props: TypeModalParams) => dispatch(modalActions.toggleModal(props));
  const setWalletType = React.useCallback(
    (props: string) => dispatch(walletActions.setWalletType(props)),
    [dispatch],
  );

  const { address: userAddress } = useSelector(({ user }: any) => user);
  const { tokens } = useSelector(({ zx }: any) => zx);

  const { symbolOne, symbolTwo } = useParams<TypeUseParams>();

  const refDropdownPay = React.useRef<HTMLDivElement>(null);
  const refDropdownReceive = React.useRef<HTMLDivElement>(null);
  const refDropdownLabelPay = React.useRef<HTMLDivElement>(null);
  const refDropdownLabelReceive = React.useRef<HTMLDivElement>(null);
  const refSelect = React.useRef<HTMLDivElement>(null);
  const refSelectLabel = React.useRef<HTMLDivElement>(null);

  const [price, setPrice] = React.useState(0);
  const [marketHistory, setMarketHistory] = React.useState<any[]>([]);
  const [points, setPoints] = React.useState<number[]>([]);
  const [period, setPeriod] = React.useState<number>(periodDefault > 0 ? periodDefault : 1);
  const [searchValuePay, setSearchValuePay] = React.useState<string>('');
  const [searchValueReceive, setSearchValueReceive] = React.useState<string>('');
  const [exchanges, setExchanges] = React.useState<any>([]);
  const [openDropdownPay, setOpenDropdownPay] = React.useState<boolean>(false);
  const [openDropdownReceive, setOpenDropdownReceive] = React.useState<boolean>(false);
  const [openSelect, setOpenSelect] = React.useState<boolean>(false);
  const [openSettings, setOpenSettings] = React.useState<boolean>(false);
  const [mode, setMode] = React.useState<string>('market');
  const [searchTokensResultPay, setSearchTokensResultPay] = React.useState<TypeToken[]>(tokens);
  const [tokensReceive, setTokensReceive] = React.useState<TypeToken[]>([]);
  const [searchTokensResultReceive, setSearchTokensResultReceive] = React.useState<TypeToken[]>(
    tokensReceive,
  );
  const [tokenNamePay, setTokenNamePay] = React.useState<string>('');
  const [symbolPay, setSymbolPay] = React.useState<string>(symbolOne.toUpperCase());
  const [symbolReceive, setSymbolReceive] = React.useState<string>(symbolTwo?.toUpperCase() || '');
  const [amountPay, setAmountPay] = React.useState<string>('0');
  const [amountReceive, setAmountReceive] = React.useState<string>('0');
  const [waiting, setWaiting] = React.useState<boolean>(false);
  const [balanceOfTokenPay, setBalanceOfTokenPay] = React.useState<number>(0);
  const [balanceOfTokenReceive, setBalanceOfTokenReceive] = React.useState<number>(0);

  const data: TypeToken = {
    symbol: 'ETH',
    name: 'Currency',
    priceChange: 3.04,
  };

  const { priceChange } = data;
  const isModeMarket = mode === 'market';
  const isModeLimit = mode === 'limit';

  const classPriceChange = s.containerTitlePriceChange;
  const isPriceChangePositive = +priceChange > 0;
  const isPriceChangeNegative = +priceChange < 0;

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

  const getPricePay = async () => {
    try {
      const result = await Zx.getPrice({
        buyToken: symbolReceive,
        sellToken: symbolPay,
        sellAmount: amountPay,
      });
      console.log('getPricePay:', result);
      if (result.status === 'SUCCESS') {
        return result.data.price;
      }
      return 0;
    } catch (e) {
      console.error(e);
      return 0;
    }
  };

  const handleOpenSettings = () => {
    setOpenSettings(!openSettings);
  };

  const handleOpenDropdownPay = () => {
    setOpenDropdownPay(!openDropdownPay);
  };

  const handleOpenDropdownReceive = () => {
    setOpenDropdownReceive(!openDropdownReceive);
  };

  const handleOpenSelect = () => {
    setOpenSelect(!openSelect);
  };

  const handleChangeAmountPay = async (event: any) => {
    try {
      let { value } = event.target;
      if (Number(value) < 0) value = '0';
      setAmountPay(prettyAmount(value));
      const pricePay = await getPricePay();
      const newAmountReceive = pricePay * value;
      setAmountReceive(prettyPrice(String(newAmountReceive)));
    } catch (e) {
      console.error('handleChangeAmountPay:', e);
    }
  };

  const handleChangeAmountReceive = async (event: any) => {
    try {
      let { value } = event.target;
      if (Number(value) < 0) value = '0';
      setAmountReceive(value);
      const pricePay = await getPricePay();
      const newAmountPay = value / pricePay;
      setAmountPay(prettyPrice(String(newAmountPay)));
    } catch (e) {
      console.error('handleChangeAmountReceive:', e);
    }
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

  const handleChangeSearchPay = (value: string) => {
    try {
      setSearchValuePay(value);
      const result = tokens.filter((token: TypeToken) => {
        const includesInSymbol = token.symbol.toLowerCase().includes(value.toLowerCase());
        const includesInName = token.name.toLowerCase().includes(value.toLowerCase());
        if (includesInSymbol || includesInName) return true;
        return false;
      });
      console.log('matchSearch:', result);
      setSearchTokensResultPay(result);
    } catch (e) {
      console.error(e);
    }
  };

  const handleChangeSearchReceive = (value: string) => {
    try {
      setSearchValueReceive(value);
      const result = tokens.filter((token: TypeToken) => {
        const includesInSymbol = token.symbol.toLowerCase().includes(value.toLowerCase());
        const includesInName = token.name.toLowerCase().includes(value.toLowerCase());
        if (includesInSymbol || includesInName) return true;
        return false;
      });
      console.log('matchSearch:', result);
      setSearchTokensResultReceive(result);
    } catch (e) {
      console.error(e);
    }
  };

  const handleWalletConnectLogin = React.useCallback(async () => {
    setWalletType('walletConnect');
    toggleModal({ open: false });
  }, [setWalletType, toggleModal]);

  const handleMetamaskLogin = React.useCallback(async () => {
    setWalletType('metamask');
    toggleModal({ open: false });
  }, [setWalletType, toggleModal]);

  const handleSetPeriod = (newPeriod: number) => {
    setPeriod(newPeriod);
    setToStorage('chartPeriod', newPeriod);
  };

  const handleSetMode = (newMode: string) => {
    setMode(newMode);
  };

  const getPrices = React.useCallback(async () => {
    try {
      const result = await Zx.getPrice({
        buyToken: symbolReceive,
        sellToken: symbolPay,
        sellAmount: '1',
        skipValidation: true,
      });
      console.log('getPrices:', result);
      if (result.status === 'SUCCESS') {
        const newPrice = result.data.price;
        setPrice(newPrice);
      } else {
        setPrice(0);
      }
    } catch (e) {
      console.error(e);
    }
  }, [symbolPay, symbolReceive]);

  const getTokenPay = React.useCallback(async () => {
    try {
      const token = getTokenBySymbol(symbolPay);
      const { name } = token;
      setTokenNamePay(name);
    } catch (e) {
      console.error(e);
    }
  }, [getTokenBySymbol, symbolPay]);

  const getTokensSymbolsReceive = async () => {
    try {
      const result = await Zx.getPrices({
        sellToken: symbolPay,
      });
      const prices = result.data.records;
      const newPricesSymbols = prices.map((item: any) => item.symbol);
      console.log('getTokensSymbolsReceive:', newPricesSymbols);
      return newPricesSymbols;
    } catch (e) {
      console.error('getTokensSymbolsReceive:', e);
      return [];
    }
  };

  const getTokensReceive = React.useCallback(async () => {
    try {
      const newTokensReceive = tokens.filter((item: any) => item.symbol !== symbolPay);
      if (newTokensReceive.length === 0) {
        setSymbolReceive('');
        setTokensReceive([]);
        return;
      }
      setTokensReceive(newTokensReceive);
      console.log('getTokensReceive:', newTokensReceive);
    } catch (e) {
      console.error(e);
    }
  }, [symbolPay, tokens]);

  const getHistory = React.useCallback(async () => {
    try {
      const result = await CryptoCompare.getHistory({
        symbolOne,
        symbolTwo: symbolTwo || 'USD',
        limit: 100,
        aggregate: period,
        // exchange: 'oneinch',
      });
      console.log('getHistory:', result);
      setMarketHistory(result.data);
    } catch (e) {
      console.error(e);
    }
  }, [symbolOne, symbolTwo, period]);

  const getPoints = React.useCallback(() => {
    try {
      const newPoints = marketHistory.map((item: any) => {
        return item.close;
      });
      setPoints(newPoints);
      // console.log('getPoints:', newPoints);
    } catch (e) {
      console.error(e);
    }
  }, [marketHistory]);

  const getBalanceOfTokensPay = React.useCallback(async () => {
    try {
      if (!userAddress) return;
      if (symbolPay === 'ETH') {
        const balancePay = await web3Provider.getBalance(userAddress);
        setBalanceOfTokenPay(balancePay);
        return;
      }
      const contractAddressPay = getTokenBySymbol(symbolPay).address;
      const resultGetAbiPay = await Etherscan.getAbi(contractAddressPay);
      const contractAbiPay = JSON.parse(resultGetAbiPay.data);
      const resultBalanceOfPay = await web3Provider.balanceOf({
        address: userAddress,
        contractAddress: contractAddressPay,
        contractAbi: contractAbiPay,
      });
      console.log('getBalanceOfTokens resultBalanceOfPay:', resultBalanceOfPay);
      setBalanceOfTokenPay(resultBalanceOfPay);
    } catch (e) {
      console.error(e);
    }
  }, [userAddress, web3Provider, symbolPay, getTokenBySymbol]);

  const getBalanceOfTokensReceive = React.useCallback(async () => {
    try {
      if (!userAddress) return;
      if (symbolReceive === 'ETH') {
        const balanceReceive = await web3Provider.getBalance(userAddress);
        setBalanceOfTokenReceive(balanceReceive);
        return;
      }
      const contractAddressReceive = getTokenBySymbol(symbolReceive).address;
      const resultGetAbiReceive = await Etherscan.getAbi(contractAddressReceive);
      const contractAbiReceive = JSON.parse(resultGetAbiReceive.data);
      const resultBalanceOfReceive = await web3Provider.balanceOf({
        address: userAddress,
        contractAddress: contractAddressReceive,
        contractAbi: contractAbiReceive,
      });
      console.log('getBalanceOfTokens resultBalanceOfReceive:', resultBalanceOfReceive);
      setBalanceOfTokenReceive(resultBalanceOfReceive);
    } catch (e) {
      console.error(e);
    }
  }, [userAddress, web3Provider, symbolReceive, getTokenBySymbol]);

  const validateTradeErrors = React.useCallback(
    (error) => {
      const { code } = error.validationErrors[0];
      let text: string | React.ReactElement = 'Something gone wrong';
      if (code === 1001) {
        text = 'Please, enter amount to pay or select token to receive';
      } else if (code === 1004) {
        text = (
          <div>
            <p>Insufficicent liquidity.</p>
            <p>Please, decrease amount.</p>
          </div>
        );
      }
      toggleModal({ open: true, text });
      setWaiting(false);
    },
    [toggleModal],
  );

  const trade = React.useCallback(async () => {
    try {
      setWaiting(true);
      if (!userAddress) {
        setWaiting(false);
        return toggleModal({
          open: true,
          text: (
            <div>
              <p>Please, connect wallet</p>
              <Button
                secondary
                onClick={handleWalletConnectLogin}
                classNameCustom={s.containerTradingModalButton}
              >
                WalletConnect
              </Button>
              <Button
                secondary
                onClick={handleMetamaskLogin}
                classNameCustom={s.containerTradingModalButton}
              >
                Metamask
              </Button>
            </div>
          ),
        });
      }
      const props = {
        buyToken: symbolReceive,
        sellToken: symbolPay,
        buyAmount: amountPay,
      };
      // console.log('trade props:', props);
      const result = await Zx.getQuote(props);
      console.log('trade getQuote:', result);
      if (result.status === 'ERROR') return validateTradeErrors(result.error);
      result.data.from = userAddress;
      const contractAddressPay = getTokenBySymbol(symbolPay).address;
      console.log('trade contractAddressPay:', contractAddressPay);
      result.data.contractAddress = contractAddressPay;
      const resultGetAbi = await Etherscan.getAbi(result.data.sellTokenAddress);
      if (resultGetAbi.status === 'ERROR') {
        setWaiting(false);
        return toggleModal({
          open: true,
          text: `Contract data of token ${symbolPay} is not verified`,
        });
      }
      const contractAbi = resultGetAbi.data;
      const resultApprove = await web3Provider.approve({
        data: result.data,
        contractAbi,
        contractAddress: contractAddressPay,
      });
      console.log('trade resultApprove:', resultApprove);
      const resultSendTx = await web3Provider.sendTx(result.data);
      console.log('trade resultSendTx:', resultSendTx);
      setWaiting(false);
      getBalanceOfTokensPay();
      getBalanceOfTokensReceive();
      return null;
    } catch (e) {
      console.error(e);
      setWaiting(false);
      return null;
    }
  }, [
    handleWalletConnectLogin,
    handleMetamaskLogin,
    symbolPay,
    symbolReceive,
    amountPay,
    validateTradeErrors,
    web3Provider,
    toggleModal,
    userAddress,
    getBalanceOfTokensPay,
    getBalanceOfTokensReceive,
    getTokenBySymbol,
  ]);

  const handleSelectSymbolPay = async (symbol: string) => {
    console.log('handleSelectSymbolPay:', symbol);
    setAmountPay('0');
    setAmountReceive('0');
    setSymbolPay(symbol);
    setOpenDropdownPay(false);
    const tokensSymbolsReceive = await getTokensSymbolsReceive();
    let newSymbolReceive = symbolReceive;
    if (!tokensSymbolsReceive.includes(symbolReceive)) newSymbolReceive = '';
    history.push(`/markets/${symbol}/${newSymbolReceive}`);
  };

  const handleSelectSymbolReceive = (symbol: string) => {
    console.log('handleSelectSymbolReceive:', symbol);
    setAmountPay('0');
    setAmountReceive('0');
    setSymbolReceive(symbol);
    setOpenDropdownReceive(false);
    history.push(`/markets/${symbolPay}/${symbol}`);
  };

  const switchPayAndReceive = () => {
    setSymbolPay(symbolReceive);
    setSymbolReceive(symbolPay);
    history.push(`/markets/${symbolReceive}/${symbolPay}`);
  };

  const handleClickOutsideDropdownPay = (e: any) => {
    if (
      !refDropdownPay?.current?.contains(e.target) &&
      !refDropdownLabelPay?.current?.contains(e.target)
    ) {
      setOpenDropdownPay(false);
    }
  };

  const handleClickOutsideDropdownReceive = (e: any) => {
    if (
      !refDropdownReceive?.current?.contains(e.target) &&
      !refDropdownLabelReceive?.current?.contains(e.target)
    ) {
      setOpenDropdownReceive(false);
    }
  };

  const handleClickOutsideSelect = (e: any) => {
    if (!refSelect?.current?.contains(e.target) && !refSelectLabel?.current?.contains(e.target)) {
      setOpenSelect(false);
    }
  };

  React.useEffect(() => {
    document.addEventListener('click', (e) => {
      handleClickOutsideDropdownPay(e);
      handleClickOutsideDropdownReceive(e);
      handleClickOutsideSelect(e);
    });
    return () => {
      document.removeEventListener('click', (e) => {
        handleClickOutsideDropdownPay(e);
        handleClickOutsideDropdownReceive(e);
        handleClickOutsideSelect(e);
      });
    };
  }, []);

  React.useEffect(() => {
    getTokenPay();
    getPrices();
    getHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    getPoints();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [marketHistory]);

  React.useEffect(() => {
    getHistory();
    getPoints();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [period, tokens, tokensReceive]);

  React.useEffect(() => {
    if (!tokens || tokens?.length === 0) return;
    console.log('PageMarketsContent useEffect tokens:', tokens);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    getTokensReceive();
  }, [tokens, getTokensReceive]);

  React.useEffect(() => {
    if (!tokens || tokens?.length === 0) return;
    // eslint-disable-next-line react-hooks/exhaustive-deps
    setSearchTokensResultPay(tokens);
    setSearchTokensResultReceive(tokensReceive);
  }, [tokens, tokensReceive]);

  React.useEffect(() => {
    if (!web3Provider && !userAddress) return;
    console.log('PageMarketsContent useEffect web3provider:', web3Provider);
    getBalanceOfTokensPay();
    getBalanceOfTokensReceive();
  }, [web3Provider, getBalanceOfTokensPay, getBalanceOfTokensReceive, userAddress]);

  React.useEffect(() => {
    getTokenPay();
    getPrices();
  }, [symbolPay, getPrices, getTokenPay]);

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

  const DropdownLabelPay = (
    <div
      ref={refDropdownLabelPay}
      className={s.containerTradingCardSearch}
      onClick={handleOpenDropdownPay}
      role="button"
      tabIndex={0}
      onKeyDown={() => {}}
    >
      <div className={s.containerTradingCardSearchName}>{getTokenBySymbol(symbolPay).name}</div>
      <IconArrowDownWhite className={s.containerTradingCardSearchArrowDown} />
    </div>
  );

  const DropdownLabelReceive = (
    <div
      ref={refDropdownLabelReceive}
      className={s.containerTradingCardSearch}
      onClick={handleOpenDropdownReceive}
      role="button"
      tabIndex={0}
      onKeyDown={() => {}}
    >
      <div className={s.containerTradingCardSearchName}>{getTokenBySymbol(symbolReceive).name}</div>
      <IconArrowDownWhite className={s.containerTradingCardSearchArrowDown} />
    </div>
  );

  const DropdownItemsPay = (
    <div ref={refDropdownPay}>
      <div className={s.containerTradingCardSearchInput}>
        <Input
          placeholder="Search"
          label={<IconSearchWhite />}
          value={searchValuePay}
          onChange={handleChangeSearchPay}
        />
      </div>
      <div className={s.containerTradingCardSearchItems}>
        {searchTokensResultPay.map((token: any) => {
          const { name: tokenName, symbol, price: tokenPrice = 0, image = imageTokenPay } = token;
          return (
            <div
              role="button"
              key={uuid()}
              tabIndex={0}
              className={s.containerTradingCardSearchItem}
              onClick={() => handleSelectSymbolPay(symbol)}
              onKeyDown={() => {}}
            >
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

  const DropdownItemsReceive = (
    <div ref={refDropdownReceive}>
      <div className={s.containerTradingCardSearchInput}>
        <Input
          placeholder="Search"
          label={<IconSearchWhite />}
          value={searchValueReceive}
          onChange={handleChangeSearchReceive}
        />
      </div>
      <div className={s.containerTradingCardSearchItems}>
        {searchTokensResultReceive.map((item: any) => {
          const { name: tokenName, symbol, price: tokenPrice = '0', image = imageTokenPay } = item;
          return (
            <div
              role="button"
              key={uuid()}
              tabIndex={0}
              className={s.containerTradingCardSearchItem}
              onClick={() => handleSelectSymbolReceive(symbol)}
              onKeyDown={() => {}}
            >
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
            {tokenNamePay} ({symbolPay})
          </div>
          <div className={s.containerTitlePrice}>
            {!symbolReceive && '$'}
            {prettyPrice(price.toString())} {symbolReceive}
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
              <img src={getTokenBySymbol(symbolPay).image} alt="" />
            </div>
            <div className={s.containerTradingCardContainer}>
              <div className={s.containerTradingCardContainerInner}>
                <Dropdown open={openDropdownPay} label={DropdownLabelPay}>
                  {DropdownItemsPay}
                </Dropdown>
                <div className={s.containerTradingCardSymbol}>
                  {getTokenBySymbol(symbolPay).symbol}
                </div>
              </div>
              <div className={s.containerTradingCardInput}>
                {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                <label htmlFor="inputPay" />
                <input
                  id="inputPay"
                  type="number"
                  value={amountPay}
                  onChange={handleChangeAmountPay}
                />
              </div>
              <div className={s.containerTradingCardBalance}>
                Current balance ({getTokenBySymbol(symbolPay).symbol})
                <span>{prettyPrice(String(balanceOfTokenPay))}</span>
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
          <div
            role="button"
            tabIndex={0}
            className={s.containerTradingDividerInner}
            onClick={switchPayAndReceive}
            onKeyDown={() => {}}
          >
            <IconExchange />
          </div>
        </div>

        <div className={cns(s.containerTradingCard, s.containerTradingCardLimitOpen)}>
          <div className={s.containerTradingCardLabel}>You Receive</div>
          <div className={s.containerTradingCardInner}>
            <div className={s.containerTradingCardImage}>
              <img src={getTokenBySymbol(symbolReceive).image} alt="" />
            </div>
            <div className={s.containerTradingCardContainer}>
              <div className={s.containerTradingCardContainerInner}>
                <Dropdown open={openDropdownReceive} label={DropdownLabelReceive}>
                  {DropdownItemsReceive}
                </Dropdown>
                <div className={s.containerTradingCardSymbol}>
                  {getTokenBySymbol(symbolReceive).symbol}
                </div>
              </div>
              <div className={s.containerTradingCardInput}>
                {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                <label htmlFor="inputPay" />
                <input
                  id="inputPay"
                  type="number"
                  value={amountReceive}
                  onChange={handleChangeAmountReceive}
                />
              </div>
              <div className={s.containerTradingCardBalance}>
                Current balance ({getTokenBySymbol(symbolReceive).symbol})
                <span>{prettyPrice(String(balanceOfTokenReceive))}</span>
              </div>
            </div>
          </div>
        </div>
        <div className={s.containerTradingButton}>
          <Button onClick={trade}>{waiting ? 'Waiting...' : 'Trade'}</Button>
        </div>
      </section>

      <section className={s.containerChart}>
        <div className={s.chart}>
          {points.length > 0 && <LineChart interactive data={points} />}
        </div>
        <div className={s.chartData}>
          <div className={s.chartDataFirst}>
            <div className={s.chartDataPriceName}>Current price</div>
            <div className={s.chartDataPrice}>
              {!symbolTwo && '$'}
              {prettyPrice(price.toString())} {symbolTwo}
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
