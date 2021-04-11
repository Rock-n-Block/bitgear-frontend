import React from 'react';
import cns from 'classnames';
import { v1 as uuid } from 'uuid';

import s from './style.module.scss';

type TypeInputProps = {
  value: string;
  placeholder?: string;
  label?: React.ReactElement;
  type?: string;
  onChange?: (e: string) => void;
  inline?: boolean;
};

export const Input: React.FC<TypeInputProps> = ({
  value = '',
  placeholder = '',
  type = 'text',
  label,
  onChange = () => {},
  inline = false,
}) => {
  const id = uuid();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className={s.container}>
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      {label && (
        <label className={s.label} htmlFor={id}>
          {label}
        </label>
      )}
      <input
        className={cns(s.input, inline && s.inline)}
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
      />
    </div>
  );
};
