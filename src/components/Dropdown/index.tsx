import React from 'react';
import cns from 'classnames';

import s from './style.module.scss';

type TypeDropdownProps = {
  open: boolean;
  left?: boolean;
  right?: boolean;
  label?: React.ReactElement;
  children?: Element | React.ReactChildren | React.ReactElement | React.ReactChild;
  handleClick?: () => void;
  classNameDropdown?: any;
};

export const Dropdown: React.FC<TypeDropdownProps> = React.memo(
  ({
    label = <div>Dropdown</div>,
    children = [],
    open = false,
    left = false,
    right = false,
    classNameDropdown,
  }) => {
    const classNameSide = right ? s.right : left ? s.left : null;

    return (
      <div className={s.container}>
        {label}
        <div className={cns(s.dropdown, !open && s.hidden, classNameSide, classNameDropdown)}>
          <div className={s.dropdownInner}>{children}</div>
        </div>
      </div>
    );
  },
);
