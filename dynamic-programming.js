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
 *
 * However, not all problems can be solved using DP. Problems that tend to have
 * a significant number of repetitive sub-problems tend to be good candidates for DP.
 */

// Fibonacci

// Non-DP Approach (exponential time)
const fib0 = n => {
  if (n < 2) return 1;
  return fib0(n - 1) + fib0(n - 2)
}

// Memoized - Top-down
const fibMemo = {};
const topDownFib = n => {
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
const bottomUpFib = n => {
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
/* Change Table Structure
 * A matrix where each colum represents sections of ds:
 * ds -> [d0] [d0,d1] [d0,d1,d2] ... [d0...dm]
 * Each row represents each k from 0 to n.
 * Hence each cell (i, j) in the matrix represents change([d0...dj], i)
 */
const bottomUpChange = (ds, n) => {
  // set up table with correct # of rows and columns
  // Fill in entries of n = 0 row with 1 (base cases)
  const changeTable = new Array(n + 1).fill(0).map(e => [])
  changeTable[0] = new Array(ds.length).fill(1)
  for (let i = 1; i < n + 1; i++) {
    for (let j = 0; j < ds.length; j++) {
      // retrieve the element from the table that corresponds to count with
      // denomination ds[j] but where the target, i, is i - ds[j]
      const w = i - ds[j] >= 0 ? changeTable[i - ds[j]][j] : 0;
      // retrieve the element from the table that corrends to count without
      // denomination ds[j] where the target, i, is the same i.e. element to the left
      const wo = j >= 1 ? changeTable[i][j - 1] : 0;
      // Total is with + without
      changeTable[i][j] = w + wo
    }
  }
  return changeTable[n][ds.length - 1]
}
/* Though the bottom-up and top-down DP approaches look different, they are implimenting
 * the same logic. However, it's easier to reason about the run time looking at the
 * bottom-up approach. We can see that the run time for the algorithm is O(nm) where
 * n is the target and m is the number of coin denominations we have.
 **/

/* Cake Thief - Knapsack Problem
 * You have an array of cakes, where each cake has a { weight, value }
 * and a bag with a capacity. Calculate the max value that can fit in the bag
 */
const cakeTypes = [
  {weight: 7, value: 160},
  {weight: 3, value: 90},
  {weight: 2, value: 15},
], capacity = 20;

// stealCakes(cakeTypes, 20) => 555 (6 cakes of weight 3 and one weight 2)

// Non DP solution
// Key insight - The max value you can get is the max of the values of stealing
// one of the cakes, µ, + stealing all the cakes with capacity lowered by µ's weight
// and the max value of stealing none of the cake, µ i.e. recurse on all cakes
// except for µ with the same capacity.
// In otherwords:
// stealCakes(cakes, cap) =>
// max(
//  value of a cake (µ) + stealCakes(cakes, cap - µ.weight)
// , stealCakes(cakes without µ, capacity)) considering base cases
const _onlyOneFits = (cs, cap) => {
  let fcs = cs.filter(c => c.weight <= cap);
  return fcs.length === 1 ? fcs[0].value * Math.floor(fcs[0].weight/cap) : false;
};
const _allCakesLarger = (cs, cap) => cs.every(c => c.weight > cap);

const stealCakes = (cakes, capacity) => {
  let v = 0;
  if (capacity <= 0) v = 0
  else if (cakes.length) {
    const onlyOneFits = _onlyOneFits(cakes, capacity),
      allCakesLarger = _allCakesLarger(cakes, capacity);
    if (allCakesLarger) v = 0;
    else if (onlyOneFits) v = onlyOneFits;
    else {
      const c = cakes[0],
        maxWith = c.value + stealCakes(cakes, capacity - c.weight),
        maxWithout = stealCakes(cakes.slice(1), capacity);
      v = Math.max(maxWith, maxWithout);
    }
  }
  return v;
}

// Memoised - Top-Down
const cakeMemo = {};
const assignIds = cs => cs.map((c, i) => {
  c.id = i;
  return c;
});
// hashCakes :: ([Cake], Int) -> String
const hashCakes = (cakes, capacity) => {
  if (cakes.length && !cakes[0].id)
    cakes = assignIds(cakes);
  return cakes.reduce((hash, c, i) => {
    hash = hash.concat(c.id);
    if (i === cakes.length - 1) hash = hash.concat(';' + capacity);
    return hash;
  }, '')
};
const topDownSteal = (cakes, capacity) => {
  const hash = hashCakes(cakes, capacity),
    val = cakeMemo[hash];
  if (val) return val;
  let v = 0;
  if (capacity <= 0) v = 0
  else if (cakes.length) {
    const onlyOneFits = _onlyOneFits(cakes, capacity),
      allCakesLarger = _allCakesLarger(cakes, capacity);
    if (allCakesLarger) v = 0;
    else if (onlyOneFits) v = onlyOneFits;
    else {
      const c = cakes[0],
        maxWith = c.value + topDownSteal(cakes, capacity - c.weight),
        maxWithout = topDownSteal(cakes.slice(1), capacity);
      v = Math.max(maxWith, maxWithout);
    }
  }
  cakeMemo[hash] = v;
  return v;
}

/* Robber Problem With Binary Tree
 * You are a professional robber planning to rob houses along a street.
 * The houses are arranged in a balanced, complete binary tree. Each house
 * has a certain amount of money stashed, the only constraint stopping you from 
 * robbing each of them is that adjacent houses have security system connected and 
 * it will automatically contact the police if two adjacent houses were broken 
 * into on the same night. Given a list of non-negative integers representing the 
 * amount of money of each house, determine the maximum amount of money you can rob 
 * tonight without alerting the police.
 *
 * Adjacent for a binary tree means that if you rob a house at node, p, its
 * child nodes a and b are adjacent to p and cannot be robbed.
 *
 * FYI: Feel free to assume any implementation for the binary tree and that all
 * values on the houses are non-negative.
 * See utils.js for a sample implementation.
 * */

const { house } = require('./utils');
/* house = { val: 200, l: AnotherHouse, r: AnotherHouse } */

/* Non DP Solution
 * Key Insight - The max value you can get by robbing the houses can be described
 * as the max of current node value + rob(all other houses except for the immediate
 * children of the current node) and rob(all other houses except the current node)
 * i.e. the max between robbing this house and thus forgoing the ability to rob
 * the immediate children vs. what you can get by forgoing the ability to rob this
 * node.
 *
 * Base Cases:
 * no houses => 0
 * one house => house.val
 * 3 node tree => max(root.val, ∑ childres.vals)
 * */

const _oneHouse = h => h && h.l === null && h.r === null;
const _threeHouses = h => h && _oneHouse(h.l) && _oneHouse(h.r) ?
  Math.max(h.val, h.r.val + h.l.val) : false;

const rob = h => {
  let v, oneHouse = _oneHouse(h), threeHouses = _threeHouses(h);
  if (h === null) v = 0;
  else if (oneHouse) v = h.val;
  else if (threeHouses) v = threeHouses;
  else {
    let withRoot = h.val + rob(h.l.l) + rob(h.l.r) + rob(h.r.l) + rob(h.r.r),
      withoutRoot = rob(h.l) + rob(h.r);
    v = Math.max(withRoot, withoutRoot);
  }
  return v;
}

/* As you might be able to deduce, the DP step involves caching the values for
 * a given input to prevent recalculating previously calculated values.
 * Currently the run time of our rob function is exponential, we might be able to
 * reason about it by looking at the recurrence that characterizes the algorithm
 * T(n) = T(n - 2) + T(n - 1) <- which looks a lot like the fibonacci recurrance.
 * T(n - 2) because we call rob on (n - 2) nodes (w/o immediate children)
 * T(n - 1) because we call rob on (n - 1) nodes (w/o current node)
 */

const { Q } = require('./utils'); // Imports a fairly standard implementation of a queue

// DP - Top-Down Approach
const robberMemo = {};
const assignHouseIds = h => {
  // BFS through the BT and assign ids to each house to help us hash each house to a unique id
  let id = 1, q = new Q();
  if (h.id) return h;
  q.enQ(h)
  while (q.notMt()) {
    let node = q.deQ()
    node.id = id;
    id++;
    q.enQ(node.l); // if null, enQ won't put it on the Q
    q.enQ(node.r);
  }
  return h;
}

const robDP = h => {
  h = assignHouseIds(h)
  if (robberMemo[h.id]) return robberMemo[h.id];
  let v, oneHouse = _oneHouse(h), threeHouses = _threeHouses(h);
  if (h === null) v = 0;
  else if (oneHouse) v = h.val;
  else if (threeHouses) v = threeHouses;
  else {
    let withRoot = h.val + robDP(h.l.l) + robDP(h.l.r) + robDP(h.r.l) + robDP(h.r.r),
      withoutRoot = robDP(h.l) + robDP(h.r);
    v = Math.max(withRoot, withoutRoot);
  }
  robberMemo[h.id] = v;
  return v;
}
