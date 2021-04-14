import React from 'react';

import ArrowDownIcon from '../../assets/icons/arrow-down-icon.svg';
import ArrowUpIcon from '../../assets/icons/arrow-up-icon.svg';
import CopyIcon from '../../assets/icons/copy-icon.svg';
import EthGlassIcon from '../../assets/images/logo/eth-glass-icon.svg';

import s from './style.module.scss';

export const PageAccount: React.FC = () => {
  return (
    <div className={s.container}>
      <section className={s.containerTitle}>
        <div className={s.containerTitleBlock}>
          <h1>Your Account</h1>
          <span>0x9C3f...404d</span>
        </div>
        <div className={s.accountMenu}>
          <span className={s.accountMenuActive}>Balance</span>
          <span className={s.accountMenuItem}>Trade History</span>
        </div>
      </section>

      <section className={s.accountFunds}>
        <div className={s.accountFundsItem}>
          <div className={s.accountFundsCard}>
            <h3>Your balance:</h3>
            <span>0 ETH</span>
            <img src={EthGlassIcon} alt="ehereum logo" />
          </div>
          <div className={s.accountFundsDeposit}>
            <h3>Deposit more funds</h3>
            <div className={s.accountFundsDepositCopy}>
              <span>0x9C3fD81263...337317c0404d</span>
              <img src={CopyIcon} alt="copy icon" />
            </div>
          </div>
        </div>
      </section>

      <section className={s.accountTrade}>
        <h2>Order History</h2>

        <div className={s.accountTradeHistory}>
          <table className={s.accountTradeTable}>
            <thead>
              <th className={s.accountTradeTableActive}>Head</th>
              <th>Head</th>
              <th>Head</th>
              <th>Head</th>
            </thead>
            <tbody>
              <tr>
                <td>Aave</td>
                <td>AAVE</td>
                <td>$394.36</td>
                <td>
                  <img src={ArrowUpIcon} alt="arrow up" /> 1.89%
                </td>
              </tr>
              <tr>
                <td>Aave</td>
                <td>AAVE</td>
                <td>$394.36</td>
                <td>
                  <img src={ArrowUpIcon} alt="arrow up" /> 1.89%
                </td>
              </tr>
              <tr>
                <td>Aave</td>
                <td>AAVE</td>
                <td>$394.36</td>
                <td className={s.accountTradeTableDown}>
                  <img src={ArrowDownIcon} alt="arrow down" />
                  1.89%
                </td>
              </tr>
              <tr>
                <td>Aave</td>
                <td>AAVE</td>
                <td>$394.36</td>
                <td>
                  <img src={ArrowUpIcon} alt="arrow up" /> 1.89%
                </td>
              </tr>
              <tr>
                <td>Aave</td>
                <td>AAVE</td>
                <td>$394.36</td>
                <td>
                  <img src={ArrowUpIcon} alt="arrow up" /> 1.89%
                </td>
              </tr>
              <tr>
                <td>Aave</td>
                <td>AAVE</td>
                <td>$394.36</td>
                <td>
                  <img src={ArrowUpIcon} alt="arrow up" /> 1.89%
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
