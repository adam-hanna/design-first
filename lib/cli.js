#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const gen_1 = require("./handlers/gen");
const init_1 = require("./handlers/init");
// tslint:disable-next-line:no-unused-expression no-var-requires
require('yargs')
    .command({
    aliases: ['initialize', 'i'],
    builder: (yargs) => {
        yargs.positional('name', {
            describe: 'The name of the rest api application',
            type: 'string'
        });
    },
    command: 'init <name>',
    desc: 'Initialize a new design-first app',
    handler: init_1.handler
})
    .command({
    aliases: ['generate', 'g'],
    builder: (yargs) => {
        yargs.positional('file', {
            default: 'design.json',
            describe: 'Optional design file location',
            type: 'string'
        });
    },
    command: 'gen [file]',
    desc: 'Generate a rest api from a design file',
    handler: gen_1.handler
})
    .demandCommand()
    .wrap(90)
    .help()
    .alias('help', 'h')
    .version('version', '0.1.0') // the version string.
    .alias('version', 'v').argv;
//# sourceMappingURL=cli.js.map