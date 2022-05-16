import React, { LegacyRef, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';
import BigNumber from 'bignumber.js/bignumber';
import cns from 'classnames';
import _ from 'lodash';
import { useMedia } from 'use-media';
import { v1 as uuid } from 'uuid';

import ArrowBack from '../../../assets/icons/arrow-back.svg';
import ArrowDown from '../../../assets/icons/arrow-down-blue.svg';
import { ReactComponent as IconArrowDownWhite } from '../../../assets/icons/arrow-down-white.svg';
import { ReactComponent as IconExchange } from '../../../assets/icons/exchange.svg';
import GearIcon from '../../../assets/icons/gear-token-icon.png';
import { ReactComponent as IconDiamond } from '../../../assets/icons/icon-diamond.svg';
import EthIcon from '../../../assets/icons/icon-eth.svg';
import { ReactComponent as IconSearchWhite } from '../../../assets/icons/search-white.svg';
import { ReactComponent as IconSettings } from '../../../assets/icons/switcher-settings.svg';
import imageTokenPay from '../../../assets/images/token.png';
import {
  Checkbox,
  Dropdown,
  Input,
  RadioSelect,
  Select,
  SkeletonLoader,
} from '../../../components';
import Button from '../../../components/Button';
import ModalContentQuotes from '../../../components/ModalContentQuotes';
import config from '../../../config';
import { useWalletConnectorContext } from '../../../contexts/WalletConnect';
import erc20Abi from '../../../data/erc20Abi.json';
import useDebounce from '../../../hooks/useDebounce';
import { useUserTier } from '../../../hooks/useUserTier';
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
import { sleep } from '../../../utils/promises';

import s from './style.module.scss';

const CryptoCompare = new CryptoCompareService();
const Zx = new Service0x();
const Etherscan = new EtherscanService();
const CoinMarketCap = new CoinMarketCapService();

const exchangesList: string[] = [
  '0x',
  'Balancer',
  'Balancer_V2',
  'Bancor',
  'Component',
  'CREAM',
  'CryptoCom',
  'Curve',
  'DODO',
  'DODO_V2',
  'Eth2Dai',
  'Kyber',
  'KyberDMM',
  'LiquidityProvider',
  'Linkswap',
  'MakerPsm',
  'Mooniswap',
  'MultiHop',
  'mStable',
  'Saddle',
  'Shell',
  'Smoothy',
  'SnowSwap',
  'SushiSwap',
  'Swerve',
  'Uniswap',
  'Uniswap_V2',
  'Uniswap_V3',
  'xSigma',
];

export type slippageItem = {
  [k: string]: string | number | boolean;
  text: string | number;
  checked: boolean;
};

const initSlippage = [
  {
    text: 0.1,
    checked: false,
  },
  {
    text: 0.5,
    checked: false,
  },
  {
    text: 1,
    checked: false,
  },
  {
    text: 3,
    checked: false,
  },
];

// const exchangesListOld: string[] = [
//   '0x',
//   'Native',
//   'Uniswap',
//   'Uniswap_V2',
//   'Uniswap_V3',
//   'Eth2Dai',
//   'Kyber',
//   'KyberDMM',
//   'Curve',
//   'LiquidityProvider',
//   'MultiBridge',
//   'Balancer',
//   'Cream',
//   'Bancor',
//   'MStable',
//   'Mooniswap',
//   'MultiHop',
//   'Shell',
//   'Swerve',
//   'SnowSwap',
//   'SushiSwap',
//   'Dodo',
// ];

type TypeToken = {
  symbol: string;
  name: string;
  price?: number;
  priceChange: number | string;
  image?: string;
};

type TypeUseParams = {
  addressOne: string;
  addressTwo?: string;
};

type TypeModalParams = {
  open: boolean;
  noCloseButton?: boolean;
  fullPage?: boolean;
  text?: string | React.ReactElement;
  header?: string | React.ReactElement;
  delay?: number;
  onClose?: () => void;
};

type TypeDropdownItemsParams = {
  refContainer?: LegacyRef<HTMLDivElement>;
  open?: boolean;
  label?: React.ReactElement | string;
  searchValue?: string;
  onChangeSearch?: (value: string) => void;
  children?: any[];
};

export const DropdownItems: React.FC<TypeDropdownItemsParams> = React.memo(
  ({
    refContainer = null,
    open = false,
    label = 'Search',
    searchValue = '',
    onChangeSearch = () => {},
    children = [],
  }) => {
    const countChildrenInPage = 30;

    const refScrollContainer = React.useRef<HTMLDivElement>(null);

    const [page, setPage] = React.useState<number>(0);
    const [childrenShown, setChildrenShown] = React.useState<any[]>(
      children.slice(0, countChildrenInPage),
    );

    const handleScroll = React.useCallback(() => {
      if (!refScrollContainer?.current) return;
      const { scrollHeight, clientHeight, scrollTop } = refScrollContainer.current;
      const isBottomReached = +scrollHeight - clientHeight - scrollTop < 100;
      // console.log('DropdownItems handleScroll:', {
      //   scrollTop,
      //   scrollHeight,
      //   clientHeight,
      //   isBottomReached,
      //   page,
      // });
      if (isBottomReached) setPage(page + 1);
    }, [page]);

    React.useEffect(() => {
      // console.log('DropdownItems useEffect:', { children, childrenShown, page });
      setChildrenShown(children.slice(0, countChildrenInPage * (page + 1)));
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, children]);

    React.useEffect(() => {
      setPage(1);
    }, [open]);

    return (
      <div ref={refContainer}>
        <Input
          autoFocus={open}
          placeholder="Search"
          label={label}
          value={searchValue}
          onChange={onChangeSearch}
          className={s.containerTradingCardSearchInput}
        />
        <div
          ref={refScrollContainer}
          className={s.containerTradingCardSearchItems}
          onScroll={handleScroll}
        >
          {childrenShown}
        </div>
      </div>
    );
  },
);

export const PageMarketsContent: React.FC = React.memo(() => {
  const receiveInputRef = useRef<any>();
  const customAddressRef = useRef<any>();
  const sellInputRef = useRef<any>();
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
  const setStatus = React.useCallback(
    (props: any) => dispatch(statusActions.setStatus(props)),
    [dispatch],
  );

  const { address: userAddress, balances: userBalances } = useSelector(({ user }: any) => user);
  const { tokens, tokensBySymbol, tokensByAddress } = useSelector(({ zx }: any) => zx);
  const { chainId } = useSelector(({ wallet }: any) => wallet);
  const { messageYouPay } = useSelector(({ status }: any) => status);

  let { addressOne = '', addressTwo = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee' } =
    useParams<TypeUseParams>();
  addressOne = addressOne.toLowerCase();
  addressTwo = addressTwo.toLowerCase();

  const refDropdownPay = React.useRef<HTMLDivElement>(null);
  const refDropdownReceive = React.useRef<HTMLDivElement>(null);
  const refDropdownLabelPay = React.useRef<HTMLDivElement>(null);
  const refDropdownLabelReceive = React.useRef<HTMLDivElement>(null);
  const refSelect = React.useRef<HTMLDivElement>(null);
  const refSelectLabel = React.useRef<HTMLDivElement>(null);
  const refSelectSlippage = React.useRef<HTMLDivElement>(null);
  const refSelectLabelSlippage = React.useRef<HTMLDivElement>(null);
  const refInputGasPrice = React.useRef<HTMLInputElement>(null);

  const [slippageItems, setSlippageItems] = React.useState<slippageItem[]>(initSlippage);
  const [dividerRotate, setRotateDivider] = React.useState(1);
  const [tokensFiltered, setTokensFiltered] = React.useState<any[]>(tokens);
  const [, setPrice] = React.useState<number>(0);
  const [priceMarket, setPriceMarket] = React.useState<number>(0);
  const [priceChange, setPriceChange] = React.useState<number>(0);
  // const [priceChart, setPriceChart] = React.useState<string | null>();
  const [marketHistory, setMarketHistory] = React.useState<any[]>([]);
  const [, setPoints] = React.useState<number[]>([]);
  const [, setDateTime] = React.useState<number[]>([]);
  const [period] = React.useState<number>(periodDefault > 0 ? periodDefault : 1);
  const [searchValuePay, setSearchValuePay] = React.useState<string>('');
  const [searchValueReceive, setSearchValueReceive] = React.useState<string>('');
  const [exchanges, setExchanges] = React.useState<any>([...exchangesList]);
  const [exchangesExcluded, setExchangesExcluded] = React.useState<string[]>([]);
  const [openDropdownPay, setOpenDropdownPay] = React.useState<boolean>(false);
  const [openDropdownReceive, setOpenDropdownReceive] = React.useState<boolean>(false);
  const [openSelect, setOpenSelect] = React.useState<boolean>(false);
  const [, setOpenSelectSlippage] = React.useState<boolean>(false);
  const [openSettings, setOpenSettings] = React.useState<boolean>(false);
  const [mode, setMode] = React.useState<string>('market');
  const { userCurrentTier } = useUserTier();
  const [searchTokensResultPay, setSearchTokensResultPay] = React.useState<TypeToken[]>(tokens);
  const [isLoaded, setLoaded] = React.useState(false);
  const [tokensReceive, setTokensReceive] = React.useState<TypeToken[]>([]);
  const [searchTokensResultReceive, setSearchTokensResultReceive] =
    React.useState<TypeToken[]>(tokensReceive);
  // const [tokenNamePay, setTokenNamePay] = React.useState<string>('');
  const [addressPay, setAddressPay] = React.useState<string>(addressOne.toUpperCase());
  const [addressReceive, setAddressReceive] = React.useState<string>(
    addressTwo?.toUpperCase() || '',
  );
  const [inputChanged, setInputChanged] = React.useState<string>();
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
  const [allowanceCustom, setAllowanceCustom] = React.useState<number>(0);
  const [openQuotes, setOpenQuotes] = React.useState<boolean>(false);
  const [exchangesWithLiquidity, setExchangesWithLiquidity] = React.useState<string[]>();
  const [isCustomAddress, setIsCustomAddress] = React.useState<boolean>(
    localStorage.bitgear_customAddress || false,
  );
  const [customAddress, setCustomAddress] = React.useState<string>('');

  const isWide = useMedia({ minWidth: '767px' });

  const amountPayDebounced = useDebounce(amountPay, 300);
  const amountReceiveDebounced = useDebounce(amountReceive, 300);

  const isAddressPayETH = addressPay === '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee';

  const isModeMarket = mode === 'market';
  const isModeLimit = mode === 'limit';

  const classPriceChange = s.containerCostsPriceChange;
  const isPriceChangePositive = +priceChange > 0;
  const isPriceChangeNegative = +priceChange < 0;

  const isGasPriceTypeFast = gasPriceType === 'fast';
  const isGasPriceTypeVeryFast = gasPriceType === 'veryFast';
  const isGasPriceTypeCustom = gasPriceType === 'custom';

  const tokenOne = tokensByAddress && tokensByAddress[addressOne];
  const tokenTwo = tokensByAddress && tokensByAddress[addressTwo];
  const tokenPay = tokensByAddress && tokensByAddress[addressPay];
  const tokenReceive = tokensByAddress && tokensByAddress[addressReceive];
  // console.log(
  //   'PageMarketsContent tokens:',
  //   tokensByAddress,
  //   tokenOne,
  //   tokenTwo,
  //   tokenPay,
  //   tokenReceive,
  // );

  let isAllowed;
  let isCustomAllowance = true;
  if (tokensBySymbol && tokensByAddress[addressPay]) {
    const decimals10 = new BigNumber(10).pow(tokenPay?.decimals).toFixed();
    const amountPayInWei = new BigNumber(amountPay).multipliedBy(decimals10).toFixed();
    isAllowed = allowance >= +amountPayInWei;

    if (customAddress) {
      isCustomAllowance = allowanceCustom >= +amountPayInWei;
    }
    // console.log('PageMarketsContent:', symbolPay, allowance, decimals10, amountPayInWei);
  }

  React.useEffect(() => {
    if (isCustomAddress) {
      localStorage.bitgear_customAddress = isCustomAddress;
    } else {
      delete localStorage.bitgear_customAddress;
    }
  }, [isCustomAddress]);

  const isValidCustomAddress = React.useMemo(() => {
    try {
      if (customAddress) {
        return web3Provider.isAddress(customAddress);
      }
      return true;
    } catch (error) {
      return false;
    }
  }, [customAddress, web3Provider]);

  const isTradeDisabled = userAddress
    ? +amountReceive === 0 || !balanceOfTokenPay || +balanceOfTokenPay < +amountPay
    : false;

  let marketPrice = '-';
  if (tokensByAddress) {
    const symbolTwo = tokenTwo?.symbol;
    marketPrice =
      marketHistory && marketHistory[0] ? marketHistory[0]?.quote[symbolTwo || 'USD']?.close : 0;
  }

  const chooseExchangesWithBestPrice = React.useCallback(
    (exchangesToSort: any) => {
      try {
        if (!exchangesToSort) return null;
        const excludedSources = exchangesExcluded.join(',');
        const priceComparisonsWithoutExcluded = exchangesToSort.filter((item: any) => {
          if (excludedSources?.toLowerCase().includes(item.name.toLowerCase())) return false;
          if (!item.price) return false;
          return true;
        });
        priceComparisonsWithoutExcluded.sort((a: any, b: any) => b.price - a.price);
        console.log(
          'PageMarketsContent chooseExchangesWithBestPrice:',
          exchangesExcluded,
          priceComparisonsWithoutExcluded,
        );
        return [...priceComparisonsWithoutExcluded];
      } catch (e) {
        console.error('PageMarketsContent chooseExchangesWithBestPrice:', e);
        return null;
      }
    },
    [exchangesExcluded],
  );

  const getQuoteBuy = React.useCallback(
    async ({ amount }) => {
      try {
        if (!tokenPay) return null;
        if (!amount) return null;
        if (!addressReceive) return null;
        console.log('PageMarketsContent getQuoteBuy:', amount);
        const { decimals } = tokenPay;
        const props = {
          buyToken: addressReceive,
          sellToken: addressPay,
          sellAmount: amount,
          decimals,
          includePriceComparisons: true,
        };
        const resultGetQuote = await Zx.getQuote(props);
        console.log('PageMarketsContent getQuoteBuy:', props, resultGetQuote);
        if (resultGetQuote.status === 'SUCCESS') {
          const newQuote = { ...resultGetQuote.data };
          const exchangesWithBestPrice =
            chooseExchangesWithBestPrice(newQuote.priceComparisons) || [];
          let exchangesWithLiquidityNew = exchangesWithBestPrice.map((item) => item.name);
          if (!exchangesWithBestPrice.length) {
            const source = newQuote.sources.filter((item: any) => item.proportion === '1')[0];
            exchangesWithLiquidityNew = source ? [source.name] : [];
          }
          setExchangesWithLiquidity(exchangesWithLiquidityNew);
          if (exchangesWithBestPrice) {
            for (let i = 0; i < exchangesWithBestPrice.length; i += 1) {
              const newTradeProps: any = { ...props };
              newTradeProps.excludedSources = '';
              newTradeProps.includedSources = exchangesWithBestPrice[i].name;
              const resultGetQuoteNew = await Zx.getQuote(newTradeProps);
              console.log('PageMarketsContent getQuoteBuy resultGetQuoteNew:', resultGetQuoteNew);
              if (resultGetQuoteNew.status === 'SUCCESS') {
                return resultGetQuoteNew.data.guaranteedPrice;
              }
              await sleep(100);
            }
          }
          return resultGetQuote.data.guaranteedPrice;
        }
        return null;
      } catch (e) {
        console.error('PageMarketsContent getQuoteBuy:', e);
        return null;
      }
    },
    [tokenPay, addressPay, addressReceive, chooseExchangesWithBestPrice],
  );

  const getPriceBuy = React.useCallback(
    async ({ amount }) => {
      try {
        if (!tokenPay) return null;
        if (!amount) return null;
        if (!addressReceive) return null;
        console.log('PageMarketsContent getPriceBuy:', amount);
        const { decimals } = tokenPay;
        const props = {
          buyToken: addressReceive,
          sellToken: addressPay,
          sellAmount: amount,
          decimals,
          includePriceComparisons: true,
        };
        const result = await Zx.getPrice(props);
        console.log('PageMarketsContent getPriceBuy:', props, result);
        if (result.status === 'SUCCESS') return result.data.price;
        return null;
      } catch (e) {
        console.error('PageMarketsContent getPriceBuy:', e);
        return null;
      }
    },
    [tokenPay, addressPay, addressReceive],
  );

  // const getQuoteSell = React.useCallback(
  //   async ({ amount }) => {
  //     try {
  //       console.log('PageMarketsContent getQuoteSell:', amount);
  //       if (!amount) return null;
  //       if (!symbolReceive) return null;
  //       const { decimals, address: addressPay } = getTokenBySymbol(symbolPay);
  //       const { address: addressReceive } = getTokenBySymbol(symbolReceive);
  //       const props = {
  //         buyToken: addressReceive,
  //         sellToken: addressPay,
  //         sellAmount: amount,
  //         decimals,
  //       };
  //       const result = await Zx.getQuote(props);
  //       console.log('PageMarketsContent getQuoteSell:', props, result);
  //       if (result.status === 'SUCCESS') return result.data.guaranteedPrice;
  //       return null;
  //     } catch (e) {
  //       console.error('PageMarketsContent getQuoteSell:', e);
  //       return null;
  //     }
  //   },
  //   [getTokenBySymbol, symbolPay, symbolReceive],
  // );
  //
  // const getPriceSell = React.useCallback(
  //   async ({ amount }) => {
  //     try {
  //       console.log('PageMarketsContent getPriceSell:', amount);
  //       if (!amount) return null;
  //       if (!symbolReceive) return null;
  //       const { decimals, address: addressPay } = getTokenBySymbol(symbolPay);
  //       const { address: addressReceive } = getTokenBySymbol(symbolReceive);
  //       const props = {
  //         buyToken: addressReceive,
  //         sellToken: addressPay,
  //         sellAmount: amount,
  //         decimals,
  //       };
  // props.includePriceComparisons = true;
  //       const result = await Zx.getPrice(props);
  //       console.log('PageMarketsContent getPriceSell:', props, result);
  //       if (result.status === 'SUCCESS') return result.data.price;
  //       return null;
  //     } catch (e) {
  //       console.error('PageMarketsContent getPrice:', e);
  //       return null;
  //     }
  //   },
  //   [getTokenBySymbol, symbolPay, symbolReceive],
  // );

  const getPricePay = React.useCallback(async () => {
    try {
      if (!amountPayDebounced || amountPayDebounced === '0') return;
      if (!addressReceive) return;
      const resultGetQuote = await getQuoteBuy({ amount: amountPayDebounced });
      if (!resultGetQuote) return;
      const newAmountFormatted = new BigNumber(amountPayDebounced)
        .multipliedBy(resultGetQuote)
        .toString(10);
      setAmountReceive(newAmountFormatted);
      console.log('PageMarketsContent getPricePay:', newAmountFormatted);
    } catch (e) {
      console.error('PageMarketsContent getPricePay:', e);
    }
  }, [getQuoteBuy, amountPayDebounced, addressReceive]);

  const getPricePayLimit = React.useCallback(async () => {
    try {
      if (!amountPayDebounced || amountPayDebounced === '0') return;
      if (!addressReceive) return;
      const resultGetPrice = await getPriceBuy({ amount: amountPayDebounced });
      if (!resultGetPrice) return;
      const newAmountFormatted = new BigNumber(amountPayDebounced)
        .multipliedBy(resultGetPrice || marketPrice)
        .toString(10);
      setAmountReceive(newAmountFormatted);
      console.log('PageMarketsContent getPricePayLimit:', newAmountFormatted);
    } catch (e) {
      console.error('PageMarketsContent getPricePayLimit:', e);
    }
  }, [getPriceBuy, amountPayDebounced, marketPrice, addressReceive]);

  const getPriceReceive = React.useCallback(async () => {
    try {
      if (!amountReceiveDebounced || amountReceiveDebounced === '0') return;
      if (!addressReceive) return;
      const resultGetQuote = await getQuoteBuy({ amount: amountReceiveDebounced });
      if (!resultGetQuote) return;
      const newAmountFormatted = new BigNumber(amountReceiveDebounced)
        .dividedBy(resultGetQuote)
        .toString(10);
      setAmountPay(newAmountFormatted);
      console.log('PageMarketsContent getPriceReceive:', newAmountFormatted);
    } catch (e) {
      console.error('PageMarketsContent getPriceReceive:', e);
    }
  }, [getQuoteBuy, amountReceiveDebounced, addressReceive]);

  const getPriceReceiveLimit = React.useCallback(async () => {
    try {
      if (!amountReceiveDebounced || amountReceiveDebounced === '0') return;
      if (!addressReceive) return;
      const resultGetPrice = await getPriceBuy({ amount: amountReceiveDebounced });
      if (!resultGetPrice) return;
      const newAmountFormatted = new BigNumber(amountReceiveDebounced)
        .dividedBy(resultGetPrice || marketPrice)
        .toString(10);
      setAmountPay(newAmountFormatted);
      console.log('PageMarketsContent getPriceReceiveLimit:', newAmountFormatted);
    } catch (e) {
      console.error('PageMarketsContent getPriceReceiveLimit:', e);
    }
  }, [getPriceBuy, amountReceiveDebounced, marketPrice, addressReceive]);

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

  const getPriceMarket = React.useCallback(async () => {
    try {
      if (!addressPay) return;
      if (!tokenPay) return;
      if (!tokensBySymbol) return;
      // console.log('PageMarketsContent getPriceMarket:', symbolPay, symbolReceive, tokens);
      const { decimals } = tokenPay;
      const { address: addressUSDC } = tokensBySymbol.USDC;
      const result = await Zx.getPrice({
        buyToken: addressReceive || addressUSDC,
        sellToken: addressPay,
        sellAmount: '1',
        skipValidation: true,
        decimals,
      });
      console.log('PageMarketsContent getPriceMarket:', result);
      let newPrice = 0;
      if (result.status === 'SUCCESS') {
        newPrice = result.data.price;
        setPriceMarket(newPrice);
        setLoaded(true);
      }
    } catch (e) {
      console.error(e);
    }
  }, [tokenPay, tokensBySymbol, addressPay, addressReceive]);

  const getPrices = React.useCallback(async () => {
    try {
      setStatus({ messageYouPay: null });
      if (!tokenPay) return null;
      const { decimals } = tokenPay;
      if (!decimals) return null;
      if (!amountPayDebounced || amountPayDebounced === '' || amountPayDebounced === '0')
        return null;
      let newPrice = 0;
      if (addressReceive && amountPayDebounced) {
        const result = await Zx.getPrice({
          buyToken: addressReceive,
          sellToken: addressPay,
          sellAmount: amountPayDebounced,
          skipValidation: true,
          decimals,
          includePriceComparisons: true,
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
          symbolOne: addressPay,
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
  }, [tokenPay, setStatus, amountPayDebounced, addressPay, addressReceive]);

  // const getTokenPay = React.useCallback(async () => {
  //   try {
  //     if (!tokenPay) return;
  //     const { name } = tokenPay;
  //     setTokenNamePay(name);
  //   } catch (e) {
  //     console.error(e);
  //   }
  // }, [tokenPay]);

  const filterTokens = React.useCallback(() => {
    try {
      let newTokens = [];
      if (isModeLimit) {
        newTokens = tokens.filter((item: any) => item.symbol !== 'ETH');
      } else {
        newTokens = tokens;
      }
      if (userBalances) {
        // eslint-disable-next-line no-confusing-arrow
        newTokens = newTokens.sort((a: any) =>
          userBalances[a.address] && +userBalances[a.address] > 0 ? -1 : 0,
        );
      }
      // eslint-disable-next-line no-confusing-arrow
      newTokens = newTokens.sort((a: any) => (a.symbol === 'GEAR' ? -1 : 0));
      // eslint-disable-next-line no-confusing-arrow
      newTokens = newTokens.sort((a: any) => (a.symbol === 'ETH' ? -1 : 0));
      setTokensFiltered(newTokens);
      console.log('PageMarketsContent', 'filterTokens:', newTokens);
      return null;
    } catch (e) {
      console.error('PageMarketsContent filterTokens:', e);
      return null;
    }
  }, [isModeLimit, tokens, userBalances]);

  // const getTokensSymbolsReceive = async () => {
  //   try {
  //     const result = await Zx.getPrices({
  //       sellToken: addressPay,
  //     });
  //     const prices = result.data.records;
  //     const newPricesSymbols = prices.map((item: any) => item.address);
  //     console.log('PageMarketsContent getTokensSymbolsReceive:', newPricesSymbols);
  //     return newPricesSymbols;
  //   } catch (e) {
  //     console.error('PageMarketsContent getTokensSymbolsReceive:', e);
  //     return [];
  //   }
  // };

  const getTokensReceive = React.useCallback(async () => {
    try {
      let newTokensReceive = tokensFiltered.filter((item: any) => item.address !== addressPay);
      if (newTokensReceive.length === 0) {
        setAddressReceive('');
        setTokensReceive([]);
        return;
      }
      if (userBalances) {
        // eslint-disable-next-line no-confusing-arrow
        newTokensReceive = newTokensReceive.sort((a: any) =>
          userBalances[a.address] && +userBalances[a.address] > 0 ? -1 : 0,
        );
      }
      // eslint-disable-next-line no-confusing-arrow
      newTokensReceive = newTokensReceive.sort((a: any) => (a.symbol === 'GEAR' ? -1 : 0));
      // eslint-disable-next-line no-confusing-arrow
      newTokensReceive = newTokensReceive.sort((a: any) => (a.symbol === 'ETH' ? -1 : 0));
      setTokensReceive(newTokensReceive);
      console.log('PageMarketsContent getTokensReceive:', newTokensReceive);
    } catch (e) {
      console.error(e);
    }
  }, [userBalances, addressPay, tokensFiltered]);

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
      if (!tokenOne) return;
      if (!tokenTwo) return;
      const { symbol: symbolOne } = tokenOne;
      const { symbol: symbolTwo } = tokenTwo;
      const result = await CoinMarketCap.getHistoryDayForPair({
        symbolOne,
        symbolTwo: symbolTwo || 'USD',
      });
      console.log('getHistoryDay:', result);
      setMarketHistory(result.data);
    } catch (e) {
      console.error(e);
    }
  }, [tokenOne, tokenTwo]);

  const getHistoryHourWeek = React.useCallback(async () => {
    try {
      if (!tokenOne) return;
      if (!tokenTwo) return;
      const { symbol: symbolOne } = tokenOne;
      const { symbol: symbolTwo } = tokenTwo;
      const result = await CoinMarketCap.getHistoryWeekForPair({
        symbolOne,
        symbolTwo: symbolTwo || 'USD',
      });
      console.log('getHistoryWeek:', result);
      setMarketHistory(result.data);
    } catch (e) {
      console.error(e);
    }
  }, [tokenOne, tokenTwo]);

  const getHistoryHourMonth = React.useCallback(async () => {
    try {
      if (!tokenOne) return;
      if (!tokenTwo) return;
      const { symbol: symbolOne } = tokenOne;
      const { symbol: symbolTwo } = tokenTwo;
      const result = await CoinMarketCap.getHistoryMonthForPair({
        symbolOne,
        symbolTwo: symbolTwo || 'USD',
      });
      console.log('getHistoryMonth:', result);
      setMarketHistory(result.data);
    } catch (e) {
      console.error(e);
    }
  }, [tokenOne, tokenTwo]);

  const getPoints = React.useCallback(() => {
    try {
      if (!tokenTwo) return;
      const { symbol: symbolTwo } = tokenTwo;
      const newPoints = marketHistory.map((item: any) => {
        return item.quote[symbolTwo || 'USD'].close;
      });
      setPoints(newPoints);
      const newPointsLength = newPoints.length;
      const newPriceChange = ((newPoints[newPointsLength - 1] - newPoints[0]) / newPoints[0]) * 100;
      const prettyNewPriceChange = prettyPriceChange(newPriceChange.toString());
      setPriceChange(+prettyNewPriceChange);
      // console.log('PageMarketsContent getPoints:', newPriceChange, prettyNewPriceChange);
    } catch (e) {
      console.error(e);
    }
  }, [marketHistory, tokenTwo]);

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
      if (!tokenPay) return;
      const { symbol, address: contractAddressPay } = tokenPay;
      if (symbol === 'ETH') {
        const balancePay = await web3Provider.getBalance(userAddress);
        const balancePayFormatted = new BigNumber(balancePay).toString(10);
        setBalanceOfTokenPay(balancePayFormatted);
        return;
      }
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
  }, [userAddress, web3Provider, tokenPay]);

  const getBalanceOfTokensReceive = React.useCallback(async () => {
    try {
      if (!userAddress) return;
      if (!tokenReceive) return;
      const { symbol, address: contractAddressReceive } = tokenReceive;
      if (symbol === 'ETH') {
        const balanceReceive = await web3Provider.getBalance(userAddress);
        const balanceReceiveFormatted = new BigNumber(balanceReceive).toString(10);
        setBalanceOfTokenReceive(balanceReceiveFormatted);
        return;
      }
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
  }, [userAddress, web3Provider, tokenReceive]);

  // const validateTradeErrors = React.useCallback(
  //   (error) => {
  //     const { code } = error.validationErrors[0];
  //     let text: string | React.ReactElement = 'Something gone wrong';
  //     if (code === 1001) {
  //       text = 'Please, enter amount to pay or select token to receive';
  //     } else if (code === 1004) {
  //       text = (
  //         <div>
  //           <p>Insufficicent liquidity.</p>
  //           <p>Please, decrease amount.</p>
  //         </div>
  //       );
  //     }
  //     toggleModal({ open: true, text });
  //     setWaiting(false);
  //   },
  //   [toggleModal],
  // );

  const verifyForm = React.useCallback(() => {
    try {
      if (!addressPay) {
        toggleModal({
          open: true,
          text: (
            <div className={s.messageContent}>
              <div>Please, choose token to pay</div>
            </div>
          ),
        });
        return false;
      }
      if (!addressReceive) {
        toggleModal({
          open: true,
          text: (
            <div className={s.messageContent}>
              <div>Please, choose token to receive</div>
            </div>
          ),
        });
        return false;
      }
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  }, [addressPay, addressReceive, toggleModal]);

  const rejectUsingEthForLimit = React.useCallback(() => {
    try {
      return toggleModal({
        open: true,
        text: (
          <div className={s.messageContent}>
            <p>Unavailable on ETH-based pairs. Use WETH for limit orders.</p>
          </div>
        ),
      });
    } catch (e) {
      console.error(e);
      return false;
    }
  }, [toggleModal]);

  const getAllowanceForCustomSwap = React.useCallback(async () => {
    try {
      if (!addressPay || !addressReceive || !amountPay || !userAddress || !customAddress) return;
      const propsGetAllowance = {
        userAddress,
        allowanceTarget: '0x85e00a4D4dE1071e299D0657EEeb987Cf016eA5F',
        contractAddress: addressPay,
        contractAbi: erc20Abi,
      };
      const resultGetAllowance = await web3Provider.allowance(propsGetAllowance);
      console.log('PageMarketsContent getAllowance:', resultGetAllowance);
      setAllowanceCustom(resultGetAllowance);
    } catch (e) {
      console.error('PageMarketsContent getAllowance:', e);
    }
  }, [addressPay, addressReceive, userAddress, web3Provider, amountPay, customAddress]);

  const getAllowance = React.useCallback(async () => {
    try {
      // console.log('PageMarketsContent getAllowance:', symbolPay, symbolReceive, amountPay);
      if (!addressPay || !addressReceive || !amountPay || !userAddress) return;
      const { netType, addresses } = config as { [index: string]: any };
      const { allowanceTarget, allowanceTargetLimit } = addresses[netType];
      const propsGetAllowance = {
        userAddress,
        allowanceTarget: isModeLimit ? allowanceTargetLimit : allowanceTarget,
        contractAddress: addressPay,
        contractAbi: erc20Abi,
      };
      const resultGetAllowance = await web3Provider.allowance(propsGetAllowance);
      console.log('PageMarketsContent getAllowance:', resultGetAllowance);
      setAllowance(resultGetAllowance);
    } catch (e) {
      console.error('PageMarketsContent getAllowance:', e);
    }
  }, [isModeLimit, addressPay, addressReceive, userAddress, web3Provider, amountPay]);

  const handleCloseQuotes = React.useCallback(() => {
    setOpenQuotes(false);
    toggleModal({ open: false, text: '' });
    setWaiting(false);
  }, [toggleModal]);

  const trade = React.useCallback(async () => {
    try {
      if (!tokenPay) return null;
      if (!tokenReceive) return null;
      if (!amountPay) return null;
      if (!amountReceive) return null;
      if (!userBalances) return null;
      if (!verifyForm()) {
        setWaiting(false);
        return null;
      }
      const { decimals } = tokenPay;
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
      props.includePriceComparisons = true;
      console.log('trade props:', props);
      setWaiting(false);
      setOpenQuotes(true);
      return toggleModal({
        open: true,
        text: (
          <ModalContentQuotes
            open={openQuotes}
            amountPay={amountPay}
            amountReceive={amountReceive}
            tokenPay={tokenPay}
            tokenReceive={tokenReceive}
            tradeProps={props}
            onClose={handleCloseQuotes}
            excludedSources={excludedSources}
            customAddress={customAddress}
          />
        ),
        noCloseButton: true,
        fullPage: !isWide,
        onClose: handleCloseQuotes,
      });
    } catch (e) {
      console.error(e);
      setWaiting(false);
      return null;
    }
  }, [
    openQuotes,
    handleCloseQuotes,
    userBalances,
    isWide,
    toggleModal,
    tokenPay,
    tokenReceive,
    verifyForm,
    slippage,
    getGasPriceSetting,
    addressPay,
    addressReceive,
    amountPay,
    amountReceive,
    // validateTradeErrors,
    // web3Provider,
    // userAddress,
    exchangesExcluded,
    customAddress,
  ]);

  const tradeLimit = React.useCallback(async () => {
    try {
      if (!tokenPay) return null;
      if (!tokenReceive) return null;
      if (!verifyForm()) {
        setWaiting(false);
        return null;
      }
      const { decimals: decimalsPay }: any = tokenPay;
      const { decimals: decimalsReceive }: any = tokenReceive;
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
          text: (
            <div className={s.messageContent}>
              <div>Something gone wrong. Order was not signed</div>
            </div>
          ),
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
          text: (
            <div className={s.messageContent}>
              <div>Something gone wrong. Order was not placed</div>
            </div>
          ),
        });
        return null;
      }
      toggleModal({
        open: true,
        text: (
          <div className={s.messageContent}>
            <div>Order was successfully placed</div>
          </div>
        ),
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
        text: (
          <div className={s.messageContent}>
            <div>Something gone wrong. Order was not placed</div>
          </div>
        ),
      });
      return null;
    }
  }, [
    tokenPay,
    tokenReceive,
    verifyForm,
    addressPay,
    addressReceive,
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
    console.log('OPEN OPEN OPEN');
    setOpenSelect(!openSelect);
  };

  // const handleOpenSelectSlippage = () => {
  //   setOpenSelectSlippage(!openSelectSlippage);
  // };

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
      setInputChanged('pay');
      const { value } = event.target;
      setAmountPay(value);
    } catch (e) {
      console.error('handleChangeAmountPay:', e);
    }
  };

  const handleChangeAmountReceive = async (event: any) => {
    try {
      setInputChanged('receive');
      const { value } = event.target;
      setAmountReceive(value);
    } catch (e) {
      console.error('handleChangeAmountReceive:', e);
    }
  };

  const handleChangeAmountReceiveLimit = async (event: any) => {
    try {
      setInputChanged('receiveLimit');
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
    const newExchangesExcluded: string[] = _.difference([...exchangesList], newExchanges);
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

  // const handleSetPeriod = (newPeriod: number) => {
  //   setPeriod(newPeriod);
  //   setToStorage('chartPeriod', newPeriod);
  // };

  const handleSetMode = (newMode: string) => {
    if (addressPay === '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee') {
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
            <div className={s.messageContent}>
              <p>Please, connect wallet</p>
              <Button
                variant="secondary"
                onClick={handleWalletConnectLogin}
                classNameCustom={s.containerTradingModalButton}
              >
                WalletConnect
              </Button>
              <Button
                variant="secondary"
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
      const { decimals }: any = tokenPay;
      const { netType, addresses } = config as { [index: string]: any };
      const { allowanceTarget, allowanceTargetLimit } = addresses[netType];
      const amountInWei = new BigNumber(amountPay)
        .multipliedBy(new BigNumber(10).pow(decimals))
        .toString(10);
      if (isAddressPayETH) {
        // propsApprove.amount = new BigNumber(amountPay)
        //   .multipliedBy(new BigNumber(10).pow(decimals))
        //   .toString(10);
        // const resultApprove = await web3Provider.approve(propsApprove);
        // console.log('handleApprove resultApprove:', resultApprove);
        // setWaiting(false);
        // setApproved(true);
      } else if (!isCustomAllowance) {
        const propsApprove: any = {
          amount: amountInWei,
          userAddress,
          allowanceTarget: '0x85e00a4D4dE1071e299D0657EEeb987Cf016eA5F',
          contractAbi: erc20Abi,
          contractAddress: addressPay,
        };
        const resultApprove = await web3Provider.approve(propsApprove);
        console.log('handleApprove resultApprove:', resultApprove);
        setWaiting(false);
      } else {
        // const totalSupply = await web3Provider.totalSupply({
        //   contractAddress,
        //   contractAbi: erc20Abi,
        // });
        // console.log('handleApprove totalSupply:', totalSupply);
        // propsApprove.amount = totalSupply;
        const propsApprove: any = {
          amount: amountInWei,
          userAddress,
          allowanceTarget: isModeLimit ? allowanceTargetLimit : allowanceTarget,
          contractAbi: erc20Abi,
          contractAddress: addressPay,
        };
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

  const handleSelectSymbolPay = async (address: string) => {
    console.log('handleSelectSymbolPay:', { address, addressReceive });
    // setAmountPay(0);
    // setAmountReceive(0);
    setAddressPay(address);
    setOpenDropdownPay(false);
    // const tokensSymbolsReceive = await getTokensSymbolsReceive();
    let newAddressReceive = addressReceive;
    if (address === newAddressReceive) {
      newAddressReceive = '';
      setAddressReceive('');
      setAmountReceive('0');
    }
    // if (!tokensSymbolsReceive.includes(addressReceive)) newAddressReceive = '';
    history.push(`/markets/${address}/${newAddressReceive}`);
  };

  const handleSelectSymbolReceive = (address: string) => {
    console.log('handleSelectSymbolReceive:', address);
    // setAmountPay('0');
    // setAmountReceive('0');
    setAddressReceive(address);
    setOpenDropdownReceive(false);
    history.push(`/markets/${addressPay}/${address}`);
  };

  const handleSelectSlippage = (value: string | number, slippageArr: slippageItem[]) => {
    setSlippageItems(slippageArr);
    setSlippage(+value);
    // setOpenSelect(false);
  };

  const handleSelectExpiration = (minutes: number) => {
    setExpiration(minutes);
    setOpenSelect(false);
  };

  const handleSelectAllExchanges = () => {
    setExchanges([...exchangesList]);
    setExchangesExcluded([]);
  };

  const handleDeselectAllExchanges = () => {
    setExchanges([]);
    setExchangesExcluded([...exchangesList]);
  };

  const handleResetSettings = () => {
    setSlippage(0);
    setExchanges([]);
    setExchangesExcluded([]);
    setGasPriceType('');
  };

  const switchPayAndReceive = () => {
    if (!addressReceive) return;
    setAddressPay(addressReceive);
    setAddressReceive(addressPay);
    setAmountPay(amountReceive);
    setAmountReceive(amountPay);
    history.push(`/markets/${addressReceive}/${addressPay}`);
    setRotateDivider(dividerRotate === 1 ? -1 : 1);
  };

  // const handleHoverChart = (value: string | null) => {
  //   setPriceChart(value);
  // };

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

  const handleSetMaxReceive = () => {
    setAmountReceive(balanceOfTokenReceive);
  };
  const handleSetMaxSell = () => {
    setAmountPay(balanceOfTokenPay);
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
    if (!amountPayDebounced) return;
    if (!amountReceiveDebounced) return;
    if (!inputChanged) return;
    if (inputChanged === 'pay') {
      if (isModeLimit) {
        getPricePayLimit();
      } else {
        getPricePay();
      }
    } else if (inputChanged === 'receive') {
      if (isModeLimit) {
        getPriceReceiveLimit();
      } else {
        getPriceReceive();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputChanged, amountPayDebounced, amountReceiveDebounced, isModeLimit]);

  React.useEffect(() => {
    if (!openSettings) return;
    getGasPrice();
  }, [getGasPrice, openSettings]);

  React.useEffect(() => {
    if (!addressPay) return;
    // getTokenPay();
    getPrices();
    if (!addressOne) return;
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
  }, [addressPay, addressReceive]);

  React.useEffect(() => {
    if (!tokens || tokens?.length === 0) return;
    if (!addressPay) return;
    getPriceMarket();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addressPay, addressReceive, tokens]);

  React.useEffect(() => {
    filterTokens();
    if (!isModeLimit) {
      getPricePay();
    }
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
    if (!addressPay && !addressReceive) return;
    if (!web3Provider && !userAddress) return;
    console.log('PageMarketsContent useEffect web3provider:', web3Provider);
    getBalanceOfTokensPay();
    getBalanceOfTokensReceive();
  }, [
    addressPay,
    addressReceive,
    userAddress,
    web3Provider,
    getBalanceOfTokensPay,
    getBalanceOfTokensReceive,
  ]);

  React.useEffect(() => {
    setAddressPay(addressOne);
    filterTokens();
    if (!addressTwo) return;
    setAddressReceive(addressTwo);
  }, [addressOne, addressTwo, filterTokens]);

  React.useEffect(() => {
    if (!addressReceive) return;
    if (isModeLimit) {
      getPricePayLimit();
    } else {
      getPricePay();
    }
    if (!addressPay) return;
    if (addressPay === '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee') return;
    getAllowance();
    getAllowanceForCustomSwap();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addressReceive, addressPay]);

  React.useEffect(() => {
    if (!addressReceive) return;
    if (!addressPay) return;
    if (!amountPayDebounced) return;
    if (!userAddress) return;
    if (waiting) return;
    if (addressPay === '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee') return;
    getAllowance();
    getAllowanceForCustomSwap();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addressReceive, addressPay, amountPayDebounced, userAddress, waiting, customAddress]);

  React.useEffect(() => {
    if (openQuotes) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [openQuotes]);

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

  // const SelectLabelSlippage = (
  //   <div
  //     ref={refSelectLabelSlippage}
  //     className={s.containerSettingsSelectLabel}
  //     role="button"
  //     tabIndex={0}
  //     onKeyDown={() => {}}
  //     onClick={handleOpenSelectSlippage}
  //   >
  //     <div>{slippage} %</div>
  //     <IconArrowDownWhite />
  //   </div>
  // );

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
      {/* <IconArrowDownWhite /> */}
      <img src={ArrowDown} alt="arrowDown" className={s.containerSettingsSelectLabelImage} />
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
      <div className={s.containerTradingCardSearchName}>{tokenPay?.symbol}</div>
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
      <div className={s.containerTradingCardSearchName}>{tokenReceive?.symbol}</div>
      <IconArrowDownWhite className={s.containerTradingCardSearchArrowDown} />
    </div>
  );

  return (
    <div className={s.container}>
      <div
        className={cns(s.containerWrapper, {
          [s.containerWrapperBg]: searchTokensResultPay.length,
        })}
      >
        {isModeMarket && openSettings ? (
          <section className={s.containerSettings}>
            <div className={s.containerSettingsBack}>
              <div onClick={handleOpenSettings} role="button" tabIndex={0} onKeyDown={() => {}}>
                <img src={ArrowBack} alt="back" />
              </div>
              <span>Advanced Settings</span>
            </div>
            <div className={s.containerSettingsInner}>
              <div className={s.containerSettingsSlippage}>
                <h2>Max Slippage</h2>
                <RadioSelect
                  items={slippageItems}
                  onChecked={handleSelectSlippage}
                  customPlaceholder="Custom"
                  percent
                  custom
                  customValue={slippage}
                />
                {/* <Select open={openSelectSlippage} label={SelectLabelSlippage}> */}
                {/* <div ref={refSelect} className={s.containerSettingsSelectItems}> */}
                {/* {new Array(21).fill(0).map((item, ii) => { */}
                {/*  return ( */}
                {/*    <div */}
                {/*      key={uuid()} */}
                {/*      role="button" */}
                {/*      tabIndex={0} */}
                {/*      onClick={() => handleSelectSlippage(ii)} */}
                {/*      onKeyDown={() => {}} */}
                {/*    > */}
                {/*      {ii} % */}
                {/*    </div> */}
                {/*  ); */}
                {/* })} */}
                {/* </div> */}
                {/* </Select> */}
              </div>
              <div className={s.containerSettingsGas}>
                <h2>Gas Price</h2>
                <div className={s.containerSettingsGasInner}>
                  <div className={s.radioContainer}>
                    <input
                      className={s.radioInput}
                      type="checkbox"
                      id="radioGasFast"
                      name="radioGas"
                      checked={isGasPriceTypeFast}
                      onChange={() => handleChangeGasPrice(gasPriceFromNet, 'fast')}
                    />
                    {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                    <label className={s.radioLabel} htmlFor="radioGasFast">
                      {/* <span className={s.radioPoint} /> */}
                      {RadioLabelFast}
                    </label>
                  </div>

                  <div className={s.radioContainer}>
                    <input
                      className={s.radioInput}
                      type="checkbox"
                      id="radioGasVeryFast"
                      name="radioGas"
                      checked={isGasPriceTypeVeryFast}
                      onChange={() => handleChangeGasPrice(gasPriceFromNet + 15, 'veryFast')}
                    />
                    {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                    <label className={s.radioLabel} htmlFor="radioGasVeryFast">
                      {/* <span className={s.radioPoint} /> */}
                      {RadioLabelVeryFast}
                    </label>
                  </div>

                  <div className={s.radioContainer}>
                    <input
                      className={s.radioInput}
                      type="checkbox"
                      id="radioGasCustom"
                      name="radioGas"
                      checked={isGasPriceTypeCustom}
                      onChange={() => handleChangeGasPrice(gasPriceCustom, 'custom')}
                    />
                    {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                    <label className={s.radioLabel} htmlFor="radioGasCustom">
                      {/* <span className={s.radioPoint} /> */}
                      {RadioLabelCustom}
                    </label>
                  </div>
                  {+userCurrentTier >= 1 ? (
                    <div className={s.containerSettingsGasCustomAddress}>
                      <div className={s.containerSettingsGasPremiumBadge}>
                        <IconDiamond />
                        Premium
                      </div>
                      <Checkbox
                        text="Send tokens to a custom address"
                        checkedDefault={isCustomAddress}
                        onChange={(e: boolean) => {
                          if (e) {
                            setCustomAddress('');
                          }
                          setIsCustomAddress(e);
                        }}
                      />
                    </div>
                  ) : (
                    ''
                  )}
                </div>
              </div>
              <div className={s.containerSettingsExchanges}>
                <div className={s.containerSettingsExchangesTop}>
                  <h2>Exchanges</h2>
                </div>
                <div className={s.containerSettingsExchangesInner}>
                  {exchangesList?.map((exchange) => {
                    const enabled = exchangesWithLiquidity
                      ? exchangesWithLiquidity.includes(exchange)
                      : false;
                    const checked = enabled && exchanges.includes(exchange);
                    return (
                      <Checkbox
                        key={uuid()}
                        text={exchange}
                        checkedDefault={checked}
                        disabled={!enabled}
                        onChange={(e: boolean) => handleChangeExchanges(e, exchange)}
                      />
                    );
                  })}
                </div>
              </div>
              <div className={s.containerSettingsButtons}>
                <Button
                  variant="normal"
                  classNameCustom={s.containerSettingsButtonsButton}
                  onClick={() => handleResetSettings()}
                >
                  Reset
                </Button>
                {exchanges.length === exchangesList.length ? (
                  <Button
                    variant="normal"
                    classNameCustom={s.containerSettingsButtonsButtonSelectAll}
                    onClick={() => handleDeselectAllExchanges()}
                  >
                    Deselect all
                  </Button>
                ) : (
                  <Button
                    variant="normal"
                    classNameCustom={s.containerSettingsButtonsButtonSelectAll}
                    onClick={() => handleSelectAllExchanges()}
                  >
                    Select all
                  </Button>
                )}
              </div>
            </div>
          </section>
        ) : (
          <>
            <Helmet>
              <title>
                {tokenPay?.symbol || '-'}/{tokenReceive?.symbol || '-'} | Bitgear
              </title>
              <meta
                name="description"
                content={`Find the best prices across exchange networks. Swap erc20 tokens: ${
                  tokenPay?.symbol || ''
                } (${tokenPay?.name || ''}) and ${tokenReceive?.symbol || ''} (${
                  tokenReceive?.name || ''
                })`}
              />
              <meta
                name="keywords"
                content={`exchange, blockchain, crypto, ${tokenPay?.symbol || ''}, ${
                  tokenPay?.name || ''
                }, ${tokenReceive?.symbol || ''}, ${tokenReceive?.name || ''}`}
              />
            </Helmet>

            <section className={s.containerTitle}>
              <div className={s.containerTitleFirst}>
                {isLoaded ? (
                  <>
                    <div
                      role="button"
                      tabIndex={0}
                      className={
                        isModeMarket ? s.containerTitleFirstItemActive : s.containerTitleFirstItem
                      }
                      onClick={() => {
                        handleSetMode('market');
                        setCustomAddress('');
                        setIsCustomAddress(false);
                      }}
                      onKeyDown={() => {}}
                    >
                      Market
                    </div>
                    <div
                      role="button"
                      tabIndex={0}
                      className={
                        isModeLimit ? s.containerTitleFirstItemActive : s.containerTitleFirstItem
                      }
                      onClick={() => {
                        handleSetMode('limit');
                        setCustomAddress('');
                        setIsCustomAddress(false);
                      }}
                      onKeyDown={() => {}}
                    >
                      Limit
                    </div>
                  </>
                ) : (
                  <SkeletonLoader width="100px" height="30px" borderRadius="4px" />
                )}
              </div>
              <div className={s.containerTitleSecond}>
                {isModeMarket && (
                  <>
                    {isLoaded ? (
                      <div
                        className={s.containerTitleSecondItem}
                        onClick={handleOpenSettings}
                        role="button"
                        tabIndex={0}
                        onKeyDown={() => {}}
                      >
                        <IconSettings className={s.containerTitleSecondItemImg} />
                      </div>
                    ) : (
                      <SkeletonLoader width="50px" height="50px" circle />
                    )}
                  </>
                )}
              </div>
            </section>

            {/* You Pay */}
            <section className={s.containerTrading}>
              <div className={s.containerTradingCard}>
                <div className={s.containerTradingCardLabel}>
                  <div>You Sell</div>
                  {addressPay && (
                    <div className={s.containerTradingCardBalance}>
                      {isLoaded ? (
                        <>
                          Balance:
                          <span>{(+prettyBalance(String(balanceOfTokenPay))).toFixed(5)}</span>
                          <button
                            type="button"
                            className={s.containerTradingCardBalanceBtn}
                            onClick={handleSetMaxSell}
                          >
                            MAX
                          </button>
                        </>
                      ) : (
                        <SkeletonLoader width="70px" height="25px" borderRadius="4px" />
                      )}
                    </div>
                  )}
                </div>
                <div className={s.containerTradingCardInner}>
                  <div className={s.containerTradingCardInnerName}>
                    {isLoaded ? (
                      <>{tokenPay?.name}</>
                    ) : (
                      <SkeletonLoader width="70px" height="30px" borderRadius="4px" />
                    )}
                  </div>
                  <div className={s.containerTradingCardInnerRow}>
                    <div className={s.containerTradingCardImage}>
                      {isLoaded ? (
                        <img
                          src={
                            tokenPay?.symbol.toLowerCase() === 'gear'
                              ? GearIcon
                              : tokenPay?.symbol.toLowerCase() === 'eth'
                              ? EthIcon
                              : tokenPay?.image
                          }
                          alt=""
                        />
                      ) : (
                        <SkeletonLoader
                          circle
                          width="40px"
                          height="40px"
                          style={{ marginRight: '20px' }}
                        />
                      )}
                    </div>
                    <div className={s.containerTradingCardContainer}>
                      {isLoaded ? (
                        <>
                          <div className={s.containerTradingCardContainerRow}>
                            <Dropdown label={DropdownLabelPay}>
                              <CSSTransition
                                unmountOnExit
                                mountOnEnter
                                in={openDropdownPay}
                                timeout={200}
                                classNames="transition"
                              >
                                <DropdownItems
                                  refContainer={refDropdownPay}
                                  open={openDropdownPay}
                                  label={<IconSearchWhite />}
                                  searchValue={searchValuePay}
                                  onChangeSearch={handleChangeSearchPay}
                                >
                                  {searchTokensResultPay.map((token: any) => {
                                    // if (it > 50) return null;
                                    const {
                                      name: tokenName,
                                      symbol,
                                      image = imageTokenPay,
                                      address,
                                      decimals,
                                    } = token;
                                    let newImage: any;
                                    if (symbol.toLowerCase() === 'gear') {
                                      newImage = GearIcon;
                                    } else if (symbol.toLowerCase() === 'eth') {
                                      newImage = EthIcon;
                                    } else {
                                      newImage = image;
                                    }

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
                                        onClick={() => handleSelectSymbolPay(address)}
                                        onKeyDown={() => {}}
                                      >
                                        <img
                                          src={newImage}
                                          alt=""
                                          className={s.containerTradingCardSearchItemImage}
                                        />
                                        <div className={s.containerTradingCardSearchItemFirst}>
                                          <div className={s.containerTradingCardSearchItemName}>
                                            {tokenName}
                                          </div>
                                          <div className={s.containerTradingCardSearchItemPrice}>
                                            {balance}
                                          </div>
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
                                </DropdownItems>
                              </CSSTransition>
                            </Dropdown>
                            {/* <div className={s.containerTradingCardSymbol}>{tokenPay?.symbol}</div> */}
                          </div>
                          <div
                            className={s.containerTradingCardInput}
                            onClick={() => sellInputRef.current.focus()}
                            role="button"
                            onKeyDown={() => {}}
                            tabIndex={0}
                          >
                            {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                            <label htmlFor="inputPay" />
                            <input
                              ref={sellInputRef}
                              id="inputPay"
                              type="number"
                              value={amountPay}
                              onChange={handleChangeAmountPay}
                              onFocus={handleFocusAmountPay}
                              onBlur={handleBlurAmountPay}
                            />
                          </div>

                          {messageYouPay && <div className={s.error}>{messageYouPay}</div>}
                        </>
                      ) : (
                        <SkeletonLoader width="150px" height="30px" borderRadius="4px" />
                      )}
                    </div>
                  </div>
                </div>
                {isModeLimit && (
                  <div className={s.containerTradingCardLimit}>
                    <div className={s.containerTradingCardLimitInner}>
                      <div className={s.containerTradingCardLimitLabel}>
                        <span>{tokenPay?.symbol} Price</span>
                      </div>
                      <div className={s.containerTradingCardLimitInput}>
                        {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                        {/* <label htmlFor="inputPay"> */}
                        {/*  <div>{tokenReceive?.symbol}</div> */}
                        {/* </label> */}
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
                    <div
                      className={s.containerTradingCardLimitInner}
                      onClick={handleOpenSelect}
                      role="button"
                      tabIndex={0}
                      onKeyDown={() => {}}
                    >
                      <div className={s.containerTradingCardLimitLabel}>
                        <div>Expires in</div>
                      </div>
                      <Select
                        className={s.containerSettingsWrapper}
                        open={openSelect}
                        label={SelectLabelExpiration}
                      >
                        <div ref={refSelect} className={s.containerSettingsSelectItems}>
                          <div
                            role="button"
                            tabIndex={0}
                            onKeyDown={() => {}}
                            onClick={() => handleSelectExpiration(10)}
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
                  title={!addressReceive ? 'Select receive currency to switch' : ''}
                  tabIndex={0}
                  className={cns(s.containerTradingDividerInner, {
                    [s.containerTradingDividerInnerRotate]: dividerRotate === -1,
                  })}
                  onClick={switchPayAndReceive}
                  onKeyDown={() => {}}
                >
                  <IconExchange />
                </div>
              </div>

              {/* You Receive */}
              <div className={cns(s.containerTradingCard, s.containerTradingCardLimitOpen)}>
                <div className={s.containerTradingCardLabel}>
                  <div>You Receive</div>
                  {addressReceive && (
                    <div className={s.containerTradingCardBalance}>
                      {isLoaded ? (
                        <>
                          Balance:
                          <span>{(+prettyBalance(String(balanceOfTokenReceive))).toFixed(5)}</span>
                          <button
                            type="button"
                            className={s.containerTradingCardBalanceBtn}
                            onClick={handleSetMaxReceive}
                          >
                            MAX
                          </button>
                        </>
                      ) : (
                        <SkeletonLoader width="70px" height="25px" borderRadius="4px" />
                      )}
                    </div>
                  )}
                </div>
                <div className={s.containerTradingCardInner}>
                  <div className={s.containerTradingCardInnerName}>
                    {isLoaded ? (
                      <>{tokenReceive?.name}</>
                    ) : (
                      <SkeletonLoader width="70px" height="30px" borderRadius="4px" />
                    )}
                  </div>
                  <div className={s.containerTradingCardInnerRow}>
                    <div className={s.containerTradingCardImage}>
                      {isLoaded ? (
                        <img
                          src={
                            tokenReceive?.symbol.toLowerCase() === 'gear'
                              ? GearIcon
                              : tokenReceive?.symbol.toLowerCase() === 'eth'
                              ? EthIcon
                              : tokenReceive?.image
                          }
                          alt=""
                        />
                      ) : (
                        <SkeletonLoader
                          circle
                          width="40px"
                          height="40px"
                          style={{ marginRight: '20px' }}
                        />
                      )}
                    </div>
                    <div className={s.containerTradingCardContainer}>
                      <>
                        {isLoaded ? (
                          <>
                            <div className={s.containerTradingCardContainerRow}>
                              <Dropdown label={DropdownLabelReceive}>
                                <CSSTransition
                                  unmountOnExit
                                  mountOnEnter
                                  in={openDropdownReceive}
                                  timeout={200}
                                  classNames="transition"
                                >
                                  <DropdownItems
                                    refContainer={refDropdownReceive}
                                    open={openDropdownReceive}
                                    label={<IconSearchWhite />}
                                    searchValue={searchValueReceive}
                                    onChangeSearch={handleChangeSearchReceive}
                                  >
                                    {searchTokensResultReceive.map((token: any) => {
                                      const {
                                        name: tokenName,
                                        symbol,
                                        image = imageTokenPay,
                                        address,
                                        decimals,
                                      } = token;
                                      let newImage: any;
                                      if (symbol.toLowerCase() === 'gear') {
                                        newImage = GearIcon;
                                      } else if (symbol.toLowerCase() === 'eth') {
                                        newImage = EthIcon;
                                      } else {
                                        newImage = image;
                                      }
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
                                          onClick={() => handleSelectSymbolReceive(address)}
                                          onKeyDown={() => {}}
                                        >
                                          <img
                                            src={newImage}
                                            alt=""
                                            className={s.containerTradingCardSearchItemImage}
                                          />
                                          <div className={s.containerTradingCardSearchItemFirst}>
                                            <div className={s.containerTradingCardSearchItemName}>
                                              {tokenName}
                                            </div>
                                            <div className={s.containerTradingCardSearchItemPrice}>
                                              {balance}
                                            </div>
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
                                  </DropdownItems>
                                </CSSTransition>
                              </Dropdown>
                              {/* <div className={s.containerTradingCardSymbol}>{tokenReceive?.symbol}</div> */}
                            </div>
                            <div
                              className={s.containerTradingCardInput}
                              onClick={() => receiveInputRef.current.focus()}
                              role="button"
                              onKeyDown={() => {}}
                              tabIndex={0}
                            >
                              {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                              <label htmlFor="inputPay" />
                              <input
                                ref={receiveInputRef}
                                id="inputPay"
                                type="number"
                                value={amountReceive}
                                onChange={handleChangeAmountReceive}
                                onFocus={handleFocusAmountReceive}
                                onBlur={handleBlurAmountReceive}
                              />
                            </div>
                          </>
                        ) : (
                          <SkeletonLoader width="150px" height="30px" borderRadius="4px" />
                        )}
                      </>
                    </div>
                  </div>
                </div>
              </div>
              {isCustomAddress && +userCurrentTier >= 1 ? (
                <div
                  className={s.CustomAddress}
                  onClick={() => customAddressRef.current.focus()}
                  role="button"
                  onKeyDown={() => {}}
                  tabIndex={0}
                >
                  <div className={s.CustomAddressTitle}>Custom address</div>
                  <div className={cns(s.containerTradingCardInner, s.CustomAddressInner)}>
                    <input
                      value={customAddress}
                      onChange={(e) => setCustomAddress(e.target.value)}
                      className={s.CustomAddressInput}
                      ref={customAddressRef}
                    />
                  </div>
                  <div className={s.CustomAddressSubtitle}>
                    Enter custom address to receive the tokens
                  </div>
                </div>
              ) : (
                ''
              )}
              <div className={s.containerTradingButton}>
                {userAddress ? (
                  (isAllowed && isCustomAllowance) || isAddressPayETH ? (
                    <Button
                      onClick={handleTrade}
                      disabled={
                        isTradeDisabled ||
                        waiting ||
                        (isCustomAddress && !customAddress) ||
                        !isValidCustomAddress
                      }
                      classNameCustom={s.containerTradingButtonBtn}
                    >
                      {waiting ? (
                        <>
                          Waiting
                          <span>.</span>
                          <span>.</span>
                          <span>.</span>
                        </>
                      ) : (
                        'Trade'
                      )}
                    </Button>
                  ) : (
                    <Button
                      onClick={handleApprove}
                      disabled={isTradeDisabled || waiting}
                      classNameCustom={s.containerTradingButtonBtn}
                    >
                      {waiting ? (
                        <>
                          Waiting
                          <span>.</span>
                          <span>.</span>
                          <span>.</span>
                        </>
                      ) : (
                        'Approve'
                      )}
                    </Button>
                  )
                ) : (
                  <Button onClick={handleConnect} classNameCustom={s.containerTradingButtonBtn}>
                    Connect wallet
                  </Button>
                )}
              </div>
            </section>

            <section className={s.containerCosts}>
              {isLoaded ? (
                <ul>
                  <li>
                    <span>1 {tokenPay?.symbol} cost</span>
                    <span>
                      {priceMarket
                        ? prettyPrice(priceMarket?.toString())
                        : tokenReceive?.symbol === 'USDC' && !addressReceive
                        ? marketHistory[0]?.quote?.USD?.close
                        : '-'}{' '}
                      {tokenReceive?.symbol}
                    </span>
                  </li>
                  <li>
                    <div
                      className={classPriceChange}
                      data-positive={isPriceChangePositive}
                      data-negative={isPriceChangeNegative}
                    >
                      {isPriceChangePositive && '+'}
                      {!!priceChange && `${priceChange}%`}{' '}
                      {!!priceChange && period === 1
                        ? 'past 24 hours'
                        : period === 7
                        ? 'past week'
                        : period === 30
                        ? 'past month'
                        : ''}
                    </div>
                  </li>
                  {/* <li> */}
                  {/*  <span>1 {tokenReceive?.symbol} cost</span> */}
                  {/*  <span> */}
                  {/*    {priceMarket */}
                  {/*      ? prettyPrice(priceMarket?.toString()) */}
                  {/*      : tokenPay?.symbol === 'USDC' && !addressPay */}
                  {/*      ? marketHistory[1]?.quote?.USD?.close */}
                  {/*      : '-'}{' '} */}
                  {/*    {tokenPay?.symbol} */}
                  {/*  </span> */}
                  {/* </li> */}
                  {/* <li> */}
                  {/*  <span>transaction cost</span> */}
                  {/*  <span>0.008</span> */}
                  {/* </li> */}
                </ul>
              ) : (
                <SkeletonLoader width="200px" height="40px" borderRadius="4px" />
              )}
            </section>

            {/* <section className={s.containerTokenInfo}> */}
            {/*  <a */}
            {/*    href={`https://etherscan.io/token/${tokenPay?.address}`} */}
            {/*    target="_blank" */}
            {/*    rel="noreferrer" */}
            {/*    className={s.tokenInfo} */}
            {/*  > */}
            {/*    <img src={tokenPay?.image} alt="" /> */}
            {/*    <div> */}
            {/*      <span>{tokenPay?.name}</span> */}
            {/*      <div> */}
            {/*        {tokenPay?.address */}
            {/*          ? `${tokenPay?.address.slice(0, 6)}...${tokenPay?.address.slice(-4)}` */}
            {/*          : ''} */}
            {/*      </div> */}
            {/*    </div> */}
            {/*    <div className={s.etherscan}> */}
            {/*      Etherscan */}
            {/*      <IconLink /> */}
            {/*    </div> */}
            {/*  </a> */}
            {/* </section> */}

            {/* <section className={s.containerChart}> */}
            {/*  <div className={s.chart}> */}
            {/*    {points.length > 0 && points[0] !== null && points[0] !== undefined ? ( */}
            {/*      <LineChart */}
            {/*        interactive */}
            {/*        data={points} */}
            {/*        dateTime={dateTime} */}
            {/*        chartHeight={140} */}
            {/*        padding={20} */}
            {/*        onHover={handleHoverChart} */}
            {/*      /> */}
            {/*    ) : ( */}
            {/*      <div className={s.chartWithoutData}> */}
            {/*        <div>No data yet</div> */}
            {/*      </div> */}
            {/*    )} */}
            {/*  </div> */}
            {/*  <div className={s.chartData}> */}
            {/*    <div className={s.chartDataFirst}> */}
            {/*      <div className={s.chartDataPriceName}>Current price</div> */}
            {/*      <div className={s.chartDataPrice}> */}
            {/*        {!addressTwo && '$'} */}
            {/*        {prettyPrice(priceChart || price.toString() || '-')} {tokenReceive?.symbol} */}
            {/*      </div> */}
            {/*    </div> */}
            {/*    <div className={s.chartDataSecond}> */}
            {/*      <div className={s.chartDataPeriod}> */}
            {/*        <div */}
            {/*          role="button" */}
            {/*          tabIndex={0} */}
            {/*          data-active={period === 1} */}
            {/*          onClick={() => handleSetPeriod(1)} */}
            {/*          onKeyDown={() => {}} */}
            {/*        > */}
            {/*          24H */}
            {/*        </div> */}
            {/*        <div */}
            {/*          role="button" */}
            {/*          tabIndex={0} */}
            {/*          data-active={period === 7} */}
            {/*          onClick={() => handleSetPeriod(7)} */}
            {/*          onKeyDown={() => {}} */}
            {/*        > */}
            {/*          1W */}
            {/*        </div> */}
            {/*        <div */}
            {/*          role="button" */}
            {/*          tabIndex={0} */}
            {/*          data-active={period === 30} */}
            {/*          onClick={() => handleSetPeriod(30)} */}
            {/*          onKeyDown={() => {}} */}
            {/*        > */}
            {/*          1M */}
            {/*        </div> */}
            {/*      </div> */}
            {/*      <div */}
            {/*        className={s.chartDataPriceChange} */}
            {/*        data-positive={isPriceChangePositive} */}
            {/*        data-negative={isPriceChangeNegative} */}
            {/*      > */}
            {/*        {priceChange || 0}% */}
            {/*      </div> */}
            {/*    </div> */}
            {/*  </div> */}
            {/* </section> */}
          </>
        )}
        {/*  </> */}
        {/* ) : ( */}
        {/*  <div className={s.containerWrapperSkeleton} /> */}
        {/* )} */}
      </div>
    </div>
  );
});
