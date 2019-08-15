#!/usr/bin/env node

import { Argv } from 'yargs';
import { handler as genHandler } from './handlers/gen';
import { handler as initHandler } from './handlers/init';

// tslint:disable-next-line:no-unused-expression no-var-requires
require('yargs')
  .command({
    aliases: ['initialize', 'i'],
    builder: (yargs: Argv) => {
      yargs.positional('name', {
        describe: 'The name of the rest api application',
        type: 'string'
      });
    },
    command: 'init <name>',
    desc: 'Initialize a new design-first app',
    handler: initHandler
  })
  .command({
    aliases: ['generate', 'g'],
    builder: (yargs: Argv) => {
      yargs.positional('file', {
        default: 'design.json',
        describe: 'Optional design file location',
        type: 'string'
      });
    },
    command: 'gen [file]',
    desc: 'Generate a rest api from a design file',
    handler: genHandler
  })
  .demandCommand()
  .wrap(90)
  .help()
  .alias('help', 'h')
  .version('version', '0.1.3') // the version string.
  .alias('version', 'v').argv;
