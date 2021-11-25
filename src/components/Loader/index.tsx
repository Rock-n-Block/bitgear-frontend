import React from 'react';
import cn from 'classnames';

import styles from './style.module.scss';

interface ILoaderProps {
  className?: string;
  color?: string;
}

export const Loader: React.FC<ILoaderProps> = ({ className, color }) => {
  return (
    <div
      className={cn(styles.loader, className, {
        [styles.loaderWhite]: color === 'white',
      })}
    />
  );
};
