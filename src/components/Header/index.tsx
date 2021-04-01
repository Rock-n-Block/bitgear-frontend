import React from 'react';
import { Link } from 'react-router-dom';
import useMedia from 'use-media';

import IconLogo from '../../assets/images/logo/HQ2.png';
import config from '../../config';

import s from './style.module.scss';

export const Header: React.FC = () => {
  const isMobile = useMedia({ maxWidth: 1000 });

  const [openMenu, setOpenMenu] = React.useState<boolean>(false);

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
            <Link to="/">Home</Link>
          </div>

          <div className={s.headerItem}>
            <Link to="/explore">Explore</Link>
          </div>

          <div className={s.headerItem}>
            <Link to="/farm">Farm</Link>
          </div>

          {isMobile && (
            <div className={s.headerMenuFooter}>
              <div className={s.headerMenuFooterLogoGroup}>
                {/* <a href={config.links.telegram} target="_blank" rel="noreferrer noopener"> */}
                {/*  <IconTelegram className="header-menu-footer-logo" /> */}
                {/* </a> */}
                {/* <a href={`mailto:${config.links.email}`} target="_blank" rel="noreferrer noopener"> */}
                {/*  <IconEmail className="header-menu-footer-logo" /> */}
                {/* </a> */}
                {/* <a href={config.links.twitter} target="_blank" rel="noreferrer noopener"> */}
                {/*  <IconTwitter className="header-menu-footer-logo" /> */}
                {/* </a> */}
                {/* <a href={config.links.github} target="_blank" rel="noreferrer noopener"> */}
                {/*  <IconGithub className="header-menu-footer-logo" /> */}
                {/* </a> */}
                {/* <a href={config.links.medium} target="_blank" rel="noreferrer noopener"> */}
                {/*  <IconMedium className="header-menu-footer-logo" /> */}
                {/* </a> */}
                {/* <a href={config.links.reddit} target="_blank" rel="noreferrer noopener"> */}
                {/*  <IconReddit className="header-menu-footer-logo" /> */}
                {/* </a> */}
                {/* <a href={config.links.discord} target="_blank" rel="noreferrer noopener"> */}
                {/*  <IconDiscord className="header-menu-footer-logo" /> */}
                {/* </a> */}
              </div>
              <div className={s.headerMenuFooterCopyright}>
                © Copyright Bitgear 2021,{' '}
                <a
                  className="link"
                  href={config.links.policy}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  Privacy policy
                </a>
              </div>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};
