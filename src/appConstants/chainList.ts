import BNB from '../assets/icons/icon-bnb.svg';
import ETH from '../assets/icons/icon-eth.svg';
import MATIC from '../assets/icons/icon-matic.svg';
import MON from '../assets/icons/icon-mon.svg';
import { Chains } from '../types';

type Network = {
  text: string;
  icon: string;
  color: string;
  disable: boolean;
  type: Chains;
};

export const networks: Network[] = [
  {
    type: Chains.eth,
    text: 'Ethereum',
    icon: ETH,
    color: 'blue',
    disable: false,
  },
  {
    type: Chains.polygon,
    text: 'Polygon (coming soon)',
    icon: MATIC,
    color: 'purple',
    disable: true,
  },
  {
    type: Chains.bsc,
    text: 'BSC (coming soon)',
    icon: BNB,
    color: 'yellow',
    disable: true,
  },
  {
    type: Chains.moonriver,
    text: 'Moonriver (coming soon)',
    icon: MON,
    color: 'gray',
    disable: true,
  },
];
