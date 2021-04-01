import React from 'react';
import { useParams } from 'react-router-dom';

import s from './style.module.scss';

type TypeUseParams = {
  pairOne?: string;
  pairTwo?: string;
};

export const PageMarketsContent: React.FC = () => {
  const { pairOne, pairTwo } = useParams<TypeUseParams>();

  return (
    <div className={s.container}>
      <h1>Content</h1>
      <div>{pairOne}</div>
      <div>{pairTwo}</div>
    </div>
  );
};
