/** @format */

/**
 * Mw is a middleware function that allows you to chain multiple middleware functions together.
 * 
 * @param {object} mwCtx - The initial context object to be passed to the middleware chain.
 * @returns {object} - An object with two methods: `use` and `get`.
 *   - `use(cb)`: Adds a middleware function `cb` to the chain.
 *   - `get(reqCtx)`: Executes the middleware chain with the provided request context `reqCtx`, and returns the final context.
 */
export default function Mw(mwCtx) {
  const chain = [];
  function use(cb) {
    chain.push(cb);
    return { use, get };
  }
  function get(reqCtx) {
    let ctx = { ...mwCtx, ...reqCtx };
    let idx = 0;
    return chain[idx++](ctx, function next(ctx) {
      return idx < chain.length ? chain[idx++](ctx, next) : ctx;
    });
  }
  return { use, get };
}
