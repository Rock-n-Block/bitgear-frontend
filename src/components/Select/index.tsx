import React from 'react';
import cns from 'classnames';

import { ReactComponent as IconArrowDownWhite } from '../../assets/icons/arrow-down-white.svg';

import s from './style.module.scss';

type TypeDropdownProps = {
  open: boolean;
  label?: React.ReactElement;
  children?: Element | React.ReactChildren | React.ReactElement | React.ReactChild;
  handleClick?: () => void;
  className?: string;
};

export const Select: React.FC<TypeDropdownProps> = React.memo(
  ({ label, children = [], open = false, className }) => {
    return (
      <div className={cns(s.container, className)}>
        {label || (
          <div className={s.label} role="button" tabIndex={0} onKeyDown={() => {}}>
            <div>Select</div>
            <IconArrowDownWhite />
          </div>
        )}
        <div className={cns(s.dropdown, !open && s.hidden)}>
          <div className={s.dropdownInner}>{children}</div>
        </div>
      </div>
    );
  },
);
