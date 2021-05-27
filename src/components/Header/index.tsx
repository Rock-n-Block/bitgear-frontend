import React from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory, useLocation } from 'react-router-dom';
import BigNumber from 'bignumber.js/bignumber';
import useMedia from 'use-media';
import { v1 as uuid } from 'uuid';

import { ReactComponent as IconCopy } from '../../assets/icons/copy-icon.svg';
import { ReactComponent as IconExit } from '../../assets/icons/exit.svg';
import { ReactComponent as IconMedium } from '../../assets/icons/social/medium.svg';
import { ReactComponent as IconTelegram } from '../../assets/icons/social/telegram.svg';
import { ReactComponent as IconTwitter } from '../../assets/icons/social/twitter.svg';
import IconLogo from '../../assets/images/logo/HQ2.png';
import { ReactComponent as IconMetamask } from '../../assets/images/logo/metamask-logo.svg';
import { ReactComponent as IconWalletConnect } from '../../assets/images/logo/wallet-connect-logo.svg';
import imageTokenPay from '../../assets/images/token.png';
import config from '../../config';
import { useWalletConnectorContext } from '../../contexts/WalletConnect';
import { userActions } from '../../redux/actions';
import { getFromStorage, setToStorage } from '../../utils/localStorage';
import { prettyAmount } from '../../utils/prettifiers';
import { Dropdown } from '../Dropdown';

import s from './style.module.scss';

type TypeItemTokenBalanceProps = {
  symbol: string;
  balance: string;
};

export const ItemTokenBalance: React.FC<TypeItemTokenBalanceProps> = ({ symbol, balance }) => {
  const history = useHistory();
  const { tokens } = useSelector(({ zx }: any) => zx);

  const getTokenBySymbol = React.useCallback(
    (symbolInner: string) => {
      const tokenEmpty = { name: 'Currency', symbol: null, image: imageTokenPay };
      try {
        const token = tokens.filter((item: any) => item.symbol === symbolInner);
        // console.log('Header getTokenBySymbol:', token);
        return token.length > 0 ? token[0] : tokenEmpty;
      } catch (e) {
        console.error('Header getTokenBySymbol:', e);
        return tokenEmpty;
      }
    },
    [tokens],
  );

  const handleClick = () => {
    history.push(`/markets/${symbol}`);
  };

  const { image } = getTokenBySymbol(symbol);
  const balancePrettified = prettyAmount((+balance).toFixed(9));

  return (
    <Link
      className={s.headerDropdownItemToken}
      to={`/markets/${symbol}`}
      // role="button"
      // tabIndex={0}
      // onKeyDown={() => {}}
      onClick={handleClick}
    >
      <div className={s.headerDropdownItemTokenImageWrap}>
        <img src={image} alt="" className={s.headerDropdownItemTokenImage} />
      </div>
      <div>
        <div className={s.headerDropdownItemTokenSymbol}>{symbol}:</div>
        <div className={s.headerDropdownItemTokenBalance}>{balancePrettified}</div>
      </div>
    </Link>
  );
};

export const ListOfTokenBalances: React.FC = () => {
  const { balances: userBalances } = useSelector(({ user }: any) => user);
  const { tokens, tokensByAddress } = useSelector(({ zx }: any) => zx);
  const { loadingBalances } = useSelector(({ status }: any) => status);

  const [userBalancesFiltered, setUserBalancesFiltered] = React.useState<any>([]);

  const isLoadingBalancesDone = loadingBalances === 'done';
  const isLoadingBalancesError = loadingBalances === 'error';

  const filterAndSortUserBalances = React.useCallback(() => {
    try {
      console.log('Header filterAndSortUserBalances:', userBalances);
      const newBalances = Object.entries(userBalances).map((item) => {
        const [address, balance]: any = item;
        const { symbol, decimals } = tokensByAddress[address];
        const newBalance = new BigNumber(balance).dividedBy(new BigNumber(10).pow(decimals));
        return { symbol, balance: newBalance };
      });
      console.log('Header filterAndSortUserBalances:', newBalances);
      setUserBalancesFiltered(newBalances);
    } catch (e) {
      console.error(e);
    }
  }, [userBalances, tokensByAddress]);

  React.useEffect(() => {
    if (!tokens || tokens?.length === 0) return;
    if (!tokensByAddress || tokensByAddress?.length === 0) return;
    filterAndSortUserBalances();
  }, [tokens, tokensByAddress, filterAndSortUserBalances]);

  if (userBalancesFiltered.length === 0) {
    return (
      <div className={s.headerDropdownItemTokens}>
        {isLoadingBalancesDone
          ? 'You do not have any tokens'
          : isLoadingBalancesError
          ? 'Not loaded'
          : 'Loading...'}
      </div>
    );
  }
  return (
    <div className={s.headerDropdownItemTokensList}>
      {userBalancesFiltered.map((item: any) => {
        const { symbol, balance } = item;
        if (+balance === 0) return null;
        return <ItemTokenBalance key={uuid()} symbol={symbol} balance={balance} />;
      })}
    </div>
  );
};

export const Header: React.FC = () => {
  const { pathname } = useLocation();

  const { web3Provider } = useWalletConnectorContext();

  const dispatch = useDispatch();
  const { address: userAddress, balance: userBalance } = useSelector(({ user }: any) => user);
  const setUserData = (props: any) => dispatch(userActions.setUserData(props));

  const isMobile = useMedia({ maxWidth: 1000 });

  const refDropdownLabel = React.useRef<HTMLDivElement>(null);
  const refDropdown = React.useRef<HTMLDivElement>(null);

  const [openMenu, setOpenMenu] = React.useState<boolean>(false);
  const [openDropdown, setOpenDropdown] = React.useState<boolean>(false);
  const [isAddressCopied, setIsAddressCopied] = React.useState<boolean>(false);

  const walletType = getFromStorage('walletType');
  const isMetamask = walletType === 'metamask';
  const isWalletConnect = walletType === 'walletConnect';

  const handleOpenDropdown = () => {
    setOpenDropdown(!openDropdown);
  };

  const handleDisconnect = () => {
    setToStorage('walletType', '');
    if (walletType === 'walletConnect' && web3Provider) web3Provider.disconnect();
    setUserData({ address: undefined, balance: 0 });
  };

  const DropdownLabel = (
    <div
      ref={refDropdownLabel}
      className={s.headerItemBtn}
      onClick={handleOpenDropdown}
      role="button"
      tabIndex={0}
      onKeyDown={() => {}}
    >
      {isMetamask && <IconMetamask className={s.headerWalletLogo} />}
      {isWalletConnect && <IconWalletConnect className={s.headerWalletLogo} />}
      {`${userAddress?.slice(0, 12)}...`}
    </div>
  );

  const handleCopyAddress = () => {
    setIsAddressCopied(true);
    setTimeout(() => {
      setIsAddressCopied(false);
    }, 2000);
  };

  const handleClickOutsideDropdown = (e: any) => {
    if (
      !refDropdown?.current?.contains(e.target) &&
      !refDropdownLabel?.current?.contains(e.target)
    ) {
      setOpenDropdown(false);
    }
  };

  React.useEffect(() => {
    document.addEventListener('click', (e) => {
      handleClickOutsideDropdown(e);
    });
    return () => {
      document.removeEventListener('click', (e) => {
        handleClickOutsideDropdown(e);
      });
    };
  }, []);

  return (
    <header className={s.header}>
      <div className={s.headerContainer}>
        <div className={s.headerLeftGroup}>
          <Link to="/">
            <img src={IconLogo} alt="" className={s.headerLogo} />
          </Link>
        </div>

        {isMobile && (
          <div
            role="button"
            className={s.headerMenuBtnWrapper}
            tabIndex={0}
            onClick={() => setOpenMenu(!openMenu)}
            onKeyDown={() => setOpenMenu(!openMenu)}
          >
            {!openMenu ? 'Menu' : 'Close'}
          </div>
        )}

        <nav
          className={
            isMobile
              ? openMenu
                ? s.headerMenuMobileOpen
                : s.headerMenuMobileClosed
              : s.headerRightGroup
          }
        >
          <div className={s.headerItem}>
            <Link to="/" onClick={() => setOpenMenu(false)}>
              Home
            </Link>
          </div>

          <div className={s.headerItem}>
            <Link to="/explore" onClick={() => setOpenMenu(false)}>
              Explore
            </Link>
          </div>

          <div className={s.headerItem}>
            <a href="https://farm.bitgear.io" target="_blank" rel="noreferrer">
              Farm
            </a>
          </div>

          {userAddress ? (
            <Dropdown
              right
              open={openDropdown}
              label={DropdownLabel}
              classNameDropdown={s.headerDropdown}
              classNameDropdownInner={s.headerDropdownInner}
            >
              <div ref={refDropdown}>
                <div className={s.headerDropdownItem}>
                  <span>
                    {userBalance?.toString().slice(0, 8)} ETH ({`${userAddress.slice(0, 8)}...`})
                  </span>
                  <Link to="/account" onClick={() => setOpenMenu(false)}>
                    Your account
                  </Link>
                </div>

                <div className={s.headerDropdownItemLabel}>Your balance</div>
                <ListOfTokenBalances />

                <CopyToClipboard text={userAddress} onCopy={handleCopyAddress}>
                  <div
                    role="button"
                    tabIndex={0}
                    onKeyDown={() => {}}
                    className={s.headerDropdownItem}
                    onClick={() => {}}
                  >
                    <IconCopy />
                    {isAddressCopied ? 'Copied!' : 'Copy address'}
                  </div>
                </CopyToClipboard>
                <div
                  role="button"
                  tabIndex={0}
                  onKeyDown={() => {}}
                  className={s.headerDropdownItem}
                  onClick={handleDisconnect}
                >
                  <IconExit />
                  Disconnect
                </div>
              </div>
            </Dropdown>
          ) : (
            <div className={s.headerItemBtn}>
              <Link to={`/login?back=${pathname}`} onClick={() => setOpenMenu(false)}>
                Connect Wallet
              </Link>
            </div>
          )}

          {isMobile && (
            <div className={s.headerMenuFooter}>
              <div className={s.headerMenuFooterLogoGroup}>
                <a href={config.links.medium} target="_blank" rel="noreferrer noopener">
                  <IconMedium className={s.headerMenuFooterLogo} />
                </a>
                <a href={config.links.twitter} target="_blank" rel="noreferrer noopener">
                  <IconTwitter className={s.headerMenuFooterLogo} />
                </a>
                <a href={config.links.telegram} target="_blank" rel="noreferrer noopener">
                  <IconTelegram className={s.headerMenuFooterLogo} />
                </a>
              </div>
              <div className={s.headerMenuFooterCopyright}>© 2021 Bitgear. All Rights Reserved</div>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};
