#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const init_1 = require("./handlers/init");
const gen_1 = require("./handlers/gen");
require('yargs')
    .command({
    command: 'init <name>',
    aliases: ['initialize', 'i'],
    desc: 'Initialize a new design-first app',
    builder: (yargs) => {
        yargs.positional('name', {
            describe: 'The name of the rest api application',
            type: 'string'
        });
    },
    handler: init_1.handler
})
    .command({
    command: 'gen [file]',
    aliases: ['generate', 'g'],
    desc: 'Generate a rest api from a design file',
    builder: (yargs) => {
        yargs.positional('file', {
            describe: 'Optional design file location',
            type: 'string',
            default: 'design.json'
        });
    },
    handler: gen_1.handler
})
    .demandCommand()
    .wrap(90)
    .help()
    .alias('help', 'h')
    .version('version', '0.0.1') // the version string.
    .alias('version', 'v').argv;
//# sourceMappingURL=index.js.map