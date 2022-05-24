/* eslint-disable react/require-default-props */

import React from 'react';
import cn from 'classnames';

import s from './style.module.scss';

type TypeButtonProps = {
  children?: React.ReactElement | string;
  onClick?: () => void;
  variant?: 'normal' | 'primary' | 'secondary' | 'blue' | 'outlined' | 'iconButton' | 'text';
  uppercase?: boolean;
  // eslint-disable-next-line react/no-unused-prop-types
  icon?: any;
  classNameCustom?: any;
  disabled?: boolean;
};

const Button: React.FC<TypeButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  uppercase = true,
  icon,
  classNameCustom,
  disabled = false,
}) => {
  const classNameDisabled = disabled ? s.disabled : null;

  const handleClick = () => {
    if (disabled) return;
    if (!onClick) return;
    onClick();
  };

  return (
    <button
      type="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={() => {}}
      className={cn(
        s.button,
        classNameCustom,
        s[variant],
        { [s.uppercase]: uppercase },
        classNameDisabled,
      )}
      disabled={disabled}
    >
      {children}
      {icon && <img className={icon && variant !== 'iconButton' ? s.icon : ''} src={icon} alt="" />}
    </button>
  );
};

export default React.memo(Button);
