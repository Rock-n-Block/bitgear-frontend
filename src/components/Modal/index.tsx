import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import cns from 'classnames';

import { ReactComponent as IconClose } from '../../assets/icons/close.svg';
import { modalActions } from '../../redux/actions';

import s from './style.module.scss';

type TypeModalParams = {
  modal: {
    open: boolean;
    noCloseButton?: boolean;
    fullPage?: boolean;
    text?: React.ReactChild;
    header?: string | React.ReactChild;
    delay?: number;
    onClose?: () => void;
  };
};

export const Modal: React.FC = React.memo(() => {
  const ref = React.useRef<HTMLDivElement>(null);

  const { open, text, header, delay, noCloseButton, fullPage, onClose } = useSelector(
    ({ modal }: TypeModalParams) => modal,
  );

  const dispatch = useDispatch();
  const handleClose = React.useCallback(() => {
    dispatch(modalActions.toggleModal({ open: false }));
    if (!onClose) return;
    onClose();
  }, [dispatch, onClose]);

  const handleClickOutside = React.useCallback(
    (e) => {
      if (e.target === ref.current) {
        dispatch(modalActions.toggleModal({ open: false }));
        if (!onClose) return;
        onClose();
      }
    },
    [dispatch, onClose],
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
    <div className={cns(open ? s.modalOpen : s.modalClosed)} ref={ref}>
      <div className={cns(s.modalContainer, fullPage && s.modalContainerFullPage)}>
        {!noCloseButton && <IconClose onClick={handleClose} className={s.modalClose} />}
        <div className={s.modalHeader}>{header}</div>
        {text}
      </div>
    </div>
  );
});

export default Modal;
