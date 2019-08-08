"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (name) => {
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
    "@types/errorhandler": "0.0.32",
    "@types/express": "^4.17.0",
    "@types/node": "^12.6.8",
    "ts-node": "^8.3.0",
    "ts-node-dev": "^1.0.0-pre.40",
    "typescript": "^3.5.3"
  }
}`;
};
//# sourceMappingURL=package.json.js.map