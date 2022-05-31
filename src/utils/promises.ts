export const race = async (promise: any, time: number) => {
  try {
    const promiseWithTimeout = new Promise((resolve, reject) => setTimeout(reject, time));
    return Promise.race([promise, promiseWithTimeout]);
  } catch (error: any) {
    console.error('race:', error);
    throw new Error(error);
  }
};

export const sleep = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};
