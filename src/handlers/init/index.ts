import chalk from 'chalk';
import { existsSync, mkdirSync, removeSync, writeFileSync } from 'fs-extra';
import { get as getEmoji } from 'node-emoji';
import { resolve } from 'path';
import { extract as extractTar } from 'tar';

// tslint:disable-next-line:no-var-requires
const emojiSupport = require('detect-emoji-support');

// tslint:disable-next-line:class-name
export class argv {
  constructor(public name: string) {}
}

const directoryExistsErr = (name: string): string => {
  return `${chalk.bold.red('ERROR:')} ${chalk.red(name + ' already exists')}`;
};

const successMsg = (name: string): string => {
  return `${chalk.bold.green('SUCCESS:')} ${chalk.green(
    name + ' created! Happy designing'
  )}`;
};

const genPkg = (name: string): string => {
  return `{
  "name": "${name}",
  "version": "0.0.1",
  "description": "A well-designed REST api",
  "scripts": {
    "build": "tsc",
    "dev": "ts-node-dev --respawn --transpileOnly ./src/server.ts",
    "prod": "NODE_ENV=production npm run build && NODE_ENV=production npm run serve",
    "serve": "node ./dist/server.js",
    "test": "NODE_ENV=testing echo 'Error: no test specified' && exit 1"
  },
  "author": "",
  "license": "",
  "dependencies": {
    "body-parser": "^1.19.0",
    "class-validator": "^0.9.1",
    "compression": "^1.7.4",
    "design-first": "^0.1.2",
    "dotenv": "^8.0.0",
    "express": "^4.17.1",
    "express-validator": "^6.1.1"
  },
  "devDependencies": {
    "@types/body-parser": "^1.17.0",
    "@types/compression": "0.0.36",
    "@types/dotenv": "^6.1.1",
    "@types/express": "^4.17.0",
    "@types/node": "^12.6.8",
    "ts-node": "^8.3.0",
    "ts-node-dev": "^1.0.0-pre.40",
    "typescript": "^3.5.3"
  }
}`;
};

const genDesignExample = (name: string): string => {
  return `{
  "api": {
    "name": "${name}",
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
        {
          "name": "list",
          "description": "",
          "method": "GET",
          "path": "",
          "payload": "ListFoos",
          "response": "Foos"
        },
        {
          "name": "update",
          "description": "",
          "method": "PUT",
          "path": "/:fooID",
          "payload": "UpdateFoo",
          "response": "Foo"
        },
        {
          "name": "create",
          "description": "",
          "method": "POST",
          "path": "",
          "payload": "CreateFoo",
          "response": "Foo"
        },
        {
          "name": "delete",
          "description": "",
          "method": "DELETE",
          "path": "/:fooID"
        }
      ]
    },
    {
      "name": "bars",
      "description": "",
      "path": "/bars",
      "actions": [
        {
          "name": "show",
          "description": "",
          "method": "GET",
          "path": "/:barID",
          "payload": "ShowBar",
          "response": "Boo"
        },
        {
          "name": "list",
          "description": "",
          "method": "GET",
          "path": "",
          "payload": "ListBars",
          "response": "Bars"
        },
        {
          "name": "update",
          "description": "",
          "method": "PUT",
          "path": "/:barID",
          "payload": "UpdateBar",
          "response": "Bar"
        },
        {
          "name": "create",
          "description": "",
          "method": "POST",
          "path": "",
          "payload": "CreateBar",
          "response": "Bar"
        },
        {
          "name": "delete",
          "description": "",
          "method": "DELETE",
          "path": "/:barID"
        }
      ]
    }
  ]
}`;
};

export const handler = async (args: argv): Promise<void> => {
  const dir: string = process.env.PWD + '/' + args.name;

  try {
    // 0. check the name only contains characters
    const reg = /^[a-z0-9_-]+$/i;
    if (!reg.test(args.name)) {
      throw new Error(
        `app name (${args.name}) can only contain english alphanumerical characters, underscores (_) and hyphens (-)`
      );
    }

    // 1. check if the directory already exists
    if (await existsSync(dir)) {
      throw directoryExistsErr(args.name);
    }

    // 2. create the directory
    await mkdirSync(dir);

    // 3. extract the files into the newly created directory
    await extractTar({
      cwd: dir,
      file: resolve(__dirname, '../../files/base.tar.gz'),
      strict: true,
      sync: true
    });

    // 4. create the package.json file
    await writeFileSync(dir + '/package.json', genPkg(args.name));

    // 5. create the design.example.json file
    await writeFileSync(
      dir + '/design.example.json',
      genDesignExample(args.name)
    );

    // 6. all done!
    console.log(
      successMsg(args.name) +
        (emojiSupport() ? ' ' + getEmoji('sunglasses') : '')
    );
  } catch (e) {
    try {
      if (await existsSync(dir)) {
        removeSync(dir);
      }
    } catch (e2) {
      // ignore quietly...
    }

    console.log(
      chalk.bold.red('ERROR: '),
      `${chalk.red(`could not create ${args.name}`)}  ${
        emojiSupport() ? getEmoji('ghost') : ''
      }`,
      '\n',
      chalk.red(e)
    );

    process.exit(1);
  }
};
