import { createLRUCacheMiddleware } from "./";

import * as LRU from "lru-cache";

describe(`middleware`, () => {
  it(`should set/get a cache entry for model configured`, async () => {
    const UserCache = new LRU<string, any>({
      max: 500,
    });

    const middleware = createLRUCacheMiddleware({
      model: `User`,
      cache: UserCache,
    });

    const next = jest.fn(() => Promise.resolve("result"));

    let val = await middleware(
      {
        args: { where: { foo: "bar" } },
        action: "create",
        model: "User",
        dataPath: [],
        runInTransaction: false,
      },
      next
    );

    expect(next).toHaveBeenCalled();

    const cacheKey = `User_${JSON.stringify({ where: { foo: "bar" } })}`;

    expect(UserCache.get(cacheKey)).toBe(`result`);

    expect(val).toBe(`result`);

    // Call the same middleware again

    const next2 = jest.fn(() => Promise.resolve("result"));

    val = await middleware(
      {
        args: { where: { foo: "bar" } },
        action: "create",
        model: "User",
        dataPath: [],
        runInTransaction: false,
      },
      next2
    );

    expect(UserCache.get(cacheKey)).toBe(`result`);

    expect(next2).not.toHaveBeenCalled();

    UserCache.reset();
  });
});
