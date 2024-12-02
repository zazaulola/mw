<!-- @format -->

# mw

Primitive middleware mechanics

    import Mw from "mw";

    let mwCtx = { a: 1 };

    let mv = Mw(mwCtx);

    mw.use((ctx,next) => {
      ctx.c = 3;
      next(ctx);
    })
    .use((ctx,next) => {
      ctx.d = 4;
      next(ctx);
    });

    let reqCtx = { b: 2 };

    let res = mw.get(reqCtx);

    console.log(res);
    // { a: 1, b: 2, c: 3, d: 4 }
