#!/usr/bin/env node

import { Argv } from 'yargs';
import { handler as initHandler } from './handlers/init';
import { handler as genHandler } from './handlers/gen';

require('yargs')
  .command({
    command: 'init <name>',
    aliases: ['initialize', 'i'],
    desc: 'Initialize a new design-first app',
    builder: (yargs: Argv) => {
      yargs.positional('name', {
        describe: 'The name of the rest api application',
        type: 'string'
      });
    },
    handler: initHandler
  })
  .command({
    command: 'gen [file]',
    aliases: ['generate', 'g'],
    desc: 'Generate a rest api from a design file',
    builder: (yargs: Argv) => {
      yargs.positional('file', {
        describe: 'Optional design file location',
        type: 'string',
        default: 'design.yaml'
      });
    },
    handler: genHandler
  })
  .demandCommand()
  .wrap(90)
  .help()
  .alias('help', 'h')
  .version('version', '0.0.1') // the version string.
  .alias('version', 'v').argv;
