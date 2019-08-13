import chalk from 'chalk';
import { existsSync, mkdirSync, writeFileSync } from 'fs-extra';
import Design from '../types/design';
import Action from '../types/design/action';
import Service from '../types/design/service';

export const genHandlers = async (
  handlersDir: string,
  design: Design
): Promise<void> => {
  if (await !existsSync(handlersDir)) {
    throw new Error(
      "could not find directory './context'. Did you '$ design-first init [name] && cd [name] && design-first gen <file>'?"
    );
  }

  for (const service of design.services) {
    const servicePath = `${handlersDir}/${service.name.toLowerCase()}`;
    if (await !existsSync(servicePath)) {
      await mkdirSync(servicePath);
    }

    for (const action of service.actions) {
      const actionPath = `${servicePath}/${action.name.toLowerCase()}`;
      if (await !existsSync(actionPath)) {
        await mkdirSync(actionPath);
      }

      const actionFile = `${actionPath}/index.ts`;
      if (await existsSync(actionFile)) {
        console.log(
          chalk.bold.yellow('WARNING: '),
          chalk.yellow(`'${actionPath}/index.ts' exists. Skipping`)
        );
        continue;
      }

      await writeFileSync(
        actionFile,
        genRouteHandler(actionPath, service, action)
      );
    }
  }
};

export const genRouteHandler = (
  actionPath: string,
  service: Service,
  action: Action
): string => {
  return `import appContext from '../../../context/app';
import { HttpReturn } from 'design-first';
import requestContext from '../../../context/request/${service.name.toLowerCase()}/${action.name.toLowerCase()}';
import {${
    action.response
      ? `
  ${action.response},`
      : ''
  }${
    action.payload
      ? `
  ${action.payload},`
      : ''
  }
} from '../../../models';

export const Handler = async (appCtx: appContext, requestCtx: requestContext${
    action.payload ? `, payload: ${action.payload}` : ''
  }): Promise<HttpReturn> => {
  let result: ${action.response ? action.response : 'string'};

  try {
    // your code, here...

    return new HttpReturn(200, result);
  } catch (e) {
    console.error('err in ${action.name} action of ${service.name} service', e);

    return new HttpReturn(500, 'internal server error');
  }
}`;
};
