import React from 'react';
import BigNumber from 'bignumber.js/bignumber';
import { useMedia } from 'use-media';

import { ReactComponent as IconArrowFilledRight } from '../../assets/icons/arrow-filled-right.svg';
import { ReactComponent as IconArrowLeft } from '../../assets/icons/arrow-left-blue.svg';
import { ReactComponent as IconClose } from '../../assets/icons/close.svg';
import Logo from '../../assets/images/logo/HQ2.png';
import imageTokenPay from '../../assets/images/token.png';
import { prettyPrice } from '../../utils/prettifiers';
import Button from '../Button';

import s from './style.module.scss';

type TypeButtonProps = {
  onClose?: () => void;
  tokenPay?: any;
  tokenReceive?: any;
  amountPay?: string;
  amountReceive?: string;
  balances?: any;
};

const ModalContentQuotes: React.FC<TypeButtonProps> = ({
  onClose = () => {},
  tokenPay,
  tokenReceive,
  amountPay = '',
  amountReceive = '',
  balances = {},
}) => {
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
  console.log('ModalContentQuotes balances:', balances);

  const balancePay = balances[addressPay] || 0;
  const balanceReceive = balances[addressReceive] || 0;

  const newBalancePay = balancePay
    ? new BigNumber(balancePay).dividedBy(new BigNumber(10).pow(decimalsPay)).toString(10)
    : '0';

  const newBalanceReceive = balanceReceive
    ? new BigNumber(balanceReceive).dividedBy(new BigNumber(10).pow(decimalsReceive)).toString(10)
    : '0';

  const isWide = useMedia({ minWidth: '767px' });

  const handleClose = () => {
    if (!onClose) return;
    onClose();
  };

  return (
    <div className={s.container}>
      {!isWide && (
        <div className={s.header}>
          <img className={s.logo} src={Logo} alt="" />
          <IconClose className={s.buttonClose} />
        </div>
      )}

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

      <div className={s.title}>
        Quote expires in<span>18</span>seconds
      </div>

      <div className={s.label}>You pay</div>
      <section className={s.section}>
        <img src={imagePay} alt="" />
        <div>
          <div className={s.tokenName}>{namePay}</div>
          <div className={s.tokenPrice}>0.00</div>
          <div className={s.tokenBalance}>
            Current balance ({symbolPay})<span>{prettyPrice(newBalancePay)}</span>
          </div>
        </div>
      </section>

      <div className={s.label}>You receive</div>
      <section className={s.section}>
        <img src={imageReceive} alt="" />
        <div>
          <div className={s.tokenName}>{nameReceive}</div>
          <div className={s.tokenPrice}>0.00</div>
          <div className={s.tokenBalance}>
            Current balance ({symbolReceive})<span>{prettyPrice(newBalanceReceive)}</span>
          </div>
        </div>
      </section>

      <div className={s.messageBestPrice}>
        <div>
          We got the best price for you from <span>Exchange</span>
        </div>
      </div>

      <div className={s.containerButton}>
        <Button primary>Place order</Button>
      </div>

      <div className={s.labelSecondary}>Rate</div>
      <div className={s.containerRate}>
        <div>
          {amountPay} {symbolPay}
        </div>
        <div>
          <IconArrowFilledRight />
        </div>
        <div>
          {amountReceive} {symbolReceive}
        </div>
      </div>
      <div className={s.divider} />

      <div className={s.labelSecondary}>Estimated fee</div>
      <div className={s.containerFee}>
        <div>Ethereum network</div>
        <span>$13.31</span>
      </div>
      <div className={s.divider} />

      <div className={s.labelSecondary}>You save</div>
      <div className={s.containerYouSave}>
        <div>Compared to Uniswap</div>
        <span>$44</span>
      </div>
    </div>
  );
};

export default React.memo(ModalContentQuotes);
