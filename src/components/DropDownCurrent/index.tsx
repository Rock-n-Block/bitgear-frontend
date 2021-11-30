import React from 'react';
import OutsideClickHandler from 'react-outside-click-handler';
import cn from 'classnames';

import { ReactComponent as IconArrowDown } from '../../assets/icons/arrow-dropdown.svg';

import styles from './style.module.scss';

interface IDropdownProps {
  className?: string;
  value: string;
  setValue: (str: string) => void;
  options: Array<any>;
  isWithImage?: boolean;
  isWritable?: boolean;
  name?: string;
  suffix?: string;
}

export const DropDownCurrent: React.FC<IDropdownProps> = ({
  className,
  value,
  setValue,
  options,
  isWithImage,
  isWritable,
  name,
  suffix = '',
}) => {
  const [visible, setVisible] = React.useState(false);
  const [arrowRotate, setArrowRotate] = React.useState(1);

  const handleClose = () => {
    setVisible(false);
    setArrowRotate(1);
  };

  const handleOpen = () => {
    setVisible(true);
    setArrowRotate(-1);
  };

  const handleClick = (str: string) => {
    setValue(str);
    handleClose();
  };

  return (
    <OutsideClickHandler onOutsideClick={handleClose}>
      <div className={cn(styles.dropdown, className, { [styles.active]: visible })} id={name}>
        <div
          onKeyDown={() => {}}
          tabIndex={0}
          role="button"
          className={styles.head}
          onClick={() => {
            if (visible) {
              handleClose();
            } else {
              handleOpen();
            }
          }}
        >
          {isWritable ? (
            <input value={value} className={styles.input} />
          ) : (
            <div className={styles.selection}>{value}</div>
          )}
          <IconArrowDown
            className={cn(styles.arrow, { [styles.arrowRotate]: arrowRotate === -1 })}
          />
        </div>
        {!isWithImage ? (
          <div className={styles.body}>
            {typeof options[0] === 'string'
              ? options.map((option: string) => (
                  <div
                    onKeyDown={() => {}}
                    tabIndex={0}
                    role="button"
                    className={cn(
                      styles.option,
                      {
                        [styles.selectioned]: option === value,
                      },
                      option === value ? 'selected' : '',
                    )}
                    onClick={() => handleClick(option)}
                    key={`dropdown_option_${option}`}
                  >
                    {option}
                    {suffix}
                  </div>
                ))
              : options.map((option) => (
                  <div
                    onKeyDown={() => {}}
                    tabIndex={0}
                    role="button"
                    className={cn(
                      styles.option,
                      {
                        [styles.selectioned]: option.text === value,
                      },
                      [styles[option.color]],
                      option.text === value ? 'text-gradient' : '',
                    )}
                    onClick={() => handleClick(option.text)}
                    key={`dropdown_option_${option.text}`}
                  >
                    {option.icon ? <img src={option.icon} alt="icon" /> : ''}
                    {option.text}
                  </div>
                ))}
          </div>
        ) : (
          <div className={styles.body}>
            {options.map((option: any) => (
              <div
                onKeyDown={() => {}}
                tabIndex={0}
                role="button"
                className={cn(
                  styles.option,
                  {
                    [styles.selectioned]: option.symbol === value,
                  },
                  option.symbol === value ? 'text-gradient' : '',
                )}
                onClick={() => handleClick(option.symbol.toUpperCase())}
                key={`dropdown_option_${option.symbol}`}
              >
                <img alt="" className={styles.image} src={option.image} />
              </div>
            ))}
          </div>
        )}
      </div>
    </OutsideClickHandler>
  );
};
