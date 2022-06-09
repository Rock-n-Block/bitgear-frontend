import React from 'react';

import { ReactComponent as IconMedium } from '../../assets/icons/social/new/medium.svg';
import { ReactComponent as IconTelegram } from '../../assets/icons/social/new/telegram.svg';
import { ReactComponent as IconTwitter } from '../../assets/icons/social/new/twitter.svg';
import config from '../../config';

import s from './style.module.scss';

export const Footer: React.FC = () => {
  return (
    <footer className={s.footer}>
      <hr className={s.footerDivider} />
      <div className={s.footerSocialsGroup}>
        <a
          className={s.footerIconButton}
          href={config.links.twitter}
          target="_blank"
          rel="noreferrer noopener"
        >
          <IconTwitter className={s.footerLogo} />
        </a>
        <a
          className={s.footerIconButton}
          href={config.links.telegram}
          target="_blank"
          rel="noreferrer noopener"
        >
          <IconTelegram className={s.footerLogo} />
        </a>
        <a
          className={s.footerIconButton}
          href={config.links.medium}
          target="_blank"
          rel="noreferrer noopener"
        >
          <IconMedium className={s.footerLogo} />
        </a>
      </div>
      <div className={s.footerCopyright}>
        <a className={s.footerCopyrightContactLink} href={`mailto:${config.links.contact}`}>
          {config.links.contact}
        </a>
        <div>© 2022 Bitgear. All Rights Reserved</div>
      </div>
    </footer>
  );
};

export default Footer;
