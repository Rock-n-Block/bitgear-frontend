import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import cns from 'classnames';

import { ReactComponent as IconClose } from '../../assets/icons/close.svg';
import { modalActions } from '../../redux/actions';

import s from './style.module.scss';

type ModalClasses = {
  root: string;
  modalContainer: string;
  closeBtn: string;
};

type ModalParams = {
  modal: {
    classes: ModalClasses | null;
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

  const {
    open,
    classes: maybeNullClasses,
    text,
    header,
    delay,
    noCloseButton,
    fullPage,
    onClose,
  } = useSelector(({ modal }: ModalParams) => modal);

  const dispatch = useDispatch();
  const handleClose = React.useCallback(() => {
    dispatch(modalActions.toggleModal({ open: false, classes: null }));
    if (!onClose) return;
    onClose();
  }, [dispatch, onClose]);

  const handleClickOutside = React.useCallback(
    (e) => {
      if (e.target === ref.current) {
        handleClose();
      }
    },
    [handleClose],
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

  const classes = maybeNullClasses || ({} as ModalClasses);

  return (
    <div className={cns(open ? s.modalOpen : s.modalClosed, classes.root)} ref={ref}>
      <div
        className={cns(
          s.modalContainer,
          fullPage && s.modalContainerFullPage,
          classes.modalContainer,
        )}
      >
        {!noCloseButton && (
          <IconClose onClick={handleClose} className={cns(s.modalClose, classes.closeBtn)} />
        )}
        <div className={s.modalHeader}>{header}</div>
        {text}
      </div>
    </div>
  );
});

export default Modal;
