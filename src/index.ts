type Config = {
  size?: {
    min?: number;
    max?: number;
  };
  index: {
    from?: number;
    to: number;
  };
  noMemo?: boolean;
};

type Payload = {
  pair: [number, number];
  iteration: number;
  currentSize: number;
  step: number;
  direction: number;
  config: Config;
};

/**
 * 
 * For example, if you have 5 items, and you want to perform a memoized series of actions between each item,
 * where you begin with the base case of 2 items, and then increase the size of the window by 1 each iteration,
 * passing the memoized results of the previous iteration for reference.
 * In case described above, iterations would look like this:
 * 0-1 1-2 2-3 3-4
 * 0-2 1-3 2-4
 * 0-3 1-4
 * 0-4
 */
export function slidingWindow<T extends any>(
  handler: (payload: Payload, memo: T[][]) => T,
  config: Config,
) {
  const index = {
    from: config.index?.from || 0,
    to: config.index.to,
  };

  const range = Math.abs(index.to - index.from);

  const size = {
    min: config.size?.min || 1,
    max: config.size?.max || range,
  };

  const direction = index.from < index.to ? 1 : -1;
  if (size.min < 1) throw new Error(`Minimum size cannot be less than 2.`);
  if (size.max < size.min) throw new Error(`Maximum size cannot be less than minimum size.`);
  if (size.max > range) throw new Error(`Maximum size cannot be greater than range.`);


  const memo: T[][] = [];

  const iterations = size.max - size.min + 1;

  for (let i = 0; i < iterations; i++) {
    const currentSize = size.min + i;
    const step = currentSize * direction;
    const last = index.to - (direction * (currentSize - 1));

    for (let j = index.from; j !== last; j += direction) {
      const y = j + step;
      const pair: [number, number] = [j, y];
      const payload: Payload = {
        pair,
        iteration: i,
        currentSize,
        step,
        direction,
        config: {
          size,
          index,
        },
      };

      if (config.noMemo !== false) {
        memo[j] = memo[j] || [];
        memo[j][y] = handler(payload, memo);
      }
    }
  }

  return memo;
}

export default slidingWindow;
