import React from 'react';
import { v1 as uuid } from 'uuid';

import { LineChart } from '../LineChart';

import s from './style.module.scss';

export const LineChartWrapper: React.FC<any> = React.memo(({ points = [] }) => {
  // const [priceChange, setPriceChange] = React.useState<number>(0);
  const [data, setData] = React.useState<any[]>(points);

  React.useEffect(() => {
    setData(points);
  }, [points]);

  return (
    <div key={uuid()} className={s.lineChartContainer}>
      <LineChart data={data} />
    </div>
  );
});
