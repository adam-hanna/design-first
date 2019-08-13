"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_extra_1 = require("fs-extra");
const tar_1 = require("tar");
const node_emoji_1 = require("node-emoji");
const path_1 = require("path");
const chalk_1 = require("chalk");
const emojiSupport = require('detect-emoji-support');
class argv {
    constructor(name) {
        this.name = name;
    }
}
exports.argv = argv;
const directoryExistsErr = (name) => {
    return `${chalk_1.default.bold.red('ERROR:')} ${chalk_1.default.red(name + ' already exists')}`;
};
const successMsg = (name) => {
    return `${chalk_1.default.bold.green('SUCCESS:')} ${chalk_1.default.green(name + ' created! Happy designing')}`;
};
const genPkg = (name) => {
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
    "class-transformer": "^0.2.3",
    "class-validator": "^0.9.1",
    "compression": "^1.7.4",
    "design-first": "0.1.0",
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
const genDesignExample = (name) => {
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
exports.handler = (args) => __awaiter(this, void 0, void 0, function* () {
    const dir = process.env.PWD + '/' + args.name;
    try {
        // 0. check the name only contains characters
        const reg = /^[a-z0-9_-]+$/i;
        if (!reg.test(args.name))
            throw `app name (${args.name}) can only contain english alphanumerical characters, underscores (_) and hyphens (-)`;
        // 1. check if the directory already exists
        if (yield fs_extra_1.existsSync(dir))
            throw directoryExistsErr(args.name);
        // 2. create the directory
        yield fs_extra_1.mkdirSync(dir);
        // 3. extract the files into the newly created directory
        yield tar_1.extract({
            strict: true,
            file: path_1.resolve(__dirname, '../../files/base.tar.gz'),
            cwd: dir,
            sync: true
        });
        // 4. create the package.json file
        yield fs_extra_1.writeFileSync(dir + '/package.json', genPkg(args.name));
        // 5. create the design.example.json file
        yield fs_extra_1.writeFileSync(dir + '/design.example.json', genDesignExample(args.name));
        // 6. all done!
        console.log(successMsg(args.name) +
            (emojiSupport() ? ' ' + node_emoji_1.get('sunglasses') : ''));
    }
    catch (e) {
        try {
            if (yield fs_extra_1.existsSync(dir))
                fs_extra_1.removeSync(dir);
        }
        catch (e2) { }
        console.log(chalk_1.default.bold.red('ERROR: '), `${chalk_1.default.red(`could not create ${args.name}`)}  ${emojiSupport() ? node_emoji_1.get('ghost') : ''}`, '\n', chalk_1.default.red(e));
        process.exit(1);
    }
});
//# sourceMappingURL=index.js.map