export const request = <T = string, P = never>(defaultType: T, payload?: P) => ({
  type: `${defaultType}_REQUEST`,
  payload,
});

export const success = <T = string, P = never>(defaultType: T, payload?: P) => ({
  type: `${defaultType}_SUCCESS`,
  payload,
});

export const error = <T = never, E = Error>(defaultType: T, err?: E) => {
  const localError = JSON.parse(JSON.stringify(err)); // prevent https://stackoverflow.com/questions/61704805/getting-an-error-a-non-serializable-value-was-detected-in-the-state-when-using
  return {
    type: `${defaultType}_ERROR`,
    payload: localError,
    err: localError,
  };
};

export const reset = <T = string>(defaultType: T) => ({
  type: `${defaultType}_RESET`,
});

export default {
  request,
  success,
  error,
  reset,
};
