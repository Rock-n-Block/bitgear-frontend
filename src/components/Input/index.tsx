import React from 'react';
import cns from 'classnames';

import s from './style.module.scss';

type InputProps = {
  type?: string;
  disabled?: boolean;
  open?: boolean;
  error?: boolean;
  label?: React.ReactElement;
  labelInner?: React.ReactElement;
  dropdown?: React.ReactElement;
  placeholder?: string;
  styleCustom?: any;
  focused?: boolean;
  classContainer?: string;
  classInput?: string;
  value?: string;
  onChange?: (e: string) => void;
  onFocus?: (e: React.FormEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FormEvent<HTMLInputElement>) => void;
};

export const Input: React.FC<InputProps> = ({
  type = 'text',
  disabled = false,
  error = false,
  label = undefined,
  labelInner = undefined,
  dropdown = undefined,
  placeholder = '',
  styleCustom = {},
  focused = false,
  classContainer = undefined,
  classInput = undefined,
  value = '',
  onChange = () => {},
  onFocus = () => {},
  onBlur = () => {},
}) => {
  const [newPlaceholder, setNewPlaceholder] = React.useState<string>(placeholder);
  const [newOpen, setNewOpen] = React.useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const handleFocus = (e: React.FormEvent<HTMLInputElement>) => {
    setNewPlaceholder('');
    onFocus(e);
  };

  const handleBlur = (e: React.FormEvent<HTMLInputElement>) => {
    setNewPlaceholder(placeholder);
    onBlur(e);
  };

  const classNameError = error && s.error;
  const classNameContainer = newOpen ? s.containerInputOpen : s.containerInput;

  React.useEffect(() => {
    console.log('Input useEffect:', value);
    if (value?.length > 0) {
      setNewOpen(true);
    } else {
      setNewOpen(false);
    }
  }, [value]);

  return (
    <div className={cns(classNameContainer, classNameError, classContainer)}>
      {label && (
        <label htmlFor="input" className={cns(s.label)}>
          {label}
        </label>
      )}
      <div className={s.containerInputInner}>
        <div className={s.containerInputInput}>
          <input
            id="input"
            disabled={disabled}
            ref={(r) => r && focused && r.focus()}
            className={cns(s.input, classNameError, classInput)}
            style={{ ...styleCustom }}
            type={type}
            placeholder={newPlaceholder}
            value={value}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
        </div>
        {labelInner && <div className={s.labelInner}>{labelInner}</div>}
        {newOpen && dropdown && <div className={s.dropdown}>{dropdown}</div>}
      </div>
    </div>
  );
};

export default Input;
