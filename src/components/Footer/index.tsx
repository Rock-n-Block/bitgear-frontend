import React from 'react';

import { ReactComponent as IconMedium } from '../../assets/icons/social/medium.svg';
import { ReactComponent as IconTelegram } from '../../assets/icons/social/telegram.svg';
import { ReactComponent as IconTwitter } from '../../assets/icons/social/twitter.svg';
import config from '../../config';

import s from './style.module.scss';

export const Footer: React.FC = () => {
  return (
    <footer className={s.footer}>
      <div className={s.footerLogoGroup}>
        <a href={config.links.medium} target="_blank" rel="noreferrer noopener">
          <IconMedium className={s.footerLogo} />
        </a>
        <a href={config.links.twitter} target="_blank" rel="noreferrer noopener">
          <IconTwitter className={s.footerLogo} />
        </a>
        <a href={config.links.telegram} target="_blank" rel="noreferrer noopener">
          <IconTelegram className={s.footerLogo} />
        </a>
      </div>
      <div className={s.footerCopyright}>© 2022 Bitgear. All Rights Reserved</div>
    </footer>
  );
};

export default Footer;
