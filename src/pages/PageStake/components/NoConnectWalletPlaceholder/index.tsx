import { VFC } from 'react';
import { Link, useLocation } from 'react-router-dom';

import styles from './NoConnectWalletPlaceholder.module.scss';

export const NoConnectWalletPlaceholder: VFC = () => {
  const { pathname } = useLocation();
  return (
    <Link className={styles.connectWalletBtn} to={`/login?back=${pathname}`}>
      Connect Wallet
    </Link>
  );
};
