const SLICE_NAME = 'STAKING' as const;

const SET_REGULAR_PUBLIC_DATA = `${SLICE_NAME}:SET_REGULAR_PUBLIC_DATA` as const;
const SET_REGULAR_USER_DATA = `${SLICE_NAME}:SET_REGULAR_USER_DATA` as const;

const actionTypes = {
  SET_REGULAR_PUBLIC_DATA,
  SET_REGULAR_USER_DATA,
};

export default actionTypes;
