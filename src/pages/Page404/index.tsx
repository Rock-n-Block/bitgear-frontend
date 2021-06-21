import React from 'react';

import s from './style.module.scss';

export const Page404: React.FC = () => {
  return (
    <div className={s.container}>
      <section className={s.containerTitle}>
        <h1>Page does not exist</h1>
      </section>
    </div>
  );
};
