import React from 'react';

import s from './style.module.scss';

type TypeDropdownProps = {
  label?: React.ReactElement;
  children?: Element | React.ReactChildren | React.ReactElement | React.ReactChild;
  handleClick?: () => void;
};

export const Dropdown: React.FC<TypeDropdownProps> = React.memo(
  ({ label = <div>Dropdown</div>, children = [] }) => {
    return (
      <div className={s.container}>
        {label}
        <div className={s.dropdown}>
          <div className={s.dropdownInner}>{children}</div>
        </div>
      </div>
    );
  },
);
