const SLICE_NAME = 'USER' as const;

const SET_DATA = `${SLICE_NAME}:SET_DATA` as const;
const SET_ALLOWANCE = `${SLICE_NAME}:SET_ALLOWANCE` as const;

export default {
  SET_DATA,
  SET_ALLOWANCE,
};
