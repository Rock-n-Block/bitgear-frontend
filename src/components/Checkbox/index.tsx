import React from 'react';
import { v1 as uuid } from 'uuid';

import s from './style.module.scss';

type TypeButtonProps = {
  checkedDefault?: boolean;
  disabled?: boolean;
  text?: string;
  label?: React.ReactElement;
  left?: boolean;
  right?: boolean;
  onChange?: (e: boolean) => void;
};

export const Checkbox: React.FC<TypeButtonProps> = React.memo(
  ({
    checkedDefault,
    disabled = false,
    left = false,
    right = true,
    label,
    text,
    onChange = () => {},
  }) => {
    const id = uuid();

    const [checked, setChecked] = React.useState<boolean>(false);

    const handleChange = (e: boolean) => {
      setChecked(e);
      onChange(e);
    };

    return (
      <div className={s.container}>
        {left && (label || <label htmlFor={id}>{text}</label>)}
        <input
          id={id}
          type="checkbox"
          disabled={disabled}
          className={s.checkbox}
          checked={checkedDefault || checked}
          onChange={(e) => handleChange(e.target.checked)}
        />
        {!left && right && (label || <label htmlFor={id}>{text}</label>)}
      </div>
    );
  },
);
