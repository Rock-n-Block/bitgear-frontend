import React from 'react';
import cns from 'classnames';

import s from './style.module.scss';

type TypeButtonProps = {
  children?: React.ReactElement | string;
  onClick?: () => void;
  primary?: boolean;
  secondary?: boolean;
  normal?: boolean;
  classNameCustom?: any;
};

const Button: React.FC<TypeButtonProps> = ({
  children,
  onClick,
  primary = false,
  secondary = false,
  normal = false,
  classNameCustom,
}) => {
  const className = primary ? s.primary : secondary ? s.secondary : normal ? s.normal : null;

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={() => {}}
      className={cns(s.button, classNameCustom, className)}
    >
      {children}
    </div>
  );
};

export default React.memo(Button);
