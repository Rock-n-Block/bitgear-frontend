import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { ReactComponent as IconClose } from '../../assets/icons/close.svg';
import { modalActions } from '../../redux/actions';

import s from './style.module.scss';

type TypeModalParams = {
  modal: {
    open: boolean;
    text?: React.ReactChild;
    header?: string | React.ReactChild;
    delay?: number;
  };
};

export const Modal: React.FC = React.memo(() => {
  const ref = React.useRef<HTMLDivElement>(null);

  const { open, text, header, delay } = useSelector(({ modal }: TypeModalParams) => modal);

  const dispatch = useDispatch();
  const handleClose = React.useCallback(() => dispatch(modalActions.toggleModal({ open: false })), [
    dispatch,
  ]);

  const handleClickOutside = React.useCallback(
    (e) => {
      if (e.target === ref.current) dispatch(modalActions.toggleModal({ open: false }));
    },
    [dispatch],
  );

  React.useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [handleClickOutside]);

  React.useEffect(() => {
    if (delay) {
      setTimeout(() => {
        handleClose();
      }, delay);
    }
  }, [handleClose, delay, open]);

  return (
    <div className={open ? s.modalOpen : s.modalClosed} ref={ref}>
      <div className={s.modalContainer}>
        <IconClose onClick={handleClose} className={s.modalClose} />
        <div className={s.modalHeader}>{header}</div>
        {text}
      </div>
    </div>
  );
});

export default Modal;
