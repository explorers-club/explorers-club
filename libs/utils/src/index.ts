export const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

// eslint-disable-next-line @typescript-eslint/no-empty-function
export const noop = () => {};

/**
 * Retries a promise when a certain condition is true
 */
export const retryPromiseWhen = async (
  promise: Promise<unknown>,
  retryCondition: (result: unknown) => boolean,
  maxAttempts = 5,
  delayMS = 1000
) => {
  let attempts = 0;
  while (attempts < maxAttempts) {
    const result = await promise;
    console.log(result);

    if (!retryCondition(result)) {
      return;
    }

    attempts++;
    await sleep(delayMS);
  }

  throw new Error('failed after ' + maxAttempts);
};
