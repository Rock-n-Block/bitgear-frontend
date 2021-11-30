import React from 'react';

import BNB from '../../assets/icons/icon-bnb.svg';
import ETH from '../../assets/icons/icon-eth.svg';
import MATIC from '../../assets/icons/icon-matic.svg';
import MON from '../../assets/icons/icon-mon.svg';
import { DropDownCurrent } from '../DropDownCurrent';

export const NetworkDropDown: React.FC = () => {
  const [choosesNet, setChoosesNet] = React.useState('Ethereum');
  const networks = [
    {
      text: 'Ethereum',
      icon: ETH,
      color: 'blue',
    },
    {
      text: 'Polygon (coming soon)',
      icon: MATIC,
      color: 'purple',
    },
    {
      text: 'BSC (coming soon)',
      icon: BNB,
      color: 'yellow',
    },
    {
      text: 'Moonriver (coming soon)',
      icon: MON,
      color: 'gray',
    },
  ];

  return (
    <div>
      <DropDownCurrent options={networks} setValue={setChoosesNet} value={choosesNet} />
    </div>
  );
};
