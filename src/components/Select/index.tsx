import React from 'react';
import cns from 'classnames';

import s from './style.module.scss';

type TypeDropdownProps = {
  open: boolean;
  label?: React.ReactElement;
  children?: Element | React.ReactChildren | React.ReactElement | React.ReactChild;
  handleClick?: () => void;
};

export const Select: React.FC<TypeDropdownProps> = React.memo(
  ({ label = <div>Select</div>, children = [], open = false }) => {
    return (
      <div className={s.container}>
        {label}
        <div className={cns(s.dropdown, !open && s.hidden)}>
          <div className={s.dropdownInner}>{children}</div>
        </div>
      </div>
    );
  },
);
