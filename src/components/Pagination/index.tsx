import React from 'react';
import { useMedia } from 'use-media';

import s from './style.module.scss';

type TypePaginationProps = {
  pageCountProp?: number;
  pageCountMobileProp?: number;
  data?: any[];
  emitChanges?: (T: any) => any;
  sortFlagChangedProp: boolean;
};

export const Pagination: React.FC<TypePaginationProps> = React.memo(
  ({
    pageCountProp = 1,
    pageCountMobileProp = 1,
    data = [],
    emitChanges = () => 1,
    sortFlagChangedProp = false,
  }) => {
    const [activeButton, setActiveButton] = React.useState<number>(1);
    const [numbers, setNumbers] = React.useState<any>([] as any[]);
    const [pageCount, setPageCount] = React.useState<number>(1);
    const isWide = useMedia({ minWidth: '767px' });

    const changePage = (pageNumber: number) => {
      setActiveButton(pageNumber);
      if (!isWide) {
        emitChanges(data.slice((pageNumber - 1) * 5, pageNumber * 5));
      } else {
        emitChanges(data.slice((pageNumber - 1) * 12, pageNumber * 12));
      }
    };

    const firstPaginationRender = React.useCallback(() => {
      let numbersArray: Array<number | string> = Array.from(Array(pageCount + 1).keys());
      numbersArray = numbersArray.slice(1);
      if (numbersArray.length > 7) {
        numbersArray.splice(6, numbersArray.length - 6, '...', numbersArray.length);
      }
      return numbersArray;
    }, [pageCount]);

    const paginationRender = React.useCallback(() => {
      if (pageCount > 7 && activeButton >= pageCount - 4) {
        setNumbers([
          1,
          '...',
          pageCount - 5,
          pageCount - 4,
          pageCount - 3,
          pageCount - 2,
          pageCount - 1,
          pageCount,
        ]);
      }

      if (pageCount > 7 && activeButton > 5 && activeButton < pageCount - 4) {
        setNumbers([1, '...', activeButton - 1, activeButton, activeButton + 1, '...', pageCount]);
      }

      if (pageCount > 7 && activeButton <= 5) {
        setNumbers([1, 2, 3, 4, 5, 6, '...', pageCount]);
      }
    }, [activeButton, pageCount]);

    React.useEffect(() => {
      if (!isWide) {
        setPageCount(pageCountMobileProp);
        setActiveButton(1);
      } else {
        setPageCount(pageCountProp);
        setActiveButton(1);
      }
    }, [isWide, pageCountMobileProp, pageCountProp]);
    React.useEffect(() => {}, [isWide, pageCount, pageCountMobileProp, pageCountProp]);

    React.useEffect(() => {
      paginationRender();
    }, [paginationRender]);

    React.useEffect(() => {
      setNumbers(firstPaginationRender());
    }, [firstPaginationRender]);

    React.useEffect(() => {
      if (sortFlagChangedProp) {
        setActiveButton(1);
      }
      if (!sortFlagChangedProp) {
        setActiveButton(1);
      }
    }, [sortFlagChangedProp]);

    return (
      <div>
        {numbers.length > 1 && (
          <div className={s.pagination}>
            <div className={s.buttonsContainer}>
              {numbers.map((pageNumber: any) => {
                switch (pageNumber) {
                  case activeButton:
                    return (
                      <button type="button" className={s.buttonActive}>
                        <div className={s.buttonNumber}>{pageNumber}</div>
                      </button>
                    );
                  case '...':
                    return (
                      <button type="button" className={s.buttonDots}>
                        <div className={s.buttonNumber}>{pageNumber}</div>
                      </button>
                    );
                  default:
                    return (
                      <button
                        type="button"
                        onClick={changePage.bind(this, pageNumber)}
                        className={s.button}
                      >
                        <div className={s.buttonNumber}>{pageNumber}</div>
                      </button>
                    );
                }
              })}
            </div>
          </div>
        )}
      </div>
    );
  },
);
