import React from 'react';
import { v1 as uuid } from 'uuid';

import s from './style.module.scss';

type TypeButtonProps = {
  checkedDefault?: boolean;
  name?: string;
  text?: React.ReactElement | string;
  label?: React.ReactElement;
  left?: boolean;
  right?: boolean;
  onChange?: (e: boolean) => void;
};

export const Radio: React.FC<TypeButtonProps> = React.memo(
  ({ name, checkedDefault, left = false, right = true, label, text, onChange = () => {} }) => {
    const id = uuid();

    const [checked, setChecked] = React.useState<boolean>(false);

    const handleChange = (e: boolean) => {
      setChecked(e);
      onChange(e);
    };

    return (
      <div className={s.container}>
        {left &&
          (label || (
            <label className={s.label} htmlFor={id}>
              <span className={s.point} />
              {text}
            </label>
          ))}
        <input
          id={id}
          name={name}
          type="radio"
          className={s.radio}
          checked={checkedDefault || checked}
          onChange={(e) => handleChange(e.target.checked)}
        />
        {!left &&
          right &&
          (label || (
            <label className={s.label} htmlFor={id}>
              <span className={s.point} />
              {text}
            </label>
          ))}
      </div>
    );
  },
);
