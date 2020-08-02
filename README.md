# prisma-lrucache-middleware

[Prisma](https://www.prisma.io/) (2) Client middleware.

Pass an [LRU Cache](https://github.com/isaacs/node-lru-cache) to cache Prisma query results.

Only caches these actions

- `findOne`
- `findMany`
- `queryRaw`
- `aggregate`

## Required Reading

Middlewares are an experimental feature. Read more about them [here](https://github.com/prisma/prisma/releases/tag/2.3.0)

## Quick Start

Install the package using `yarn`:

```bash
yarn add prisma-lrucache-middleware
```

### Feature flag

Middlewares need to be enabled with the feature flag middlewares like so:

```
generator client {
  provider        = "prisma-client-js"
  previewFeatures = ["middlewares"]
}
```

## Code

```js
import { PrismaClient } from "@prisma/client";
import { createLRUCacheMiddleware } from "prisma-lrucache-middleware";
import * as LRU from "lru-cache";

const db = new PrismaClient();

const UserCache = new LRU(50);

db.use(createLRUCacheMiddleware({ model: `User`, cache: UserCache }));

const PostCache = new LRU({
  max: 500,
  maxAge: 1000 * 60 * 60,
});

db.use(createLRUCacheMiddleware({ model: `Post`, cache: PostCache }));
```
