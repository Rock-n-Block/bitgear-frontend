/* eslint-disable react/require-default-props */

import { ChangeEvent, FC, ReactElement, useCallback } from 'react';
import cns from 'classnames';
import { v1 as uuid } from 'uuid';

import s from './style.module.scss';

type TypeInputProps = {
  autoFocus?: boolean;
  value: string;
  placeholder?: string;
  label?: ReactElement | string;
  type?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  inline?: boolean;
  className?: string;
};

export const Input: FC<TypeInputProps> = ({
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

  const refInput = useCallback(
    (e) => {
      if (e && autoFocus) {
        setTimeout(() => e.focus(), 10);
      }
    },
    [autoFocus],
  );

  return (
    <div className={cns(s.container, className)}>
      {label && (
        <label className={s.label} htmlFor={id}>
          {label}
        </label>
      )}
      <input
        ref={refInput}
        className={cns(s.input, inline && s.inline)}
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </div>
  );
};
