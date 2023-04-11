import 'mocha';
import { expect } from 'chai';

import { slidingWindow } from '../../lib';

describe('Invocation', () => {

  /**
     * 0-1 1-2 2-3 3-4
     * 0-2 1-3 2-4
     * 0-3 1-4
     * 0-4
     */
  it('should execute basic case as expected.', () => {
    const config = { size: { min: 1, max: 4 }, index: { from: 0, to: 4 } };
    const EXPECTED = [
      {
        pair: [ 0, 1 ],
        iteration: 0,
        currentSize: 1,
        step: 1,
        direction: 1,
      },
      {
        pair: [ 1, 2 ],
        iteration: 0,
        currentSize: 1,
        step: 1,
        direction: 1,
      },
      {
        pair: [ 2, 3 ],
        iteration: 0,
        currentSize: 1,
        step: 1,
        direction: 1,
      },
      {
        pair: [ 3, 4 ],
        iteration: 0,
        currentSize: 1,
        step: 1,
        direction: 1,
      },
      {
        pair: [ 0, 2 ],
        iteration: 1,
        currentSize: 2,
        step: 2,
        direction: 1,
      },
      {
        pair: [ 1, 3 ],
        iteration: 1,
        currentSize: 2,
        step: 2,
        direction: 1,
      },
      {
        pair: [ 2, 4 ],
        iteration: 1,
        currentSize: 2,
        step: 2,
        direction: 1,
      },
      {
        pair: [ 0, 3 ],
        iteration: 2,
        currentSize: 3,
        step: 3,
        direction: 1,
      },
      {
        pair: [ 1, 4 ],
        iteration: 2,
        currentSize: 3,
        step: 3,
        direction: 1,
      },
      {
        pair: [ 0, 4 ],
        iteration: 3,
        currentSize: 4,
        step: 4,
        direction: 1,
      }
    ];

    let i = 0;
    const memo = slidingWindow((payload, memo) => {
      const expected = EXPECTED[i++];
      expect(payload).to.deep.equal({ ...expected, config });

      return payload.pair.join('-');
    }, config);
    expect(i).to.equal(EXPECTED.length);

    EXPECTED.forEach(({ pair }, i) => {
      expect(memo[pair[0]][pair[1]]).to.equal(pair.join('-'));
    });
  });

  /**
   * 4-3 3-2 2-1 1-0
   * 4-2 3-1 2-0
   * 4-1 3-0
   * 4-0
   */
  it('should execute reverse case as expected.', () => {
    const config = { size: { min: 1, max: 4 }, index: { from: 4, to: 0 } };
    const EXPECTED = [
      {
        pair: [ 4, 3 ],
        iteration: 0,
        currentSize: 1,
        step: -1,
        direction: -1,
      },
      {
        pair: [ 3, 2 ],
        iteration: 0,
        currentSize: 1,
        step: -1,
        direction: -1,
      },
      {
        pair: [ 2, 1 ],
        iteration: 0,
        currentSize: 1,
        step: -1,
        direction: -1,
      },
      {
        pair: [ 1, 0 ],
        iteration: 0,
        currentSize: 1,
        step: -1,
        direction: -1,
      },
      {
        pair: [ 4, 2 ],
        iteration: 1,
        currentSize: 2,
        step: -2,
        direction: -1,
      },
      {
        pair: [ 3, 1 ],
        iteration: 1,
        currentSize: 2,
        step: -2,
        direction: -1,
      },
      {
        pair: [ 2, 0 ],
        iteration: 1,
        currentSize: 2,
        step: -2,
        direction: -1,
      },
      {
        pair: [ 4, 1 ],
        iteration: 2,
        currentSize: 3,
        step: -3,
        direction: -1,
      },
      {
        pair: [ 3, 0 ],
        iteration: 2,
        currentSize: 3,
        step: -3,
        direction: -1,
      },
      {
        pair: [ 4, 0 ],
        iteration: 3,
        currentSize: 4,
        step: -4,
        direction: -1,
      }
    ];

    let i = 0;
    const memo = slidingWindow((payload, memo) => {
      const expected = EXPECTED[i++];
      expect(payload).to.deep.equal({ ...expected, config });

      return payload.pair.join('-');
    }, config);

    expect(i).to.equal(EXPECTED.length);

    EXPECTED.forEach(({ pair }, i) => {
      expect(memo[pair[0]][pair[1]]).to.equal(pair.join('-'));
    });
  });

  /**
   * 0-1
   */
  it('should execute single sliding window case as expected.', () => {
    const config = { size: { min: 1, max: 1 }, index: { from: 0, to: 1 } };
    const EXPECTED = [
      {
        pair: [0, 1],
        iteration: 0,
        currentSize: 1,
        step: 1,
        direction: 1,
      },
    ];

    let i = 0;
    const memo = slidingWindow((payload, memo) => {
      const expected = EXPECTED[i++];
      expect(payload).to.deep.equal({ ...expected, config });

      return payload.pair.join('-');
    }, config);
    expect(i).to.equal(EXPECTED.length);

    EXPECTED.forEach(({ pair }, i) => {
      expect(memo[pair[0]][pair[1]]).to.equal(pair.join('-'));
    });
  });

  /**
   * No sliding window as from and to are equal
   */
  it('should throw an error for empty range case.', () => {
    const config = { size: { min: 1, max: 1 }, index: { from: 0, to: 0 } };

    expect(() => {
      slidingWindow((payload, memo) => {
        // This handler should never be called since there's no valid range for the sliding window
      }, config);
    }).to.throw(Error, "Maximum size cannot be greater than range.");
  });

  /**
   * 0-4
   */
  it('should execute single full-range sliding window case as expected.', () => {
    const config = { size: { min: 4, max: 4 }, index: { from: 0, to: 4 } };
    const EXPECTED = [
      {
        pair: [0, 4],
        iteration: 0,
        currentSize: 4,
        step: 4,
        direction: 1,
      },
    ];

    let i = 0;
    const memo = slidingWindow((payload, memo) => {
      const expected = EXPECTED[i++];
      expect(payload).to.deep.equal({ ...expected, config });

      return payload.pair.join('-');
    }, config);
    expect(i).to.equal(EXPECTED.length);

    EXPECTED.forEach(({ pair }, i) => {
      expect(memo[pair[0]][pair[1]]).to.equal(pair.join('-'));
    });
  });
});
