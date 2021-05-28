import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import BigNumber from 'bignumber.js/bignumber';
import cns from 'classnames';
import _ from 'lodash';
import { v1 as uuid } from 'uuid';

import { ReactComponent as IconArrowDownWhite } from '../../../assets/icons/arrow-down-white.svg';
import { ReactComponent as IconExchange } from '../../../assets/icons/exchange.svg';
import { ReactComponent as IconGear } from '../../../assets/icons/gear.svg';
import { ReactComponent as IconSearchWhite } from '../../../assets/icons/search-white.svg';
import imageTokenPay from '../../../assets/images/token.png';
import { Checkbox, Dropdown, Input, LineChart, Select } from '../../../components';
import Button from '../../../components/Button';
import config from '../../../config';
import { useWalletConnectorContext } from '../../../contexts/WalletConnect';
import erc20Abi from '../../../data/erc20Abi.json';
import { modalActions, statusActions, walletActions } from '../../../redux/actions';
import { Service0x } from '../../../services/0x';
import { CoinMarketCapService } from '../../../services/CoinMarketCap';
import { CryptoCompareService } from '../../../services/CryptoCompareService';
import { EtherscanService } from '../../../services/Etherscan';
import { getFromStorage, setToStorage } from '../../../utils/localStorage';
import {
  prettyBalance,
  prettyExpiration,
  prettyPrice,
  prettyPriceChange,
} from '../../../utils/prettifiers';

import s from './style.module.scss';

const CryptoCompare = new CryptoCompareService();
const Zx = new Service0x();
const Etherscan = new EtherscanService();
const CoinMarketCap = new CoinMarketCapService();

const exchangesList: string[] = [
  '0x',
  'Native',
  'Uniswap',
  'Uniswap_V2',
  'Uniswap_V3',
  'Eth2Dai',
  'Kyber',
  'Curve',
  'LiquidityProvider',
  'MultiBridge',
  'Balancer',
  'Cream',
  'Bancor',
  'MStable',
  'Mooniswap',
  'MultiHop',
  'Shell',
  'Swerve',
  'SnowSwap',
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
  const setStatus = React.useCallback((props: any) => dispatch(statusActions.setStatus(props)), [
    dispatch,
  ]);

  const { address: userAddress, balances: userBalances } = useSelector(({ user }: any) => user);
  const { tokens } = useSelector(({ zx }: any) => zx);
  const { chainId } = useSelector(({ wallet }: any) => wallet);
  const { messageYouPay } = useSelector(({ status }: any) => status);

  const { symbolOne, symbolTwo } = useParams<TypeUseParams>();

  const refDropdownPay = React.useRef<HTMLDivElement>(null);
  const refDropdownReceive = React.useRef<HTMLDivElement>(null);
  const refDropdownLabelPay = React.useRef<HTMLDivElement>(null);
  const refDropdownLabelReceive = React.useRef<HTMLDivElement>(null);
  const refSelect = React.useRef<HTMLDivElement>(null);
  const refSelectLabel = React.useRef<HTMLDivElement>(null);
  const refSelectSlippage = React.useRef<HTMLDivElement>(null);
  const refSelectLabelSlippage = React.useRef<HTMLDivElement>(null);
  const refInputGasPrice = React.useRef<HTMLInputElement>(null);

  const [tokensFiltered, setTokensFiltered] = React.useState<any[]>(tokens);
  const [price, setPrice] = React.useState<number>(0);
  const [priceChange, setPriceChange] = React.useState<number>(0);
  const [priceChart, setPriceChart] = React.useState<string | null>();
  const [marketHistory, setMarketHistory] = React.useState<any[]>([]);
  const [points, setPoints] = React.useState<number[]>([]);
  const [dateTime, setDateTime] = React.useState<number[]>([]);
  const [period, setPeriod] = React.useState<number>(periodDefault > 0 ? periodDefault : 1);
  const [searchValuePay, setSearchValuePay] = React.useState<string>('');
  const [searchValueReceive, setSearchValueReceive] = React.useState<string>('');
  const [exchanges, setExchanges] = React.useState<any>([]);
  const [exchangesExcluded, setExchangesExcluded] = React.useState<string[]>([]);
  const [openDropdownPay, setOpenDropdownPay] = React.useState<boolean>(false);
  const [openDropdownReceive, setOpenDropdownReceive] = React.useState<boolean>(false);
  const [openSelect, setOpenSelect] = React.useState<boolean>(false);
  const [openSelectSlippage, setOpenSelectSlippage] = React.useState<boolean>(false);
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
  // const [approved, setApproved] = React.useState<boolean>(false);
  const [balanceOfTokenPay, setBalanceOfTokenPay] = React.useState<string>('0');
  const [balanceOfTokenReceive, setBalanceOfTokenReceive] = React.useState<string>('0');
  const [expiration, setExpiration] = React.useState<number>(60);
  const [slippage, setSlippage] = React.useState<number>(0);
  const [gasPrice, setGasPrice] = React.useState<number>();
  const [gasPriceFromNet, setGasPriceFromNet] = React.useState<number>(0);
  const [gasPriceType, setGasPriceType] = React.useState<string>('');
  const [gasPriceCustom, setGasPriceCustom] = React.useState<number>(0);
  const [allowance, setAllowance] = React.useState<number>(0);

  const isSymbolPayETH = symbolPay === 'ETH';

  const isModeMarket = mode === 'market';
  const isModeLimit = mode === 'limit';

  const classPriceChange = s.containerTitlePriceChange;
  const isPriceChangePositive = +priceChange > 0;
  const isPriceChangeNegative = +priceChange < 0;

  const isGasPriceTypeFast = gasPriceType === 'fast';
  const isGasPriceTypeVeryFast = gasPriceType === 'veryFast';
  const isGasPriceTypeCustom = gasPriceType === 'custom';

  const isAllowed = allowance > +amountPay;

  const isTradeDisabled = userAddress
    ? +amountReceive === 0 || !balanceOfTokenPay || +balanceOfTokenPay < +amountPay
    : false;

  const marketPrice =
    marketHistory && marketHistory[0] ? marketHistory[0]?.quote[symbolTwo || 'USD']?.close : 0;

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

  const getPricePay = React.useCallback(
    async (amountToPay: string) => {
      try {
        const { decimals, address: addressPay } = getTokenBySymbol(symbolPay);
        const { address: addressReceive } = getTokenBySymbol(symbolReceive);
        const props = {
          buyToken: addressReceive,
          sellToken: addressPay,
          sellAmount: amountToPay,
          decimals,
        };
        const result = await Zx.getQuote(props);
        console.log('PageMarketsContent getPricePay:', props, result);
        if (result.status === 'SUCCESS') return result.data.guaranteedPrice;
        return 0;
      } catch (e) {
        console.error(e);
        return 0;
      }
    },
    [getTokenBySymbol, symbolPay, symbolReceive],
  );

  const getPricePayLimit = React.useCallback(
    async (amountToPay: string) => {
      try {
        const { decimals, address: addressPay } = getTokenBySymbol(symbolPay);
        const { address: addressReceive } = getTokenBySymbol(symbolReceive);
        const props = {
          buyToken: addressReceive,
          sellToken: addressPay,
          sellAmount: amountToPay,
          decimals,
        };
        const result = await Zx.getPrice(props);
        console.log('PageMarketsContent getPricePayLimit:', props, result);
        if (result.status === 'SUCCESS') return result.data.price;
        return marketPrice;
      } catch (e) {
        console.error(e);
        return 0;
      }
    },
    [getTokenBySymbol, marketPrice, symbolPay, symbolReceive],
  );

  const getGasPrice = React.useCallback(async () => {
    const resultGetGasPrice = await Etherscan.getGasPrice();
    // console.log('PageMarketsContent resultGetGasPrice:', resultGetGasPrice);
    if (resultGetGasPrice.status === 'SUCCESS') {
      setGasPriceFromNet(resultGetGasPrice.data);
    } else {
      const resultGetGasPriceFromWeb3 = await web3Provider.getGasPrice();
      // console.log('PageMarketsContent resultGetGasPriceFromWeb3:', resultGetGasPriceFromWeb3);
      setGasPriceFromNet(resultGetGasPriceFromWeb3);
    }
  }, [web3Provider]);

  const getGasPriceSetting = React.useCallback(() => {
    if (isGasPriceTypeCustom) return gasPriceCustom * 10e8;
    if (!gasPrice) return undefined;
    return gasPrice * 10e8;
  }, [gasPrice, gasPriceCustom, isGasPriceTypeCustom]);

  const getPrices = React.useCallback(async () => {
    try {
      setStatus({ messageYouPay: null });
      const { decimals, address: addressPay } = getTokenBySymbol(symbolPay);
      const { address: addressReceive } = getTokenBySymbol(symbolReceive);
      if (!decimals) return null;
      if (!amountPay || amountPay === '' || amountPay === '0') return null;
      let newPrice = 0;
      if (symbolReceive && amountPay) {
        const result = await Zx.getPrice({
          buyToken: addressReceive,
          sellToken: addressPay,
          sellAmount: amountPay,
          skipValidation: true,
          decimals,
        });
        console.log('PageMarketsContent getPrices:', result);
        if (result.status === 'SUCCESS') {
          newPrice = result.data.price;
          setPrice(newPrice);
        } else {
          setStatus({
            messageYouPay: (
              <div>
                Insufficient liquidity.
                <br /> Decrease amount.
              </div>
            ),
          });
          setPrice(0);
        }
      } else {
        const result = await CryptoCompare.getMarketData({
          symbolOne: symbolPay,
          symbolTwo: 'USD',
        });
        console.log('PageMarketsContent getPrices:', result);
        if (result.status === 'SUCCESS') {
          newPrice = result.data.PRICE;
          setPrice(newPrice);
          // const newPriceChange = prettyPriceChange(result.data.CHANGEHOUR);
          // setPriceChange(+newPriceChange);
        } else {
          setPrice(0);
        }
      }
      return null;
    } catch (e) {
      console.error(e);
      return null;
    }
  }, [setStatus, amountPay, symbolPay, symbolReceive, getTokenBySymbol]);

  const getTokenPay = React.useCallback(async () => {
    try {
      const token = getTokenBySymbol(symbolPay);
      const { name } = token;
      setTokenNamePay(name);
    } catch (e) {
      console.error(e);
    }
  }, [getTokenBySymbol, symbolPay]);

  const filterTokens = React.useCallback(() => {
    try {
      let newTokens = [];
      if (isModeLimit) {
        newTokens = tokens.filter((item: any) => item.symbol !== 'ETH');
      } else {
        newTokens = tokens;
      }
      setTokensFiltered(newTokens);
      console.log('PageMarketsContent filterTokens:', newTokens);
      return null;
    } catch (e) {
      console.error('PageMarketsContent filterTokens:', e);
      return null;
    }
  }, [isModeLimit, tokens]);

  const getTokensSymbolsReceive = async () => {
    try {
      const { address: addressPay } = getTokenBySymbol(symbolPay);
      const result = await Zx.getPrices({
        sellToken: addressPay,
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
      const newTokensReceive = tokensFiltered.filter((item: any) => item.symbol !== symbolPay);
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
  }, [symbolPay, tokensFiltered]);

  // const getHistoryDay = React.useCallback(async () => {
  //   try {
  //     const result = await CryptoCompare.getHistoryMinute({
  //       symbolOne,
  //       symbolTwo: symbolTwo || 'USD',
  //       limit: 96,
  //       aggregate: 15,
  //       // exchange: 'oneinch',
  //     });
  //     console.log('getHistoryDay:', result);
  //     setMarketHistory(result.data);
  //   } catch (e) {
  //     console.error(e);
  //   }
  // }, [symbolOne, symbolTwo]);
  //
  // const getHistoryHourWeek = React.useCallback(async () => {
  //   try {
  //     const result = await CryptoCompare.getHistoryHour({
  //       symbolOne,
  //       symbolTwo: symbolTwo || 'USD',
  //       limit: 168,
  //       aggregate: 1,
  //       // exchange: 'oneinch',
  //     });
  //     console.log('getHistoryWeek:', result);
  //     setMarketHistory(result.data);
  //   } catch (e) {
  //     console.error(e);
  //   }
  // }, [symbolOne, symbolTwo]);
  //
  // const getHistoryHourMonth = React.useCallback(async () => {
  //   try {
  //     const result = await CryptoCompare.getHistoryHour({
  //       symbolOne,
  //       symbolTwo: symbolTwo || 'USD',
  //       limit: 180,
  //       aggregate: 4,
  //       // exchange: 'oneinch',
  //     });
  //     console.log('getHistoryMonth:', result);
  //     setMarketHistory(result.data);
  //   } catch (e) {
  //     console.error(e);
  //   }
  // }, [symbolOne, symbolTwo]);

  const getHistoryDay = React.useCallback(async () => {
    try {
      const result = await CoinMarketCap.getHistoryDayForPair({
        symbolOne,
        symbolTwo: symbolTwo || 'USD',
      });
      console.log('getHistoryDay:', result);
      setMarketHistory(result.data);
    } catch (e) {
      console.error(e);
    }
  }, [symbolOne, symbolTwo]);

  const getHistoryHourWeek = React.useCallback(async () => {
    try {
      const result = await CoinMarketCap.getHistoryWeekForPair({
        symbolOne,
        symbolTwo: symbolTwo || 'USD',
      });
      console.log('getHistoryWeek:', result);
      setMarketHistory(result.data);
    } catch (e) {
      console.error(e);
    }
  }, [symbolOne, symbolTwo]);

  const getHistoryHourMonth = React.useCallback(async () => {
    try {
      const result = await CoinMarketCap.getHistoryMonthForPair({
        symbolOne,
        symbolTwo: symbolTwo || 'USD',
      });
      console.log('getHistoryMonth:', result);
      setMarketHistory(result.data);
    } catch (e) {
      console.error(e);
    }
  }, [symbolOne, symbolTwo]);

  const getPoints = React.useCallback(() => {
    try {
      const newPoints = marketHistory.map((item: any) => {
        return item.quote[symbolTwo || 'USD'].close;
      });
      setPoints(newPoints);
      const newPointsLength = newPoints.length;
      const newPriceChange = newPoints[newPointsLength - 1] - newPoints[newPointsLength - 2];
      const prettyNewPriceChange = prettyPriceChange(newPriceChange.toString());
      setPriceChange(+prettyNewPriceChange);
      // console.log('getPoints:', newPoints);
    } catch (e) {
      console.error(e);
    }
  }, [marketHistory, symbolTwo]);

  const getDateTime = React.useCallback(() => {
    try {
      const newDateTime = marketHistory.map((item: any) => {
        return new Date(item.time_close).getTime() / 1000 + 1;
      });
      setDateTime(newDateTime);
    } catch (e) {
      console.error(e);
    }
  }, [marketHistory]);

  const getBalanceOfTokensPay = React.useCallback(async () => {
    try {
      if (!userAddress) return;
      if (symbolPay === 'ETH') {
        const balancePay = await web3Provider.getBalance(userAddress);
        const balancePayFormatted = new BigNumber(balancePay).toString(10);
        setBalanceOfTokenPay(balancePayFormatted);
        return;
      }
      const contractAddressPay = getTokenBySymbol(symbolPay).address;
      const resultBalanceOfPay = await web3Provider.balanceOf({
        address: userAddress,
        contractAddress: contractAddressPay,
        contractAbi: erc20Abi,
      });
      console.log('getBalanceOfTokens resultBalanceOfPay:', resultBalanceOfPay);
      const balancePayFormatted = new BigNumber(resultBalanceOfPay).toString(10);
      setBalanceOfTokenPay(balancePayFormatted);
    } catch (e) {
      console.error(e);
    }
  }, [userAddress, web3Provider, symbolPay, getTokenBySymbol]);

  const getBalanceOfTokensReceive = React.useCallback(async () => {
    try {
      if (!userAddress) return;
      if (symbolReceive === 'ETH') {
        const balanceReceive = await web3Provider.getBalance(userAddress);
        const balanceReceiveFormatted = new BigNumber(balanceReceive).toString(10);
        setBalanceOfTokenReceive(balanceReceiveFormatted);
        return;
      }
      const contractAddressReceive = getTokenBySymbol(symbolReceive).address;
      const resultBalanceOfReceive = await web3Provider.balanceOf({
        address: userAddress,
        contractAddress: contractAddressReceive,
        contractAbi: erc20Abi,
      });
      console.log('getBalanceOfTokens resultBalanceOfReceive:', resultBalanceOfReceive);
      const balanceReceiveFormatted = new BigNumber(resultBalanceOfReceive).toString(10);
      setBalanceOfTokenReceive(balanceReceiveFormatted);
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

  const verifyForm = React.useCallback(() => {
    try {
      if (!symbolPay) {
        toggleModal({
          open: true,
          text: `Please, choose token to pay`,
        });
        return false;
      }
      if (!symbolReceive) {
        toggleModal({
          open: true,
          text: `Please, choose token to receive`,
        });
        return false;
      }
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  }, [symbolPay, symbolReceive, toggleModal]);

  const rejectUsingEthForLimit = React.useCallback(() => {
    try {
      return toggleModal({
        open: true,
        text: (
          <div>
            <p>Unavailable on ETH-based pairs. Use WETH for limit orders.</p>
          </div>
        ),
      });
    } catch (e) {
      console.error(e);
      return false;
    }
  }, [toggleModal]);

  const updateAmountReceive = React.useCallback(async () => {
    try {
      let pricePay = 0;
      if (isModeLimit) {
        pricePay = await getPricePayLimit(amountPay);
      } else {
        pricePay = await getPricePay(amountPay);
      }
      const newAmountReceive = new BigNumber(pricePay).multipliedBy(amountPay).toString(10);
      // console.log('PageMarketsContent updateAmountReceive:', amountPay, newAmountReceive);
      setAmountReceive(newAmountReceive);
    } catch (e) {
      console.error('PageMarketsContent updateAmountReceive:', e);
    }
  }, [amountPay, getPricePay, getPricePayLimit, isModeLimit]);

  const getAllowance = React.useCallback(async () => {
    try {
      // console.log('PageMarketsContent getAllowance:', symbolPay, symbolReceive, amountPay);
      if (!symbolPay || !symbolReceive || !amountPay || !userAddress) return;
      const { address: addressPay } = getTokenBySymbol(symbolPay);
      const { netType, addresses } = config as { [index: string]: any };
      const { allowanceTarget } = addresses[netType];
      const propsGetAllowance = {
        userAddress,
        allowanceTarget,
        contractAddress: addressPay,
        contractAbi: erc20Abi,
      };
      const resultGetAllowance = await web3Provider.allowance(propsGetAllowance);
      console.log('PageMarketsContent getAllowance:', resultGetAllowance);
      setAllowance(resultGetAllowance);
    } catch (e) {
      console.error('PageMarketsContent getAllowance:', e);
    }
  }, [getTokenBySymbol, symbolPay, symbolReceive, userAddress, web3Provider, amountPay]);

  const trade = React.useCallback(async () => {
    try {
      if (!verifyForm()) {
        setWaiting(false);
        return null;
      }
      const { decimals, address: addressPay } = getTokenBySymbol(symbolPay);
      const { address: addressReceive } = getTokenBySymbol(symbolReceive);
      const excludedSources = exchangesExcluded.join(',');
      const gasPriceSetting = getGasPriceSetting();
      const slippagePercentage = slippage / 100;
      const props: any = {
        buyToken: addressReceive,
        sellToken: addressPay,
        sellAmount: amountPay,
        decimals,
      };
      if (gasPriceSetting) props.gasPrice = gasPriceSetting;
      if (slippagePercentage) props.slippagePercentage = slippagePercentage;
      if (excludedSources) props.excludedSources = excludedSources;
      console.log('trade props:', props);
      const result = await Zx.getQuote(props);
      console.log('trade getQuote:', result);
      if (result.status === 'ERROR') return validateTradeErrors(result.error);
      result.data.from = userAddress;
      const { estimatedGas } = result.data;
      const newEstimatedGas = +estimatedGas * 2;
      result.data.gas = String(newEstimatedGas);
      const resultSendTx = await web3Provider.sendTx(result.data);
      console.log('trade resultSendTx:', resultSendTx);
      if (resultSendTx.status === 'SUCCESS') {
        setAmountPay('0');
        setAmountReceive('0');
      }
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
    verifyForm,
    slippage,
    getGasPriceSetting,
    symbolPay,
    symbolReceive,
    amountPay,
    validateTradeErrors,
    web3Provider,
    userAddress,
    getBalanceOfTokensPay,
    getBalanceOfTokensReceive,
    getTokenBySymbol,
    exchangesExcluded,
  ]);

  const tradeLimit = React.useCallback(async () => {
    try {
      if (!verifyForm()) {
        setWaiting(false);
        return null;
      }
      const { address: addressPay, decimals: decimalsPay }: any = getTokenBySymbol(symbolPay);
      const { address: addressReceive, decimals: decimalsReceive }: any = getTokenBySymbol(
        symbolReceive,
      );
      const newExpiration = new Date().getTime() + expiration * 60 * 1000;
      const props = {
        provider: web3Provider,
        chainId,
        userAddress,
        addressPay,
        addressReceive,
        decimalsPay,
        decimalsReceive,
        amountPay: String(amountPay),
        amountReceive: String(amountReceive),
        expiration: newExpiration,
      };
      const resultSignOrder = await Zx.signOrder(props);
      console.log('tradeLimit resultSignOrder:', resultSignOrder);
      if (resultSignOrder.status === 'ERROR') {
        setWaiting(false);
        toggleModal({
          open: true,
          text: `Something gone wrong. Order was not signed`,
        });
        return null;
      }
      const order: any = resultSignOrder.data;
      console.log('tradeLimit order:', order);
      const resultSendOrder = await Zx.sendOrder(order);
      if (resultSendOrder.status === 'ERROR') {
        console.error('tradeLimit sendOrder:', resultSendOrder.error);
        setWaiting(false);
        toggleModal({
          open: true,
          text: `Something gone wrong. Order was not placed`,
        });
        return null;
      }
      toggleModal({
        open: true,
        text: `Order was successfully placed`,
      });
      setAmountPay('0');
      setAmountReceive('0');
      console.log('tradeLimit resultSendOrder:', resultSendOrder);
      setWaiting(false);
      return null;
    } catch (e) {
      console.error(e);
      setWaiting(false);
      toggleModal({
        open: true,
        text: `Something gone wrong. Order was not placed`,
      });
      return null;
    }
  }, [
    verifyForm,
    getTokenBySymbol,
    symbolPay,
    symbolReceive,
    web3Provider,
    amountPay,
    amountReceive,
    userAddress,
    expiration,
    chainId,
    toggleModal,
  ]);

  const handleChangeGasPrice = (value: number, type: string) => {
    setGasPriceType(type);
    setGasPrice(value);
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

  const handleOpenSelectSlippage = () => {
    setOpenSelectSlippage(!openSelectSlippage);
  };

  const handleFocusAmountPay = async () => {
    if (amountPay === '0') setAmountPay('');
  };

  const handleBlurAmountPay = async () => {
    if (amountPay === '') setAmountPay('0');
  };

  const handleFocusAmountReceive = async () => {
    if (amountReceive === '0') setAmountReceive('');
  };

  const handleBlurAmountReceive = async () => {
    if (amountReceive === '') setAmountReceive('0');
  };

  const handleChangeAmountPay = async (event: any) => {
    try {
      const { value } = event.target;
      // console.log('handleChangeAmountPay value:', value);
      setAmountPay(value);
      let pricePay = 0;
      if (isModeLimit) {
        pricePay = await getPricePayLimit(value);
      } else {
        pricePay = await getPricePay(value);
      }
      const newAmountReceiveFormatted = new BigNumber(pricePay).multipliedBy(value).toString(10);
      console.log('handleChangeAmountPay:', newAmountReceiveFormatted);
      setAmountReceive(newAmountReceiveFormatted);
    } catch (e) {
      console.error('handleChangeAmountPay:', e);
    }
  };

  const handleChangeAmountReceive = async (event: any) => {
    try {
      const { value } = event.target;
      setAmountReceive(value);
      let pricePay = 0;
      if (isModeLimit) {
        pricePay = await getPricePayLimit(value);
      } else {
        pricePay = await getPricePay(value);
      }
      let newAmountPay = +new BigNumber(value).dividedBy(new BigNumber(pricePay)).toFixed();
      if (pricePay === 0) newAmountPay = 0;
      console.log('handleChangeAmountPay:', newAmountPay);
      setAmountPay(String(newAmountPay));
    } catch (e) {
      console.error('handleChangeAmountReceive:', e);
    }
  };

  const handleChangeAmountReceiveLimit = async (event: any) => {
    try {
      const { value } = event.target;
      setAmountReceive(value);
    } catch (e) {
      console.error('handleChangeAmountReceiveLimit:', e);
    }
  };

  const handleChangeExchanges = (e: boolean, exchange: string) => {
    const newExchanges = exchanges;
    if (exchanges.includes(exchange)) {
      const index = exchanges.indexOf(exchange);
      newExchanges.splice(index, 1);
    } else {
      newExchanges.push(exchange);
    }
    console.log('handleChangeExchanges:', newExchanges);
    setExchanges(newExchanges);
    const newExchangesExcluded: string[] = _.difference(exchangesList, newExchanges);
    console.log('handleChangeExchanges newExchangesExcluded:', newExchangesExcluded);
    setExchangesExcluded(newExchangesExcluded);
  };

  const handleChangeGasPriceCustom = (event: any) => {
    setGasPriceCustom(event.target.value);
  };

  const handleChangeSearchPay = (value: string) => {
    try {
      setSearchValuePay(value);
      const result = tokensFiltered.filter((token: TypeToken) => {
        const includesInSymbol = token.symbol.toLowerCase().includes(value.toLowerCase());
        const includesInName = token.name.toLowerCase().includes(value.toLowerCase());
        if (includesInSymbol || includesInName) return true;
        return false;
      });
      // console.log('matchSearch:', result);
      setSearchTokensResultPay(result);
    } catch (e) {
      console.error(e);
    }
  };

  const handleChangeSearchReceive = (value: string) => {
    try {
      setSearchValueReceive(value);
      const result = tokensFiltered.filter((token: TypeToken) => {
        const includesInSymbol = token.symbol.toLowerCase().includes(value.toLowerCase());
        const includesInName = token.name.toLowerCase().includes(value.toLowerCase());
        if (includesInSymbol || includesInName) return true;
        return false;
      });
      // console.log('matchSearch:', result);
      setSearchTokensResultReceive(result);
    } catch (e) {
      console.error(e);
    }
  };

  const handleWalletConnectLogin = React.useCallback(async () => {
    setToStorage('walletType', 'walletConnect');
    setWalletType('walletConnect');
    toggleModal({ open: false });
  }, [setWalletType, toggleModal]);

  const handleMetamaskLogin = React.useCallback(async () => {
    setToStorage('walletType', 'metamask');
    setWalletType('metamask');
    toggleModal({ open: false });
  }, [setWalletType, toggleModal]);

  const handleSetPeriod = (newPeriod: number) => {
    setPeriod(newPeriod);
    setToStorage('chartPeriod', newPeriod);
  };

  const handleSetMode = (newMode: string) => {
    if (symbolPay === 'ETH') {
      rejectUsingEthForLimit();
      return;
    }
    setMode(newMode);
  };

  const handleConnect = () => {
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
      return null;
    } catch (e) {
      console.error(e);
      setWaiting(false);
      return null;
    }
  };

  const handleApprove = async () => {
    try {
      setWaiting(true);
      const { address: contractAddress, decimals }: any = getTokenBySymbol(symbolPay);
      const { netType, addresses } = config as { [index: string]: any };
      const { allowanceTarget } = addresses[netType];
      const amountInWei = new BigNumber(amountPay)
        .multipliedBy(new BigNumber(10).pow(decimals))
        .toString(10);
      const propsApprove: any = {
        amount: amountInWei,
        userAddress,
        allowanceTarget,
        contractAbi: erc20Abi,
        contractAddress,
      };
      if (isSymbolPayETH) {
        // propsApprove.amount = new BigNumber(amountPay)
        //   .multipliedBy(new BigNumber(10).pow(decimals))
        //   .toString(10);
        // const resultApprove = await web3Provider.approve(propsApprove);
        // console.log('handleApprove resultApprove:', resultApprove);
        // setWaiting(false);
        // setApproved(true);
      } else {
        // const totalSupply = await web3Provider.totalSupply({
        //   contractAddress,
        //   contractAbi: erc20Abi,
        // });
        // console.log('handleApprove totalSupply:', totalSupply);
        // propsApprove.amount = totalSupply;
        const resultApprove = await web3Provider.approve(propsApprove);
        console.log('handleApprove resultApprove:', resultApprove);
        setWaiting(false);
      }
      return null;
    } catch (e) {
      console.error(e);
      setWaiting(false);
      return null;
    }
  };

  const handleTrade = () => {
    try {
      setWaiting(true);
      if (isModeLimit) return tradeLimit();
      trade();
      return null;
    } catch (e) {
      console.error(e);
      setWaiting(false);
      return null;
    }
  };

  const handleSelectSymbolPay = async (symbol: string) => {
    console.log('handleSelectSymbolPay:', symbol);
    // setAmountPay(0);
    // setAmountReceive(0);
    setSymbolPay(symbol);
    setOpenDropdownPay(false);
    const tokensSymbolsReceive = await getTokensSymbolsReceive();
    let newSymbolReceive = symbolReceive;
    if (symbol === newSymbolReceive) {
      newSymbolReceive = '';
      setSymbolReceive('');
      setAmountReceive('0');
    }
    if (!tokensSymbolsReceive.includes(symbolReceive)) newSymbolReceive = '';
    history.push(`/markets/${symbol}/${newSymbolReceive}`);
  };

  const handleSelectSymbolReceive = (symbol: string) => {
    console.log('handleSelectSymbolReceive:', symbol);
    // setAmountPay('0');
    // setAmountReceive('0');
    setSymbolReceive(symbol);
    setOpenDropdownReceive(false);
    history.push(`/markets/${symbolPay}/${symbol}`);
  };

  const handleSelectSlippage = (value: number) => {
    setSlippage(value);
    setOpenSelect(false);
  };

  const handleSelectExpiration = (minutes: number) => {
    setExpiration(minutes);
    setOpenSelect(false);
  };

  const handleResetSettings = () => {
    setSlippage(0);
    setExchanges([]);
    setExchangesExcluded([]);
    setGasPriceType('');
  };

  const switchPayAndReceive = () => {
    if (!symbolReceive) return;
    setSymbolPay(symbolReceive);
    setSymbolReceive(symbolPay);
    setAmountPay(amountReceive);
    setAmountReceive(amountPay);
    history.push(`/markets/${symbolReceive}/${symbolPay}`);
  };

  const handleHoverChart = (value: string | null) => {
    setPriceChart(value);
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

  const handleClickOutsideSelectSlippage = (e: any) => {
    if (
      !refSelectSlippage?.current?.contains(e.target) &&
      !refSelectLabelSlippage?.current?.contains(e.target)
    ) {
      setOpenSelectSlippage(false);
    }
  };

  React.useEffect(() => {
    document.addEventListener('click', (e) => {
      handleClickOutsideDropdownPay(e);
      handleClickOutsideDropdownReceive(e);
      handleClickOutsideSelect(e);
      handleClickOutsideSelectSlippage(e);
    });
    return () => {
      document.removeEventListener('click', (e) => {
        handleClickOutsideDropdownPay(e);
        handleClickOutsideDropdownReceive(e);
        handleClickOutsideSelect(e);
        handleClickOutsideSelectSlippage(e);
      });
    };
  }, []);

  React.useEffect(() => {
    if (!openSettings) return;
    getGasPrice();
  }, [getGasPrice, openSettings]);

  React.useEffect(() => {
    if (!symbolPay) return;
    getTokenPay();
    getPrices();
    if (!symbolOne) return;
    switch (period) {
      case 1:
        getHistoryDay();
        break;
      case 7:
        getHistoryHourWeek();
        break;
      case 30:
        getHistoryHourMonth();
        break;
      default:
        break;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [symbolPay, symbolReceive]);

  React.useEffect(() => {
    filterTokens();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  React.useEffect(() => {
    getPoints();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [marketHistory]);

  React.useEffect(() => {
    if (!tokens || tokens?.length === 0) return;
    if (!tokensReceive || tokensReceive?.length === 0) return;
    switch (period) {
      case 1:
        getHistoryDay();
        break;
      case 7:
        getHistoryHourWeek();
        break;
      case 30:
        getHistoryHourMonth();
        break;
      default:
        break;
    }
    getPoints();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [period, tokens, tokensReceive]);

  React.useEffect(() => {
    getDateTime();
    getPoints();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [marketHistory, period]);

  React.useEffect(() => {
    if (!tokensFiltered || tokensFiltered?.length === 0) return;
    console.log('PageMarketsContent useEffect tokensFiltered:', tokensFiltered);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    getTokensReceive();
  }, [tokensFiltered, getTokensReceive]);

  React.useEffect(() => {
    if (!tokensFiltered || tokensFiltered?.length === 0) return;
    // eslint-disable-next-line react-hooks/exhaustive-deps
    setSearchTokensResultPay(tokensFiltered);
    setSearchTokensResultReceive(tokensReceive);
  }, [tokensFiltered, tokensReceive]);

  React.useEffect(() => {
    if (!symbolPay && !symbolReceive) return;
    if (!web3Provider && !userAddress) return;
    console.log('PageMarketsContent useEffect web3provider:', web3Provider);
    getBalanceOfTokensPay();
    getBalanceOfTokensReceive();
  }, [
    symbolPay,
    symbolReceive,
    userAddress,
    web3Provider,
    getBalanceOfTokensPay,
    getBalanceOfTokensReceive,
  ]);

  React.useEffect(() => {
    getTokenPay();
    getPrices();
  }, [symbolPay, getPrices, getTokenPay]);

  React.useEffect(() => {
    setSymbolPay(symbolOne);
    filterTokens();
    if (!symbolTwo) return;
    setSymbolReceive(symbolTwo);
  }, [symbolOne, symbolTwo, filterTokens]);

  React.useEffect(() => {
    if (!symbolReceive) return;
    updateAmountReceive();
    if (!symbolPay) return;
    if (symbolPay === 'ETH') return;
    getAllowance();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [symbolReceive, symbolPay]);

  React.useEffect(() => {
    if (!symbolReceive) return;
    if (!symbolPay) return;
    if (!amountPay) return;
    if (!userAddress) return;
    if (waiting) return;
    if (symbolPay === 'ETH') return;
    getAllowance();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [symbolReceive, symbolPay, amountPay, userAddress, waiting]);

  React.useEffect(() => {
    // setApproved(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [symbolPay]);

  const RadioLabelFast = (
    <div className={s.radioLabelGas}>
      <div>Fast</div>
      <div>{gasPriceFromNet} GWei</div>
    </div>
  );

  const RadioLabelVeryFast = (
    <div className={s.radioLabelGas}>
      <div>Very Fast</div>
      <div>{gasPriceFromNet + 15} GWei</div>
    </div>
  );

  const RadioLabelCustom = (
    <div className={s.radioLabelGas} key="radioLabelGas">
      <div>Custom</div>
      <div className={s.radioLabelGasInner}>
        <div className={s.radioLabelGasInput}>
          {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
          <label htmlFor="inputGas" />
          <input
            key="inputGasPrice"
            ref={refInputGasPrice}
            id="inputGas"
            type="number"
            value={gasPriceCustom}
            onChange={handleChangeGasPriceCustom}
          />
        </div>
        <div>GWei</div>
      </div>
    </div>
  );

  const SelectLabelSlippage = (
    <div
      ref={refSelectLabelSlippage}
      className={s.containerSettingsSelectLabel}
      role="button"
      tabIndex={0}
      onKeyDown={() => {}}
      onClick={handleOpenSelectSlippage}
    >
      <div>{slippage} %</div>
      <IconArrowDownWhite />
    </div>
  );

  const SelectLabelExpiration = (
    <div
      ref={refSelectLabel}
      className={s.containerSettingsSelectLabel}
      role="button"
      tabIndex={0}
      onKeyDown={() => {}}
      onClick={handleOpenSelect}
    >
      <div>{prettyExpiration(expiration)}</div>
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
        {searchTokensResultPay.map((token: any, it: number) => {
          if (it > 30) return null;
          const { name: tokenName, symbol, image = imageTokenPay, address, decimals } = token;
          const isBalanceZero = !userBalances[address];
          const newBalance = !isBalanceZero
            ? new BigNumber(userBalances[address])
                .dividedBy(new BigNumber(10).pow(decimals))
                .toString(10)
            : '0';
          const balance = !isBalanceZero ? prettyPrice(newBalance) : '';
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
                <div className={s.containerTradingCardSearchItemPrice}>{balance}</div>
              </div>
              <div className={s.containerTradingCardSearchItemSymbol}>
                {symbol.length < 4 ? (
                  <div>{symbol}</div>
                ) : (
                  <div className={s.symbolWide}>{symbol}</div>
                )}
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
        {searchTokensResultReceive.map((token: any, it: number) => {
          if (it > 30) return null;
          const { name: tokenName, symbol, image = imageTokenPay, address, decimals } = token;
          const isBalanceZero = !userBalances[address];
          const newBalance = !isBalanceZero
            ? new BigNumber(userBalances[address])
                .dividedBy(new BigNumber(10).pow(decimals))
                .toString(10)
            : '0';
          const balance = !isBalanceZero ? prettyPrice(newBalance) : '';
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
                <div className={s.containerTradingCardSearchItemPrice}>{balance}</div>
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
            {marketPrice ? prettyPrice(marketPrice?.toString()) : 0} {symbolReceive}
          </div>
          <div
            className={classPriceChange}
            data-positive={isPriceChangePositive}
            data-negative={isPriceChangeNegative}
          >
            {isPriceChangePositive && '+'}
            {priceChange || 0}%
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
            {isModeMarket && (
              <div
                className={s.containerTitleSecondItem}
                onClick={handleOpenSettings}
                role="button"
                tabIndex={0}
                onKeyDown={() => {}}
              >
                <IconGear />
              </div>
            )}
          </div>
        </div>
      </section>

      {isModeMarket && openSettings && (
        <section className={s.containerSettings}>
          <h1>Advanced Settings</h1>
          <div className={s.containerSettingsInner}>
            <div className={s.containerSettingsSlippage}>
              <h2>Max Slippage</h2>
              <Select open={openSelectSlippage} label={SelectLabelSlippage}>
                <div ref={refSelect} className={s.containerSettingsSelectItems}>
                  {new Array(21).fill(0).map((item, ii) => {
                    return (
                      <div
                        key={uuid()}
                        role="button"
                        tabIndex={0}
                        onClick={() => handleSelectSlippage(ii)}
                        onKeyDown={() => {}}
                      >
                        {ii} %
                      </div>
                    );
                  })}
                </div>
              </Select>
            </div>
            <div className={s.containerSettingsExchanges}>
              <h2>Exchanges</h2>
              <div className={s.containerSettingsExchangesInner}>
                {exchangesList?.map((exchange) => {
                  const checked = exchanges.includes(exchange);
                  return (
                    <Checkbox
                      key={uuid()}
                      text={exchange}
                      checkedDefault={checked}
                      onChange={(e: boolean) => handleChangeExchanges(e, exchange)}
                    />
                  );
                })}
              </div>
            </div>
            <div className={s.containerSettingsGas}>
              <h2>Gas Price</h2>
              <div className={s.containerSettingsGasInner}>
                <div className={s.radioContainer}>
                  <input
                    className={s.radioInput}
                    type="radio"
                    id="radioGasFast"
                    name="radioGas"
                    checked={isGasPriceTypeFast}
                    onChange={() => handleChangeGasPrice(gasPriceFromNet, 'fast')}
                  />
                  {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                  <label className={s.radioLabel} htmlFor="radioGasFast">
                    <span className={s.radioPoint} />
                    {RadioLabelFast}
                  </label>
                </div>

                <div className={s.radioContainer}>
                  <input
                    className={s.radioInput}
                    type="radio"
                    id="radioGasVeryFast"
                    name="radioGas"
                    checked={isGasPriceTypeVeryFast}
                    onChange={() => handleChangeGasPrice(gasPriceFromNet + 15, 'veryFast')}
                  />
                  {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                  <label className={s.radioLabel} htmlFor="radioGasVeryFast">
                    <span className={s.radioPoint} />
                    {RadioLabelVeryFast}
                  </label>
                </div>

                <div className={s.radioContainer}>
                  <input
                    className={s.radioInput}
                    type="radio"
                    id="radioGasCustom"
                    name="radioGas"
                    checked={isGasPriceTypeCustom}
                    onChange={() => handleChangeGasPrice(gasPriceCustom, 'custom')}
                  />
                  {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                  <label className={s.radioLabel} htmlFor="radioGasCustom">
                    <span className={s.radioPoint} />
                    {RadioLabelCustom}
                  </label>
                </div>
              </div>
            </div>
            <div className={s.containerSettingsButtons}>
              <Button
                normal
                classNameCustom={s.containerSettingsButtonsButton}
                onClick={() => handleResetSettings()}
              >
                Reset
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* You Pay */}
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
                  onFocus={handleFocusAmountPay}
                  onBlur={handleBlurAmountPay}
                />
              </div>
              {symbolPay && (
                <div className={s.containerTradingCardBalance}>
                  Current balance ({getTokenBySymbol(symbolPay).symbol})
                  <span>{prettyBalance(String(balanceOfTokenPay))}</span>
                </div>
              )}
              {messageYouPay && <div className={s.error}>{messageYouPay}</div>}
            </div>
          </div>
          {isModeLimit && (
            <div className={s.containerTradingCardLimit}>
              <div className={s.containerTradingCardLimitInner}>
                <div className={s.containerTradingCardLimitLabel}>
                  <div>{symbolPay} Price</div>
                </div>
                <div className={s.containerTradingCardLimitInput}>
                  {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                  <label htmlFor="inputPay">
                    <div>{symbolReceive}</div>
                  </label>
                  <input
                    id="inputPay"
                    type="number"
                    value={amountReceive}
                    onChange={handleChangeAmountReceiveLimit}
                    onFocus={handleFocusAmountReceive}
                    onBlur={handleBlurAmountReceive}
                  />
                </div>
              </div>
              <div className={s.containerTradingCardLimitInner}>
                <div className={s.containerTradingCardLimitLabel}>
                  <div>Expires in</div>
                </div>
                <Select open={openSelect} label={SelectLabelExpiration}>
                  <div ref={refSelect} className={s.containerSettingsSelectItems}>
                    <div
                      role="button"
                      tabIndex={0}
                      onClick={() => handleSelectExpiration(10)}
                      onKeyDown={() => {}}
                    >
                      10 min
                    </div>
                    <div
                      role="button"
                      tabIndex={0}
                      onClick={() => handleSelectExpiration(30)}
                      onKeyDown={() => {}}
                    >
                      30 min
                    </div>
                    <div
                      role="button"
                      tabIndex={0}
                      onClick={() => handleSelectExpiration(60)}
                      onKeyDown={() => {}}
                    >
                      1 hour
                    </div>
                    <div
                      role="button"
                      tabIndex={0}
                      onClick={() => handleSelectExpiration(24 * 60)}
                      onKeyDown={() => {}}
                    >
                      24 hours
                    </div>
                    <div
                      role="button"
                      tabIndex={0}
                      onClick={() => handleSelectExpiration(3 * 24 * 60)}
                      onKeyDown={() => {}}
                    >
                      3 days
                    </div>
                    <div
                      role="button"
                      tabIndex={0}
                      onClick={() => handleSelectExpiration(7 * 24 * 60)}
                      onKeyDown={() => {}}
                    >
                      7 days
                    </div>
                  </div>
                </Select>
              </div>
            </div>
          )}
        </div>

        <div className={cns(s.containerTradingDivider, s.containerTradingCardLimitOpen)}>
          <div
            role="button"
            title={!symbolReceive ? 'Select receive currency to switch' : ''}
            tabIndex={0}
            className={s.containerTradingDividerInner}
            onClick={switchPayAndReceive}
            onKeyDown={() => {}}
          >
            <IconExchange />
          </div>
        </div>

        {/* You Receive */}
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
                  onFocus={handleFocusAmountReceive}
                  onBlur={handleBlurAmountReceive}
                />
              </div>
              {symbolReceive && (
                <div className={s.containerTradingCardBalance}>
                  Current balance ({getTokenBySymbol(symbolReceive).symbol})
                  <span>{prettyBalance(String(balanceOfTokenReceive))}</span>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className={s.containerTradingButton}>
          {userAddress ? (
            isAllowed || isSymbolPayETH ? (
              <Button onClick={handleTrade} disabled={isTradeDisabled || waiting}>
                {waiting ? 'Waiting...' : 'Trade'}
              </Button>
            ) : (
              <Button onClick={handleApprove} disabled={isTradeDisabled || waiting}>
                {waiting ? 'Waiting...' : 'Approve'}
              </Button>
            )
          ) : (
            <Button onClick={handleConnect}>Connect wallet</Button>
          )}
        </div>
      </section>

      <section className={s.containerChart}>
        <div className={s.chart}>
          {points.length > 0 && (
            <LineChart
              interactive
              data={points}
              dateTime={dateTime}
              chartHeight={140}
              padding={20}
              onHover={handleHoverChart}
            />
          )}
        </div>
        <div className={s.chartData}>
          <div className={s.chartDataFirst}>
            <div className={s.chartDataPriceName}>Current price</div>
            <div className={s.chartDataPrice}>
              {!symbolTwo && '$'}
              {prettyPrice(priceChart || price.toString())} {symbolTwo}
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
              {priceChange || 0}%
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
