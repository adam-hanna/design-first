import chalk from 'chalk';
import { existsSync, mkdirSync, writeFileSync } from 'fs-extra';
import Design from '../types/design';
import Action from '../types/design/action';
import Service from '../types/design/service';

export const genAuthorization = async (
  authorizationDir: string,
  design: Design
): Promise<void> => {
  if (await !existsSync(authorizationDir)) {
    await mkdirSync(authorizationDir);
  }

  for (const service of design.services) {
    const servicePath = `${authorizationDir}/${service.name.toLowerCase()}`;
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

      await writeFileSync(actionFile, genRouteAuthorization(service, action));
    }
  }
};

export const genRouteAuthorization = (
  service: Service,
  action: Action
): string => {
  return `import { Request, Response } from 'express';
import { HttpReturn } from 'design-fisrt';
import appContext from '../../../context/app';
import requestContext from '../../../context/request/${service.name.toLowerCase()}/${action.name.toLowerCase()}';
${
  action.payload
    ? `import { ${action.payload} } from '../../../models';
`
    : ''
}
export default async (
  appCtx: appContext,
  requestCtx: requestContext,${
    action.payload
      ? `
  payload: ${action.payload},`
      : ''
  }
  req: Request,
  res: Response,
): Promise<HttpReturn | void> => {

}`;
};
