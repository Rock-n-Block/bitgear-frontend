import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import useMedia from 'use-media';

import { ReactComponent as IconMedium } from '../../assets/icons/social/medium.svg';
import { ReactComponent as IconTelegram } from '../../assets/icons/social/telegram.svg';
import { ReactComponent as IconTwitter } from '../../assets/icons/social/twitter.svg';
import IconLogo from '../../assets/images/logo/HQ2.png';
import config from '../../config';
import { userActions } from '../../redux/actions';
import { useWalletConnectorContext } from '../../services/WalletConnect';
import { Dropdown } from '../Dropdown';

import s from './style.module.scss';

export const Header: React.FC = () => {
  const { web3Provider } = useWalletConnectorContext();

  const dispatch = useDispatch();
  const { address: userAddress, balance: userBalance } = useSelector(({ user }: any) => user);
  const setUserData = (props: any) => dispatch(userActions.setUserData(props));

  const isMobile = useMedia({ maxWidth: 1000 });

  const refDropdownLabel = React.useRef<HTMLDivElement>(null);
  const refDropdown = React.useRef<HTMLDivElement>(null);

  const [openMenu, setOpenMenu] = React.useState<boolean>(false);
  const [openDropdown, setOpenDropdown] = React.useState<boolean>(false);

  const handleOpenDropdown = () => {
    setOpenDropdown(!openDropdown);
  };

  const handleDisconnect = () => {
    web3Provider.disconnect();
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
      {`${userAddress?.slice(0, 12)}...`}
    </div>
  );

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
            >
              <div ref={refDropdown} className={s.headerDropdownInner}>
                <div className={s.headerDropdownItem}>
                  <Link to="/account" onClick={() => setOpenMenu(false)}>
                    Your account ({`${userAddress.slice(0, 8)}...`})
                  </Link>
                </div>
                <div className={s.headerDropdownItem}>
                  <Link to="/account" onClick={() => setOpenMenu(false)}>
                    Balance: {userBalance} ETH
                  </Link>
                </div>
                <div
                  role="button"
                  tabIndex={0}
                  onKeyDown={() => {}}
                  className={s.headerDropdownItem}
                  onClick={handleDisconnect}
                >
                  Disconnect
                </div>
              </div>
            </Dropdown>
          ) : (
            <div className={s.headerItemBtn}>
              <Link to="/login" onClick={() => setOpenMenu(false)}>
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
