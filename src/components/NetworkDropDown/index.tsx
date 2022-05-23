import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';

import { networks } from '../../appConstants';
import { userActions } from '../../redux/actions';
import { DropDownCurrent } from '../DropDownCurrent';

export const NetworkDropDown: React.FC = () => {
  const [choosesNet, setChoosesNet] = React.useState('Ethereum');
  const dispatch = useDispatch();

  const handleChainChange = useCallback(
    (newChain: string) => {
      setChoosesNet(newChain);

      const foundChain = networks.find(({ text }) => text === newChain);
      if (foundChain) {
        dispatch(
          userActions.setUserData({
            network: foundChain.type,
          }),
        );
      }
    },
    [dispatch],
  );

  return (
    <div>
      <DropDownCurrent options={networks} setValue={handleChainChange} value={choosesNet} />
    </div>
  );
};
