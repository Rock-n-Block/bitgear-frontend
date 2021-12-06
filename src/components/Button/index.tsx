/* eslint-disable react/require-default-props */

import React from 'react';
import cns from 'classnames';

/* eslint-disable react/require-default-props */
import s from './style.module.scss';

type TypeButtonProps = {
  children?: React.ReactElement | string;
  onClick?: () => void;
  primary?: boolean;
  secondary?: boolean;
  normal?: boolean;
  classNameCustom?: any;
  disabled?: boolean;
};

const Button: React.FC<TypeButtonProps> = ({
  children,
  onClick,
  primary = false,
  secondary = false,
  normal = false,
  classNameCustom,
  disabled = false,
}) => {
  const className = primary ? s.primary : secondary ? s.secondary : normal ? s.normal : null;
  const classNameDisabled = disabled ? s.disabled : null;

  const handleClick = () => {
    if (disabled) return;
    if (!onClick) return;
    onClick();
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={() => {}}
      className={cns(s.button, classNameCustom, className, classNameDisabled)}
    >
      {children}
    </div>
  );
};

export default React.memo(Button);
