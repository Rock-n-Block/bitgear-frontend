/* eslint-disable react/require-default-props */

import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { v1 as uuid } from 'uuid';

import Arrow from '../../assets/icons/arrow-right.svg';
import { ReactComponent as IconSearch } from '../../assets/icons/search.svg';
import { InputWithDropdown } from '../InputWithDropdown';

import s from './style.module.scss';

type TypeToken = {
  symbol: string;
  name: string;
  address: string;
  price?: number;
  priceChange?: string | number;
  image?: string;
};

type TypeSearchDropdownProps = {
  items?: TypeToken[];
  search?: string;
};

type TypeSearchProps = {
  wide?: boolean;
};

const Label: React.FC = () => {
  return (
    <div className={s.label}>
      <Link to="/explore" className={s.button}>
        <img src={Arrow} alt="arrow" />
      </Link>
    </div>
  );
};

const SearchLabel: React.FC = () => {
  return (
    <div className={s.labelInput}>
      <IconSearch />
    </div>
  );
};

const SearchDropdown: React.FC<TypeSearchDropdownProps> = ({ items = [], search = '' }) => {
  return (
    <div className={s.dropdownSearch}>
      {items && items.length > 0 ? (
        items.map((item: TypeToken) => {
          const { symbol, address, name, image } = item;
          return (
            <Link to={`/markets/${address}`} key={uuid()} className={s.dropdownSearchItem}>
              <img src={image} alt="" className={s.dropdownSearchItemImage} />
              <div className={s.dropdownSearchItemName}>{name}</div>
              <div className={s.dropdownSearchItemSymbol}>{symbol}</div>
            </Link>
          );
        })
      ) : (
        <div className={s.dropdownSearchItemEmpty}>
          <p>Sorry, we can&lsquo;t find &quot;{search}&quot;</p>
          <Link to="/markets">View all tokens</Link>
        </div>
      )}
    </div>
  );
};

export const Search: React.FC<TypeSearchProps> = React.memo(({ wide = true }) => {
  const [searchValue, setSearchValue] = React.useState<string>('');
  const [searchResult, setSearchResult] = React.useState<any[]>([]);

  const { tokens } = useSelector(({ zx }: any) => zx);

  const matchSearch = (value: string) => {
    try {
      let result = tokens.filter((token: TypeToken) => {
        const includesInSymbol = token.symbol.toLowerCase().includes(value.toLowerCase());
        const includesInName = token.name.toLowerCase().includes(value.toLowerCase());
        const includesInAddress = token.address.toLowerCase().includes(value.toLowerCase());
        if (includesInSymbol || includesInName || includesInAddress) return true;
        return false;
      });
      result = result.slice(0, 50);
      console.log('matchSearch:', tokens, result);
      setSearchResult(result);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSearch = (e: string) => {
    setSearchValue(e.trim());
    if (e.length < 2) return;
    matchSearch(e.trim());
  };

  return (
    <>
      {wide ? (
        <>
          <InputWithDropdown
            classContainer={s.containerInput}
            onChange={handleSearch}
            value={searchValue}
            label={<Label />}
            labelInner={<SearchLabel />}
            dropdown={<SearchDropdown items={searchResult} search={searchValue} />}
            placeholder="Search or input token address"
          />
        </>
      ) : (
        <InputWithDropdown
          classContainer={s.containerInput}
          onChange={handleSearch}
          value={searchValue}
          label={<Label />}
          labelInner={<SearchLabel />}
          dropdown={<SearchDropdown items={searchResult} search={searchValue} />}
          placeholder="Search or input token"
        />
      )}
    </>
  );
});

export default Search;
