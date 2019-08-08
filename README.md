<p align="center"><img src="https://adam-hanna.github.io/design-first-docs/images/logo.png" alt="design-first logo" width="215" height="215"></p>

<div align="center">
  <!-- Docs -->
  <a href="https://adam-hanna.github.io/design-first-docs">
    <img src="https://img.shields.io/badge/documentation-available-green.svg?style=flat" alt="documentation available">
  </a>

  <!-- Stability -->
  <a href="">
    <img src="https://img.shields.io/badge/stability-alpha-red.svg?style=flat" alt="stability alpha">
  </a>

  <!-- Version -->
  <a href="https://adam-hanna.github.io/design-first">
    <img src="https://img.shields.io/github/package-json/v/adam-hanna/design-first" alt="website">
  </a>

  <!-- License -->
  <a href="LICENSE">
    <img src="https://img.shields.io/github/license/adam-hanna/design-first.svg" alt="LICENSE">
  </a>

  <!-- Build Status -->
  <!--
  <a href="https://travis-ci.org/marktext/marktext/">
    <img src="https://travis-ci.org/marktext/marktext.svg?branch=master" alt="build">
  </a>
  -->

  <!-- Downloads Monthly -->
  <a href="https://www.npmjs.com/package/design-first">
    <img src="https://img.shields.io/jsdelivr/npm/hm/design-first?label=downloads" alt="total download">
  </a>

  <!-- Downloads latest release -->
  <!--
  <a href="https://github.com/adam-hanna/design-first/releases/latest">
    <img src="https://img.shields.io/github/downloads/adam-hanna/design-first/v0.0.2/total.svg" alt="latest download">
  </a>
  -->
</div>

<div align="center">
  <strong>:sunglasses: A REST api templating engine :ghost:</strong><br/>
  With a focus on designing before building and separating concerns.<br/>
  <sub>Available for Typescript.</sub>
</div>
<br/>

## ALPHA SOFTWARE

**WARNING** - this software is in alpha and is subject to change. The api will be undergoing breaking changes until the release of v1.0.0

## About

design-first is a command line tool for helping you to build better http REST api's with Typescript.

Spec your api, first, in `design.json` and let design-first take care of the boring work leaving you to code up the important bits.

## Full Documentation

The full documentation can be found, [here](https://adam-hanna.github.io/design-first-docs).

## Examples

A TODO's example, backed by postgres, with passport.js for authentication backed by a redis cache can be found, [here](https://github.com/adam-hanna/design-first-example).

## Quickstart

### Initialize

To start a new design-first api, use the initialize command:

```bash
$ design-first init my-first-api
```

This will create a new directory for you at `./my-first-api/`.

Next, change directories to this new folder and npm install:

```bash
$ cd my-first-api
$ npm install
```

In order to run, a design-first api needs a `.env` file and a `design.json` file. Two example files have been provided for you.

```bash
$ cp .env.example .env
$ cp design.example.json design.json
```

### Design

Edit the `design.json` file to fit your needs.

```json
{
  "api": {
    "name": "design-first-example",
    "description": "A well-designed REST api",
    "baseURL": "",
    "version": "0.0.1"
  },
  "services": [
    {
      "name": "foos",
      "path": "/foos",
      "description": "",
      "actions": [
        {
          "name": "show",
          "description": "",
          "method": "GET",
          "path": "/:fooID",
          "payload": "ShowFoo",
          "response": "Foo"
        },
        ...
      ]
    ...
    }
  ]
}
```

### Generate

Generate the scaffolding:

```bash
$ design-first gen
```

### Code

Finally, make the necessary changes to the auto-generated files.

#### Models / Types

**./src/models/foos/index.ts**
```typescript
import { IsInt, Min } from 'class-validator';

export class Foo { ... }

type showFooPayloadProps = {
  fooID: string;
}

export class ShowFooPayload {
  constructor({ fooID }: showFooPayloadProps) {
    this.fooID = parseInt(fooID);
  }

  @IsInt()
  @Min(0)
  public fooID: number;
}

```

**./src/models/index.ts**
```typescript
// note: all of your models should be exported, here

export * from './foos';
```

#### Database

**./src/db/index.ts**
```typescript
import { resolve } from 'path';
import { Pool } from 'pg';
import { migrate } from 'postgres-migrations';

export default class {
  constructor(private user: string, private password: string, private host: string, private database: string, private port: number) {
    this.pool = new Pool({
      user,
      host,
      database,
      password,
      port,
    })
  }

  public async doesUserOwnFoo (fooID: number, userID: string): Promise<boolean> { ... }

  public async showFoo (fooID: string): Promise<boolean> { ... }

  public async migrate () {
    await migrate({
      user: this.user,
      password: this.password,
      host: this.host,
      database: this.database,
      port: this.port,
    }, resolve(__dirname, './migrations/'), undefined);
  }

  private pool: Pool
}
```

**./src/server.ts**
```typescript
import app from './internal/app';
import routes from './internal/routes';
import appContext from './context/app';
import DB from './db';

// Create the db
const db: DB = new DB(
  process.env.POSTGRES_USER,
  process.env.POSTGRES_PASSWORD,
  process.env.POSTGRES_HOST,
  process.env.POSTGRES_DATABASE,
  parseInt(process.env.POSTGRES_PORT),
);

let appCtx: appContext = new appContext();
appCtx.db = db;
app.set('context', appCtx);

/**
 * Primary app routes.
 */
app.use('/', routes);

/**
 *  * Start Express server.
 */
const server = async () => {
  // Migrate the db.
  try {
    console.log('migrating db');
    await db.migrate();
  } catch (e) {
    console.error('err migrating the database\n', e);
    process.exit(1);
  }

  app.listen(app.get('port'), app.get('host'), () => {
    console.log(
      '  App is running at http://%s:%d in %s mode',
      app.get('host'),
      app.get('port'),
      app.get('env')
    );
    console.warn('  Press CTRL-C to stop\n');
  });
}

export default server();
```

#### Context

##### Global

**./src/context/app/index.ts**
```typescript
import DB from '../../db';

export default class appContext {
  // note: add your app-wide context, here
  db: DB;
}
```

##### Request Scoped

**./src/context/request/foos/show/index.ts**
```typescript
import defaultRequestContext from '../../../request';

export default class extends defaultRequestContext {
  public userID: string;
  public isAdmin: boolean;
}
```

### Authentication

**./src/authentication/foos/show/index.ts**
```typescript
import { Request, Response } from 'express';
import appContext from '../../../context/app';
import requestContext from '../../../context/request/foos/show';
import { HttpReturn } from '../../../internal/utils';
import { ShowTodoPayload } from '../../../models';

export default async (
  appCtx: appContext,
  requestCtx: requestContext,
  payload: ShowTodoPayload,
  req: Request,
  res: Response,
): Promise<HttpReturn | void> => {
  // check session
  if (!req.session.userID)
    return new HttpReturn(401, 'unauthorized');

  requestCtx.isAdmin = req.session.isAdmin;
  requestCtx.userID = req.session.userID;
}
```

### Authorization

```typescript
import { Request, Response } from 'express';
import appContext from '../../../context/app';
import requestContext from '../../../context/request/todos/show';
import { HttpReturn } from '../../../internal/utils';
import { ShowTodoPayload } from '../../../models';

export default async (
  appCtx: appContext,
  requestCtx: requestContext,
  payload: ShowTodoPayload,
  req: Request,
  res: Response,
): Promise<HttpReturn | void> => {
  if (requestCtx.isAdmin)
    return

  const authorized = await appCtx.db.doesUserOwnFoo(payload.fooID, requestContext.userID);
  if (!authorized)
    return new HttpReturn(401, 'unauthorized');
}
```

### Business Logic

**./src/handlers/foos/show/index.ts**
```typescript
import appContext from '../../../context/app';
import { HttpReturn } from '../../../internal/utils';
import requestContext from '../../../context/request/foos/show';
import {
  Foo,
  ShowFooPayload,} from '../../../models';

export const Handler = async (appCtx: appContext, requestCtx: requestContext, payload: ShowFoooPayload): Promise<HttpReturn> => {
  let result: Foo;

  try {
    // your code, here...
    result = await appCtx.db.showFoo(payload.fooID);

    return new HttpReturn(200, result);
  } catch (e) {
    console.error('err in show action of foos service', e);

    return new HttpReturn(500, 'internal server error');
  }
}
```

### Run

```bash
$ npm run dev
```

## License

[**MIT**](LICENSE).

[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fadam-hanna%2Fdesign-first.svg?type=large)](https://app.fossa.com/projects/git%2Bgithub.com%2Fadam-hanna%2Fdesign-first?ref=badge_large)


```
The MIT License (MIT)

Copyright (c) 2019 Adam Hanna

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
```
