import {
  existsSync,
  mkdirSync,
  rmdirSync,
  writeFileSync,
  readFileSync,
  renameSync
} from 'fs';
import { resolve } from 'path';
import { get as getEmoji } from 'node-emoji';
import chalk from 'chalk';
import ora, { Ora } from 'ora';
import { v4 as uuidv4 } from 'uuid';
import Design from './types/design';
import { genInternal } from './internal';
import { genAuthentication } from './authentication';
import { genAuthorization } from './authorization';
import { genContext } from './context';
import { genHandlers } from './handlers';
import { genMiddleware } from './middleware';
const emojiSupport = require('detect-emoji-support');

export class argv {
  constructor(public file: string) {}
}

export const handler = async (args: argv): Promise<void> => {
  const designFile: string = `${process.env.PWD}/${args.file}`;
  const tmpDir: string = `${process.env.pwd}/tmp-${uuidv4()}`; // TODO: use 'mkdtempSync'?
  const authenticationDir: string = `${process.env.PWD}/authentication`;
  const authorizationDir: string = `${process.env.PWD}/authorization`;
  const contextDir: string = `${process.env.PWD}/context`;
  const handlersDir: string = `${process.env.PWD}/handlers`;
  const internalDir: string = `${process.env.PWD}/internal`;
  const middlewareDir: string = `${process.env.PWD}/middleware`;
  let design: Design;
  const spinner: Ora = ora('Generating api...').start();

  try {
    // 1. check if design file exists
    if (await !existsSync(designFile))
      throw `could not open ${designFile}. File does not exists`;

    // 2. load design file into object
    design = JSON.parse(await readFileSync(designFile).toString());
    let errors: string[] = design.Validate();
    if (errors && errors.length > 0)
      throw errors.map((error: string) => `${error}\n`);

    // 3. generate the temporary 'internal' files
    await genInternal(tmpDir, design);

    // 4. remove the existing internal route files and copy over the new ones
    if (await !existsSync(internalDir))
      throw `could not find directory './internal'. Did you '$ design-first init [name] && cd [name] && design-first gen <file>'?`;

    if (await !existsSync(`${internalDir}/routes`))
      rmdirSync(`${internalDir}/routes`);

    await renameSync(`${tmpDir}/routes/`, `${internalDir}/routes/`);

    // 5. generate the authentication files
    await genAuthentication(authenticationDir, design);

    // 6. generate the authauthorization files
    await genAuthorization(authorizationDir, design);

    // 7. generate the context files
    await genContext(contextDir, design);

    // 8. generate the handlers files
    await genHandlers(handlersDir, design);

    // 9. generate the middleware files
    await genMiddleware(middlewareDir, design);

    spinner.succeed(chalk.bold.green('Done!'));
  } catch (e) {
    spinner.fail(chalk.bold.red('Failed to generate api'));

    console.log(
      chalk.bold.red('ERROR: '),
      chalk.red(`could not generate api from ${args.file}`),
      emojiSupport() ? ' ' + getEmoji('ghost') + ' ' : '. ',
      chalk.red(e)
    );

    process.exit(1);
  } finally {
    try {
      if (await existsSync(tmpDir)) rmdirSync(tmpDir);
    } catch (e) {
      console.log(
        chalk.bold.red('ERROR: '),
        chalk.red(`could not remove tmp dir ${tmpDir}`),
        emojiSupport() ? ' ' + getEmoji('ghost') + ' ' : '. ',
        chalk.red(e)
      );
    }
  }
};
