import React from 'react';
import cns from 'classnames';

import s from './style.module.scss';

type InputProps = {
  type?: string;
  disabled?: boolean;
  error?: boolean;
  label?: any;
  labelInner?: any;
  placeholder?: string;
  styleCustom?: any;
  big?: boolean;
  medium?: boolean;
  focused?: boolean;
  value?: string;
  onChange?: (e: string) => void;
  onFocus?: (e: React.FormEvent<HTMLInputElement>) => void;
};

export const Input: React.FC<InputProps> = ({
  type = 'text',
  disabled = false,
  error = false,
  label = null,
  labelInner = null,
  placeholder = '',
  styleCustom = {},
  big = false,
  medium = false,
  focused = false,
  value = '',
  onChange = () => {},
  onFocus = () => {},
}) => {
  const [newPlaceholder, setNewPlaceholder] = React.useState<string>(placeholder);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const handleFocus = (e: React.FormEvent<HTMLInputElement>) => {
    setNewPlaceholder('');
    onFocus(e);
  };

  const handleBlur = () => setNewPlaceholder(placeholder);

  const classNameError = error && s.error;
  const classNameInput = big
    ? cns(s.inputBig, classNameError)
    : medium
    ? cns(s.inputMedium, classNameError)
    : cns(s.input, classNameError);

  return (
    <div className={cns(s.containerInput, classNameError)}>
      {label && (
        <label htmlFor="input" className={cns(big ? s.inputLabelBig : s.inputLabel)}>
          {label}
        </label>
      )}
      <div className={s.containerInputInner}>
        <div className={s.containerInputInput}>
          <input
            id="input"
            disabled={disabled}
            ref={(r) => r && focused && r.focus()}
            className={classNameInput}
            style={{ ...styleCustom }}
            type={type}
            placeholder={newPlaceholder}
            value={value}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
        </div>
        {labelInner && <div className={s.inputLabelInner}>{labelInner}</div>}
      </div>
    </div>
  );
};

export default Input;
