import { existsSync, mkdirSync, rmdirSync, writeFileSync } from 'fs';
import { extract as extractTar } from 'tar';
import { get as getEmoji } from 'node-emoji';
import { resolve } from 'path';
import chalk from 'chalk';
const emojiSupport = require('detect-emoji-support');

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
  "description": "A rest api",
  "scripts": {
    "build": "tsc",
    "dev": "ts-node-dev --respawn --transpileOnly ./src/server.ts",
    "prod": "NODE_ENV=production npm run build && NODE_ENV=production npm run serve",
    "serve": "node ./dist/server.js",
    "test": "NODE_ENV=testing echo \"Error: no test specified\" && exit 1"
  },
  "author": "",
  "license": "",
  "dependencies": {
    "body-parser": "^1.19.0",
    "class-transformer": "^0.2.3",
    "class-validator": "^0.9.1",
    "compression": "^1.7.4",
    "dotenv": "^8.0.0",
    "express": "^4.17.1",
    "express-validator": "^6.1.1",
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

export const handler = async (args: argv): Promise<void> => {
  let created: boolean = false;
  const dir: string = process.env.PWD + '/' + args.name;

  try {
    if (await existsSync(dir)) {
      console.log(
        directoryExistsErr(args.name),
        emojiSupport() ? ' ' + getEmoji('ghost') : '.'
      );
      process.exit(1);
    }

    await mkdirSync(dir);
    created = true;

    await extractTar({
      strict: true,
      file: resolve(__dirname, '../../files/base.tar.gz'),
      cwd: dir,
      sync: true
    });

    await writeFileSync(dir + '/package.json', genPkg(args.name));

    console.log(
      successMsg(args.name),
      emojiSupport() ? ' ' + getEmoji('sunglasses') : '.'
    );
  } catch (e) {
    if (created) rmdirSync(dir);

    console.log(
      chalk.bold.red('ERROR: '),
      chalk.red(`could not create ${args.name}`),
      emojiSupport() ? ' ' + getEmoji('ghost') + ' ' : '. ',
      e
    );
  }
};
