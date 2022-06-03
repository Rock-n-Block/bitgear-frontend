const SLICE_NAME = 'WALLET' as const;

const INIT = `${SLICE_NAME}:INIT` as const;
const SET_TYPE = `${SLICE_NAME}:SET_TYPE` as const;
const SET_CHAIN_ID = `${SLICE_NAME}:SET_CHAIN_ID` as const;

export default {
  INIT,
  SET_TYPE,
  SET_CHAIN_ID,
};
