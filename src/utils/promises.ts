export const race = async (promise: any, time: number) => {
  try {
    // console.log('race');
    const promiseWithTimeout = new Promise((resolve, reject) => setTimeout(reject, time));
    return Promise.race([promise, promiseWithTimeout]);
  } catch (error) {
    console.error('race:', error);
    throw new Error(error);
  }
};

export const sleep = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};
