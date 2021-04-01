import React from 'react';

import s from './style.module.scss';

export const PageListsRecentlyAdded: React.FC = () => {
  return (
    <div className={s.container}>
      <section className={s.containerTitle}>
        <h1>Recently Added</h1>
      </section>
    </div>
  );
};
