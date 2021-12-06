/* eslint-disable react/require-default-props */

import React from 'react';
import cn from 'classnames';

import { slippageItem } from '../../pages/PageMarkets/PageMarketsContent';

import s from './style.module.scss';

interface IRadioSelect {
  items: slippageItem[];
  onChecked: (value: string | number, arr: slippageItem[]) => void;
  percent?: boolean;
  custom?: boolean;
  customValue?: number;
  wrapperClassName?: string;
  className?: string;
  customPlaceholder?: string;
}

export const RadioSelect: React.FC<IRadioSelect> = ({
  items,
  percent = false,
  custom = false,
  customValue,
  onChecked,
  wrapperClassName,
  className,
  customPlaceholder,
}) => {
  const [value, setValue] = React.useState<any>(customValue || '');

  const handleChangeCheck = (index: number) => {
    const newSlippage = items.map((item, i) => ({
      ...item,
      checked: index === -1 ? false : index === i,
    }));
    onChecked(index === -1 ? 0 : items[index].text, newSlippage);
    setValue('');
  };

  const handleChangeCustomValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    // eslint-disable-next-line @typescript-eslint/no-shadow
    const { value } = e.target;
    if (value === null || !/[^\d.]/g.test(value)) {
      setValue(value);
      onChecked(+value, items);
    }
  };

  React.useEffect(() => {
    let isAnyChecked = false;
    items.forEach((item) => {
      if (item.checked) {
        isAnyChecked = true;
      }
    });
    if (isAnyChecked) {
      setValue('');
    }
  }, [items]);

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
            onChange={handleChangeCustomValue}
            onClick={() => handleChangeCheck(-1)}
          />
        </>
      ) : null}
    </div>
  );
};
