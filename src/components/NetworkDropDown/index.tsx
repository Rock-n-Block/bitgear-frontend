import { FC, useState } from 'react';
import { useDispatch } from 'react-redux';

import { networks } from '../../appConstants';
import { userActions } from '../../redux/actions';
import { DropDownCurrent } from '../DropDownCurrent';

export const NetworkDropDown: FC = () => {
  const [choosesNet, setChoosesNet] = useState('Ethereum');
  const dispatch = useDispatch();

  const handleChainChange = (newChain: string) => {
    setChoosesNet(newChain);

    const foundChain = networks.find(({ text }) => text === newChain);
    if (foundChain) {
      dispatch(
        userActions.setUserData({
          network: foundChain.type,
        }),
      );
    }
  };

  return (
    <div>
      <DropDownCurrent options={networks} setValue={handleChainChange} value={choosesNet} />
    </div>
  );
};
