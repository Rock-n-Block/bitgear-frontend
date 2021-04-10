import React from 'react';

import s from './style.module.scss';

type TypeButtonProps = {
  children?: React.ReactElement | string;
  handleClick?: () => void;
};

const Button: React.FC<TypeButtonProps> = ({ children, handleClick }) => {
  return (
    <div role="button" tabIndex={0} onClick={handleClick} onKeyDown={() => {}} className={s.button}>
      {children}
    </div>
  );
};

export default React.memo(Button);
