import React from 'react';
import { Link } from 'react-router-dom';

import * as Components from '../../components';

import s from './style.module.scss';

export const PageMain: React.FC = () => {
  const [searchValue, setSearchValue] = React.useState('');

  const handleSearch = (e: string) => {
    setSearchValue(e);
  };

  return (
    <div className={s.container}>
      <section className={s.containerTitle}>
        <h1>Find the best prices across exchange networks</h1>
        <Components.Input onChange={handleSearch} value={searchValue} placeholder="Text" />
      </section>
      <section className={s.containerLists}>
        <Link to="/lists/recently-added" className={s.card}>
          Recently Added
        </Link>
        <Link to="/lists/top-gainers" className={s.card}>
          Top Gainers
        </Link>
      </section>
    </div>
  );
};
