/* Dynamic Programming
 * A powerful algorithm design-paradigm that can be thought of as clever
 * brute-force
 * Dynamic programming is kind of like an exhaustive search. Which
 * is usually a terribly innefficient thing to do because it leads to exp time.
 * But if you do it in a clever way, via DP, you can get polynomial time.
 *
 * The basic idea of dynamic programming is to take a problem, split it into subproblems,
 * solve those subproblems, and reuse the solutions to your subproblem
 *
 * There are typically two ways you can approach solving a problem using DP:
 * - Memoized or Top-Down
 * - Tabularized or Bottom-Up
 */

// Fibonacci

// Non-DP Approach (exponential time)
const fib0 = (n) => {
  if (n < 2) return 1;
  return fib0(n - 1) + fib0(n - 2)
}

// Memoized - Top-down
const fibMemo = {};
const topDownFib = (n) => {
  if (fibMemo[n]) return fibMemo[n];
  let f;
  if (n < 2) f = 1;
  else f = topDownFib(n - 1) + topDownFib(n - 2)
  fibMemo[n] = f;
  return f;
}
// fib1 only recurses the first time it's called, for all n
// There are only n memoized calls, and each memoized call does constant work.

/***** In general, the time complexity of a DP algorithm can be calculated by
 ***** looking at # of subproblems * time per subproblem *****/

// Tabularized - Bottom-Up
const fibTable = [];
const bottomUpFib = (n) => {
  for (let i = 0; i < n; i++) {
    let f;
    if (n < 2) f = 1;
    else f = fibTable[i - 1] + fibTable[i - 2];
    fibTable[i] = f;
  }
  return fibTable[n - 1];
}
// Note: It's basically the same computation as the memoized fib, but there is no
// recursion and the analysis is more obvious. It is one loop O(n) with O(1) work
// in each iteration. Thus leading to O(n)

/* Coin Change Problem
 * Given a list of coin denominations and a target, n, calculate the number of
 * ways to get to n, given an unlimited number of coins of each denomination.
 */

// Non-DP Approach (exponential time)

/* The key insight for this problem is that you can divide all the possible ways
 * to get to n into all ways to get to n without a particular coin denomination
 * and all the possible ways to get n with atleast one coin of that denomination
 * i.e. change(ds, n) => change(ds.slice(1), n) + change(ds, n - d[0])
 */

const changeNonDP = (ds, n) => {
  // If n is 0 then we were able to make change from this branch, so return 1
  if (n === 0) return 1;
  // If n is less than 0 then no solution exists on this branch of the tree
  if (n < 0) return 0;
  // If there are no coins and n is greater than 0, then no solution exists
  if (ds.length === 0 && n >= 1) return 0;
  // Recurse
  return changeNonDP(ds.slice(1), n) + changeNonDP(ds, n - ds[0]);
}
// Like the non-DP fibonacci this can set off lots of duplicate recursive calls

// Memoized - Top-down
const coinMemo = {};
const topDownChange = (ds, n) => {
  const key = ds.toString() + ';' + n,
    val = coinMemo[key];
  if (val) return val
  if (n === 0) return 1;
  if (n < 0) return 0;
  if (ds.length === 0 && n >= 1) return 0;
  const recursiveSum =
    topDownChange(ds.slice(1), n) + topDownChange(ds, n - ds[0])
  coinMemo[key] = recursiveSum;
  return recursiveSum;
}

// Tabularized - Bottom-up
const coinTable = [];
/* Coin Table Structure
 * A matrix where each colum represents sections of ds:
 * ds -> [d0] [d0,d1] [d0,d1,d2] ... [d0...dm]
 * Each row represents each k from 0 to n.
 * Hence each cell (i, j) in the matrix represents change([d0...dj], i)
 */
const bottomUpChange = (ds, n) => {
  // set up table with correct # of rows and columns
}
