/**
 * Starts a high-resolution timer.
 *
 * @returns {() => number} Function that returns elapsed time in milliseconds.
 */
function startTimer() {
  const start = process.hrtime.bigint();

  return function getElapsed() {
    const elapsedNs = process.hrtime.bigint() - start;
    return Number(elapsedNs) / 1e6;
  };
}

module.exports = {
  startTimer,
};
