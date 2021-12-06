/* eslint-disable react/require-default-props */

import React from 'react';
import cns from 'classnames';

import s from './style.module.scss';

type InputWithDropdownProps = {
  type?: string;
  disabled?: boolean;
  // eslint-disable-next-line react/no-unused-prop-types
  open?: boolean;
  error?: boolean;
  label?: React.ReactElement;
  labelInner?: React.ReactElement;
  dropdown?: React.ReactElement;
  placeholder?: string;
  styleCustom?: any;
  classContainer?: string;
  classInput?: string;
  value?: string;
  onChange?: (e: string) => void;
  onFocus?: (e: React.FormEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FormEvent<HTMLInputElement>) => void;
};

export const InputWithDropdown: React.FC<InputWithDropdownProps> = ({
  type = 'text',
  disabled = false,
  error = false,
  label = undefined,
  labelInner = undefined,
  dropdown = undefined,
  placeholder = '',
  styleCustom = {},
  classContainer = undefined,
  classInput = undefined,
  value = '',
  onChange = () => {},
  onFocus = () => {},
  onBlur = () => {},
}) => {
  const [newPlaceholder, setNewPlaceholder] = React.useState<string>(placeholder);
  const [newOpen, setNewOpen] = React.useState<boolean>(false);

  const refContainer = React.useRef<HTMLDivElement>(null);
  const refLabel = React.useRef<HTMLLabelElement>(null);
  const refInput = React.useRef<HTMLInputElement>(null);
  const refInputInner = React.useRef<HTMLDivElement>(null);
  const refLabelInner = React.useRef<HTMLDivElement>(null);
  const refDropdown = React.useRef<HTMLDivElement>(null);

  const isValueLengthOk = value?.length > 1;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const handleFocus = (e: React.FormEvent<HTMLInputElement>) => {
    if (!isValueLengthOk) return;
    setNewOpen(true);
    setNewPlaceholder('');
    onFocus(e);
  };

  const handleBlur = (e: React.FormEvent<HTMLInputElement>) => {
    setNewPlaceholder(placeholder);
    onBlur(e);
  };

  const handleClickOutside = (e: any) => {
    if (
      !refContainer?.current?.contains(e.target) &&
      !refLabel?.current?.contains(e.target) &&
      !refInput?.current?.contains(e.target) &&
      !refInputInner?.current?.contains(e.target) &&
      !refLabelInner?.current?.contains(e.target) &&
      !refDropdown?.current?.contains(e.target)
    ) {
      setNewOpen(false);
    }
  };

  const classNameError = error && s.error;
  const classNameContainer = newOpen ? s.containerInputOpen : s.containerInput;

  React.useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  React.useEffect(() => {
    // console.log('Input useEffect:', value);
    if (isValueLengthOk) {
      setNewOpen(true);
    } else {
      setNewOpen(false);
    }
  }, [value, isValueLengthOk]);

  return (
    <div ref={refContainer} className={cns(classNameContainer, classNameError, classContainer)}>
      {label && (
        <label ref={refLabel} htmlFor="input" className={cns(s.label)}>
          {label}
        </label>
      )}
      <div ref={refInputInner} className={s.containerInputInner}>
        <div className={s.containerInputInput}>
          <input
            ref={refInput}
            id="input"
            disabled={disabled}
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
        {labelInner && (
          <div ref={refLabelInner} className={s.labelInner}>
            {labelInner}
          </div>
        )}
        {newOpen && dropdown && (
          <div ref={refDropdown} className={s.dropdown}>
            <div className={s.dropdownInner}>{dropdown}</div>
          </div>
        )}
      </div>
    </div>
  );
};
