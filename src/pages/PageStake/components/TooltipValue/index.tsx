import { FC, ReactElement, ReactNode } from 'react';
import { v4 as uuid } from 'uuid';

import { Tooltip } from '../../../../components';

type TooltipValueProps = { value: string | number | ReactNode; target: ReactElement };
export const TooltipValue: FC<TooltipValueProps> = ({ value, target }) => {
  return (
    <Tooltip
      name={uuid()}
      target={target}
      content={<p style={{ fontSize: 18 }}>{value}</p>}
      event="click"
    />
  );
};
