import React from 'react';
import cn from 'classnames';

import { slippageItem } from '../../pages/PageMarkets/PageMarketsContent';

import s from './style.module.scss';

interface IRadioSelect {
  items: slippageItem[];
  onChecked: (value: string | number, arr: slippageItem[]) => void;
  percent?: boolean;
  custom?: boolean;
  wrapperClassName?: string;
  className?: string;
  customPlaceholder?: string;
}

export const RadioSelect: React.FC<IRadioSelect> = ({
  items,
  percent = false,
  custom = false,
  onChecked,
  wrapperClassName,
  className,
  customPlaceholder,
}) => {
  const [value, setValue] = React.useState<number | ''>('');

  const handleChangeCheck = (index: number) => {
    let newSlippage;
    if (index === -1) {
      newSlippage = items.map((item) => {
        return {
          ...item,
          checked: false,
        };
      });
      onChecked(0, newSlippage);
    } else {
      newSlippage = items.map((item, i) => {
        return {
          ...item,
          checked: index === i,
        };
      });
      onChecked(items[index].text, newSlippage);
    }
  };

  const handleChangeCustom = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(+event.target.value);
    onChecked(+event.target.value, items);
  };

  return (
    <div className={cn(s.radioSelect, wrapperClassName)}>
      {items.map((item: any, index: number) => {
        return (
          <button
            type="button"
            key={item.text}
            className={cn(s.radioSelectItem, className, {
              [s.radioSelectItemChecked]: item.checked,
            })}
            onClick={() => handleChangeCheck(index)}
          >
            <span>
              {item.text}
              {percent ? '%' : ''}
            </span>
          </button>
        );
      })}
      {custom ? (
        <>
          <input
            type="text"
            className={cn({ [s.activeCustom]: value !== 0 && value !== '' })}
            value={value}
            placeholder={customPlaceholder || ''}
            onChange={handleChangeCustom}
            onClick={() => handleChangeCheck(-1)}
          />
        </>
      ) : null}
    </div>
  );
};
