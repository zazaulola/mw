/** @format */

import { Mw } from './mw.js';
import { describe, test } from 'node:test';
import { deepEqual } from 'node:assert';
describe('Mw', () => {
  test('should create middleware chain with single middleware', () => {
    const mw = Mw({ initial: true });
    const middleware = (ctx, next) => {
      ctx.value = 'test';
      return next(ctx);
    };

    mw.use(middleware);
    const result = mw.get({ req: true });

    deepEqual(result, {
      initial: true,
      req: true,
      value: 'test',
    });
  });

  test('should execute multiple middleware in order', () => {
    const mw = Mw({});
    const values = [];

    mw.use((ctx, next) => {
      values.push(1);
      return next(ctx);
    })
      .use((ctx, next) => {
        values.push(2);
        return next(ctx);
      })
      .use((ctx, next) => {
        values.push(3);
        return next(ctx);
      });

    mw.get({});
    deepEqual(values, [1, 2, 3]);
  });

  test('should merge context objects correctly', () => {
    const mw = Mw({ base: 'value' });
    const middleware = (ctx, next) => next(ctx);

    mw.use(middleware);
    const result = mw.get({ request: 'data' });

    deepEqual(result, {
      base: 'value',
      request: 'data',
    });
  });

  test('should handle middleware that modifies context', () => {
    const mw = Mw({});

    mw.use((ctx, next) => {
      ctx.first = true;
      return next(ctx);
    }).use((ctx, next) => {
      ctx.second = true;
      return next({ ...ctx, third: true });
    });

    const result = mw.get({});
    deepEqual(result, {
      first: true,
      second: true,
      third: true,
    });
  });

  test('should return final context when no more middleware exists', () => {
    const mw = Mw({ initial: true });
    const middleware = ctx => ({ ...ctx, final: true });

    mw.use(middleware);
    const result = mw.get({});

    deepEqual(result, {
      initial: true,
      final: true,
    });
  });
});
