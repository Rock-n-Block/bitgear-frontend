export default {
  toggleModal: (payload: any) => ({
    type: 'MODAL:TOGGLE',
    payload,
  }),
  closeModal: () => ({
    type: 'MODAL:CLOSE',
  }),
};
