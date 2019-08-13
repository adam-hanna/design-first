import chalk from 'chalk';
import {
  existsSync,
  moveSync,
  readFileSync,
  removeSync,
  writeFileSync
} from 'fs-extra';
import { get as getEmoji } from 'node-emoji';
import ora, { Ora } from 'ora';
import { resolve } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { genAuthentication } from './authentication';
import { genAuthorization } from './authorization';
import { genContext } from './context';
import { genHandlers } from './handlers';
import { genInternal } from './internal';
import { genMiddleware } from './middleware';
import Design from './types/design';

// tslint:disable-next-line:no-var-requires
const emojiSupport = require('detect-emoji-support');

// tslint:disable-next-line:class-name
export class argv {
  constructor(public file: string) {}
}

export const handler = async (args: argv): Promise<void> => {
  let exit: number = 0;
  const designFile: string = `${process.env.PWD}/${args.file}`;
  const tmpDir: string = `${process.env.PWD}/tmp-${uuidv4()}`; // TODO: use 'mkdtempSync'?
  const authenticationDir: string = `${process.env.PWD}/src/authentication`;
  const authorizationDir: string = `${process.env.PWD}/src/authorization`;
  const contextDir: string = `${process.env.PWD}/src/context`;
  const handlersDir: string = `${process.env.PWD}/src/handlers`;
  const internalDir: string = `${process.env.PWD}/src/internal`;
  const middlewareDir: string = `${process.env.PWD}/src/middleware`;
  const spinner: Ora = ora('Generating api...').start();

  try {
    // 1. check if design file exists
    if (await !existsSync(designFile)) {
      throw new Error(`could not open ${designFile}. File does not exists`);
    }

    // 2. load design file into object
    const design: Design = Object.assign(
      new Design(),
      JSON.parse(await readFileSync(designFile).toString())
    );
    const errors: string[] = design.Validate();
    if (errors && errors.length > 0) {
      throw errors.map((error: string) => `${error}\n`);
    }

    // 3. generate the temporary 'internal' files
    await genInternal(tmpDir, design);

    // 4. remove the existing internal route files and copy over the new ones
    if (await !existsSync(internalDir)) {
      throw new Error(
        "could not find directory './internal'. Did you '$ design-first init [name] && cd [name] && design-first gen <file>'?"
      );
    }

    await moveSync(`${tmpDir}/routes/`, `${internalDir}/routes/`, {
      overwrite: true
    });

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

    // 10. all done!
    spinner.succeed(chalk.bold.green('Done!'));
    console.log(
      chalk.bold.green('SUCCESS: '),
      `${chalk.green(`generated api from ${args.file}`)} ${
        emojiSupport() ? getEmoji('sunglasses') : ''
      }`
    );
  } catch (e) {
    spinner.fail(chalk.bold.red('Failed to generate api'));

    console.log(
      chalk.bold.red('ERROR: '),
      `${chalk.red(`could not generate api from ${args.file}`)} ${
        emojiSupport() ? getEmoji('ghost') : ''
      }`,
      '\n',
      chalk.red(e)
    );

    exit = 1;
  } finally {
    try {
      if (await existsSync(tmpDir)) {
        removeSync(tmpDir);
      }
    } catch (e) {
      console.log(
        chalk.bold.red('ERROR: '),
        `${chalk.red(`could not remove tmp dir ${tmpDir}`)} ${
          emojiSupport() ? getEmoji('ghost') : ''
        }`,
        '\n',
        chalk.red(e)
      );

      exit = 1;
    }

    process.exit(exit);
  }
};
