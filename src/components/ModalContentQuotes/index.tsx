/* eslint-disable react/require-default-props */

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import BigNumber from 'bignumber.js/bignumber';

import { ReactComponent as IconArrowFilledRight } from '../../assets/icons/arrow-filled-right.svg';
import { ReactComponent as IconArrowLeft } from '../../assets/icons/arrow-left-blue.svg';
import GearIcon from '../../assets/icons/gear-token-icon.png';
import EthIcon from '../../assets/icons/icon-eth.svg';
import imageTokenPay from '../../assets/images/token.png';
import { useWalletConnectorContext } from '../../contexts/WalletConnect';
import ethToken from '../../data/ethToken';
import { modalActions } from '../../redux/actions';
import { Service0x } from '../../services/0x';
import { prettyPrice } from '../../utils/prettifiers';
import { sleep } from '../../utils/promises';
import Button from '../Button';

import s from './style.module.scss';

const Zx = new Service0x();

type TypeButtonProps = {
  // eslint-disable-next-line react/no-unused-prop-types
  open?: boolean;
  onClose?: () => void;
  // eslint-disable-next-line react/no-unused-prop-types
  onButtonClick?: () => void;
  tokenPay?: any;
  tokenReceive?: any;
  amountPay?: string;
  amountReceive?: string;
  tradeProps?: any;
  excludedSources: string;
  customAddress?: string;
};

type TypeModalParams = {
  open: boolean;
  noCloseButton?: boolean;
  fullPage?: boolean;
  text?: string | React.ReactElement;
  header?: string | React.ReactElement;
  delay?: number;
};

const ModalContentQuotes: React.FC<TypeButtonProps> = ({
  onClose = () => {},
  tokenPay,
  tokenReceive,
  amountPay = '',
  amountReceive = '',
  tradeProps = {},
  excludedSources,
  customAddress,
}) => {
  const { web3Provider } = useWalletConnectorContext();
  console.log(customAddress);

  const dispatch = useDispatch();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const toggleModal = (props: TypeModalParams) => dispatch(modalActions.toggleModal(props));

  const { address: userAddress, balances: userBalances } = useSelector(({ user }: any) => user);

  const [blockInterval, setBlockInterval] = React.useState<number>();
  const [timeToNextBlock, setTimeToNextBlock] = React.useState<number>();
  const [isNeedToRefresh, setIsNeedToRefresh] = React.useState<boolean>(false);
  const [fee, setFee] = React.useState<string>('0');
  const [quote, setQuote] = React.useState<any>();
  const [exchange, setExchange] = React.useState<string>('...');
  const [secondExchange, setSecondExchange] = React.useState<string>();
  const [priceDifference, setPriceDifference] = React.useState<string>();
  const [intervalId, setIntervalId] = React.useState<any>();
  const [amountReceiveNew, setAmountReceiveNew] = React.useState<string>();

  const {
    address: addressPay,
    symbol: symbolPay,
    name: namePay = 'Currency',
    image: imagePay = imageTokenPay,
    decimals: decimalsPay,
  } = tokenPay || {};
  const {
    address: addressReceive,
    symbol: symbolReceive,
    name: nameReceive = 'Currency',
    image: imageReceive = imageTokenPay,
    decimals: decimalsReceive,
  } = tokenReceive || {};

  const balancePay = userBalances[addressPay] || 0;
  const balanceReceive = userBalances[addressReceive] || 0;

  const newBalancePay = balancePay
    ? new BigNumber(balancePay).dividedBy(new BigNumber(10).pow(decimalsPay)).toString(10)
    : '0';

  const newBalanceReceive = balanceReceive
    ? new BigNumber(balanceReceive).dividedBy(new BigNumber(10).pow(decimalsReceive)).toString(10)
    : '0';

  // const isWide = useMedia({ minWidth: '767px' });

  const getPriceInUSDC = async (tokenAddress: string) => {
    try {
      const newTradeProps = {
        buyToken: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
        sellToken: tokenAddress,
        sellAmount: '1',
        decimals: 18,
      };
      const resultGetQuote = await Zx.getPrice(newTradeProps);
      console.log('ModalContentQuotes getPriceInUSDC:', resultGetQuote);
      let priceInUSDC = 0;
      if (resultGetQuote.status === 'SUCCESS') priceInUSDC = resultGetQuote.data.buyTokenToEthRate;
      return priceInUSDC;
    } catch (e) {
      console.error('ModalContentQuotes getPriceInUSDC:', e);
      return 0;
    }
  };

  const validateTradeErrors = React.useCallback(
    (error) => {
      const { code } = error.validationErrors[0];
      let text: string | React.ReactElement = (
        <div
          style={{
            height: '100%',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <div>Something gone wrong</div>
        </div>
      );
      if (code === 1001) {
        text = (
          <div
            style={{
              height: '100%',
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <div>Please, enter amount to pay or select token to receive</div>
          </div>
        );
      } else if (code === 1004) {
        text = (
          <div
            style={{
              height: '100%',
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <div>
              <p>Insufficicent liquidity.</p>
              <p>Please, decrease amount.</p>
            </div>
          </div>
        );
      }
      toggleModal({ open: true, text });
    },
    [toggleModal],
  );

  const getBlockInterval = async () => {
    try {
      // if (!web3Provider) return null;
      // const resultLastBlockInterval = await web3Provider.getLastBlockInverval();
      // console.log('ModalContentQuotes getBlockInterval:', resultLastBlockInterval);
      const newBlockInterval = 30000;
      // if (resultLastBlockInterval.status === 'SUCCESS') {
      //   const modulo = resultLastBlockInterval.data % 1000;
      //   newBlockInterval = resultLastBlockInterval.data - modulo;
      // }
      // if (newBlockInterval <= 15000) newBlockInterval = 15000;
      // console.log('ModalContentQuotes getBlockInterval:', newBlockInterval);
      setBlockInterval(newBlockInterval);
      return null;
    } catch (e) {
      console.error('ModalContentQuotes getBlockInterval:', e);
      return null;
    }
  };

  const chooseExchangesWithBestPrice = (exchanges: any) => {
    try {
      if (!exchanges) return null;
      const priceComparisonsWithoutExcluded = exchanges.filter((item: any) => {
        if (excludedSources?.toLowerCase().includes(item.name.toLowerCase())) return false;
        if (!item.price) return false;
        return true;
      });
      priceComparisonsWithoutExcluded.sort((a: any, b: any) => b.price - a.price);
      console.log(
        'ModalContentQuotes chooseExchangeWithBestPrice:',
        priceComparisonsWithoutExcluded,
      );
      return [...priceComparisonsWithoutExcluded];
    } catch (e) {
      console.error('ModalContentQuotes chooseExchangeWithBestPrice:', e);
      return null;
    }
  };

  const getQuote = async () => {
    try {
      setTimeToNextBlock(undefined);
      setIsNeedToRefresh(false);
      console.log('ModalContentQuotes getQuote tradeProps:', tradeProps);
      const resultGetQuote = await Zx.getQuote(tradeProps);
      console.log('ModalContentQuotes getQuote:', resultGetQuote);
      if (resultGetQuote.status === 'SUCCESS') {
        const newQuote = { ...resultGetQuote.data };
        const exchanges = chooseExchangesWithBestPrice(newQuote.priceComparisons);
        if (exchanges) {
          for (let i = 0; i < exchanges.length; i += 1) {
            const newTradeProps = { ...tradeProps };
            newTradeProps.excludedSources = '';
            newTradeProps.includedSources = exchanges[i].name;
            const resultGetQuoteNew = await Zx.getQuote(newTradeProps);
            console.log('ModalContentQuotes getQuote resultGetQuoteNew:', resultGetQuoteNew);
            if (resultGetQuoteNew.status === 'SUCCESS') {
              const newNewQuote = { ...resultGetQuoteNew.data };
              getBlockInterval();
              return setQuote(newNewQuote);
            }
            await sleep(100);
          }
        }
        setQuote(newQuote);
      } else {
        return validateTradeErrors(resultGetQuote.error);
      }
      getBlockInterval();
      return null;
    } catch (e) {
      console.error('ModalContentQuotes getQuote:', e);
      return null;
    }
  };

  const trade = async () => {
    try {
      if (!userAddress) return;
      const newQuote = { ...quote };
      newQuote.from = userAddress;
      const { estimatedGas } = newQuote;
      const newEstimatedGas = +new BigNumber(estimatedGas).multipliedBy(1.2).toFixed();
      newQuote.gas = String(newEstimatedGas);
      let resultSendTx: any = {};
      if (customAddress) {
        const tx = await web3Provider.createTxForCustomAddress(
          [
            newQuote.to,
            newQuote.data,
            customAddress,
            tradeProps.sellToken,
            newQuote.sellAmount,
            tradeProps.buyToken,
          ],
          userAddress,
        );
        resultSendTx = await web3Provider.sendTx(tx);
      } else {
        resultSendTx = await web3Provider.sendTx(newQuote);
      }
      console.log('trade resultSendTx:', resultSendTx);
      if (resultSendTx.status === 'SUCCESS') {
        toggleModal({ open: false });
      }
      return;
    } catch (e) {
      console.error('ModalContentQuotes getQuote:', e);
    }
  };

  const updateAmountReceive = async () => {
    try {
      if (!quote) return;
      const amountReceiveNewNew = new BigNumber(amountPay)
        .multipliedBy(new BigNumber(quote.guaranteedPrice))
        .toString(10);
      setAmountReceiveNew(amountReceiveNewNew);
    } catch (e) {
      console.error('ModalContentQuotes getFee:', e);
    }
  };

  const getFee = async () => {
    try {
      const { gasPrice, estimatedGas } = quote;
      const gasPriceNew = +new BigNumber(gasPrice).dividedBy(new BigNumber(10).pow(18));
      const feeNew = +new BigNumber(estimatedGas)
        .multipliedBy(gasPriceNew)
        .multipliedBy(1.2)
        .toFixed();
      const priceInUSDC = await getPriceInUSDC(ethToken.address);
      const feeNewInUSDC = feeNew * priceInUSDC;
      setFee(String(feeNewInUSDC));
    } catch (e) {
      console.error('ModalContentQuotes getFee:', e);
    }
  };

  const getExchange = async () => {
    try {
      const { sources } = quote;
      const source = sources.filter((item: any) => item.proportion !== '0')[0];
      setExchange(source?.name);
    } catch (e) {
      console.error('ModalContentQuotes getExchange:', e);
    }
  };

  const getExchangesPriceDifference = async () => {
    try {
      const { sources, priceComparisons = [] } = quote;
      const priceComparisonsWithoutExcluded = priceComparisons.filter(
        (item: any) => !excludedSources?.toLowerCase().includes(item.name.toLowerCase()),
      );
      const source = sources.filter((item: any) => item.proportion !== '0')[0];
      const priceComparisonIndex = priceComparisonsWithoutExcluded
        .map((item: any, ii: number) => {
          if (item.name === source.name) return ii;
          return undefined;
        })
        .filter((item: any) => item);
      const secondExchangeNew = priceComparisons[priceComparisonIndex[0] + 1];
      console.log(
        'ModalContentQuotes getExchangesPriceDifference:',
        priceComparisonIndex,
        secondExchangeNew,
      );
      setSecondExchange(secondExchangeNew?.name);
      const priceInUSDC = await getPriceInUSDC(ethToken.address);
      const priceDifferenceNew = secondExchangeNew?.savingsInEth * priceInUSDC;
      setPriceDifference(String(priceDifferenceNew));
    } catch (e) {
      console.error('ModalContentQuotes getExchangesPriceDifference:', e);
    }
  };

  const timer = () => {
    if (timeToNextBlock) {
      setTimeToNextBlock(timeToNextBlock - 1000);
    } else if (timeToNextBlock !== undefined && timeToNextBlock <= 0) {
      clearInterval(intervalId);
    } else {
      setTimeToNextBlock(blockInterval);
    }
  };

  const handleClose = () => {
    if (!onClose) return;
    onClose();
  };

  React.useEffect(() => {
    getQuote();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    if (!quote) return;
    getFee();
    getExchange();
    getExchangesPriceDifference();
    updateAmountReceive();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quote]);

  React.useEffect(() => {
    if (!quote) return;
    if (!blockInterval) return;
    const intervalIdNew = setInterval(timer, 1000);
    setIntervalId(intervalIdNew);
    // eslint-disable-next-line consistent-return
    return () => clearInterval(intervalIdNew);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeToNextBlock, blockInterval, quote]);

  React.useEffect(() => {
    if (timeToNextBlock !== undefined && timeToNextBlock <= 0) {
      setIsNeedToRefresh(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeToNextBlock]);

  return (
    <div className={s.container}>
      {/* {!isWide && ( */}
      {/*  <div className={s.header}> */}
      {/*    <img className={s.logo} src={Logo} alt="" /> */}
      {/*    <IconClose className={s.buttonClose} /> */}
      {/*  </div> */}
      {/* )} */}

      <div
        className={s.buttonBack}
        role="button"
        tabIndex={0}
        onClick={handleClose}
        onKeyDown={() => {}}
      >
        <IconArrowLeft />
        Back
      </div>

      {timeToNextBlock === undefined || timeToNextBlock === 0 ? (
        <div className={s.title}>Quote</div>
      ) : (
        <div className={s.title}>
          Quote expires in<span>{timeToNextBlock ? timeToNextBlock / 1000 : '...'}</span>seconds
        </div>
      )}

      <div className={s.label}>You pay</div>
      <section className={s.section}>
        <img
          src={
            symbolPay.toLowerCase() === 'gear'
              ? GearIcon
              : symbolPay.toLowerCase() === 'eth'
              ? EthIcon
              : imagePay
          }
          alt=""
        />
        <div>
          <div className={s.tokenName}>{namePay}</div>
          <div className={s.tokenPrice}>{amountPay}</div>
          <div className={s.tokenBalance}>
            Current balance ({symbolPay})<span>{prettyPrice(newBalancePay)}</span>
          </div>
        </div>
      </section>

      <div className={s.label}>You receive</div>
      <section className={s.section}>
        <img
          src={
            symbolReceive.toLowerCase() === 'gear'
              ? GearIcon
              : symbolReceive.toLowerCase() === 'eth'
              ? EthIcon
              : imageReceive
          }
          alt=""
        />
        <div>
          <div className={s.tokenName}>{nameReceive}</div>
          <div className={s.tokenPrice}>{amountReceiveNew || amountReceive}</div>
          <div className={s.tokenBalance}>
            Current balance ({symbolReceive})<span>{prettyPrice(newBalanceReceive)}</span>
          </div>
        </div>
      </section>

      {exchange && (
        <div className={s.messageBestPrice}>
          <div>
            We got the best price for you from <span>{exchange}</span>
          </div>
        </div>
      )}

      <div className={s.containerButton}>
        {isNeedToRefresh ? (
          <Button primary onClick={getQuote} classNameCustom={s.containerButtonSubmit}>
            Quote expired. Refresh.
          </Button>
        ) : (
          <Button primary onClick={trade} classNameCustom={s.containerButtonSubmit}>
            Place order
          </Button>
        )}
      </div>

      <div className={s.labelSecondary}>Rate</div>
      <div className={s.containerRate}>
        <ul>
          <li>
            <div>{amountPay}</div>
            <strong>{symbolPay}</strong>
          </li>
          <li>
            <IconArrowFilledRight />
          </li>
          <li>
            <div>{amountReceiveNew || amountReceive}</div>
            <strong>{symbolReceive}</strong>
          </li>
        </ul>
      </div>

      <div className={s.divider} />
      <div className={s.labelSecondary}>Estimated fee</div>
      <div className={s.containerFee}>
        <div>Ethereum network</div>
        <span>${prettyPrice(fee)}</span>
      </div>

      {tradeProps?.slippagePercentage && (
        <>
          <div className={s.divider} />
          <div className={s.containerFee} style={{ margin: '15px 0 0 0' }}>
            <div>Max slippage</div>
            <span>{tradeProps?.slippagePercentage * 100}%</span>
          </div>
        </>
      )}

      {secondExchange && priceDifference !== '0' && (
        <>
          <div className={s.divider} />
          <div className={s.labelSecondary}>You save</div>
          <div className={s.containerYouSave}>
            <div>Compared to {secondExchange}</div>
            <span>${prettyPrice(priceDifference || '0')}</span>
          </div>
        </>
      )}
    </div>
  );
};

export default React.memo(ModalContentQuotes);
