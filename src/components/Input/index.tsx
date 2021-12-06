/* eslint-disable react/require-default-props */

import React from 'react';
import cns from 'classnames';
import { v1 as uuid } from 'uuid';

import s from './style.module.scss';

type TypeInputProps = {
  autoFocus?: boolean;
  value: string;
  placeholder?: string;
  label?: React.ReactElement | string;
  type?: string;
  onChange?: (e: string) => void;
  inline?: boolean;
  className?: string;
};

export const Input: React.FC<TypeInputProps> = ({
  autoFocus = false,
  value = '',
  placeholder = '',
  type = 'text',
  label,
  onChange = () => {},
  inline = false,
  className,
}) => {
  const id = uuid();

  const refInput = React.useCallback(
    (e) => {
      if (e && autoFocus) {
        setTimeout(() => e.focus(), 10);
      }
    },
    [autoFocus],
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className={cns(s.container, className)}>
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      {label && (
        <label className={s.label} htmlFor={id}>
          {label}
        </label>
      )}
      {/* eslint-disable */}
      <input
        ref={refInput}
        className={cns(s.input, inline && s.inline)}
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
      />
      {/* eslint-enable */}
    </div>
  );
};
