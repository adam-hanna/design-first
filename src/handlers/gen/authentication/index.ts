import { existsSync, mkdirSync, writeFileSync } from 'fs-extra';
import chalk from 'chalk';
import Service from '../types/design/service';
import Action from '../types/design/action';
import Design from '../types/design';

export const genAuthentication = async (
  authenticationDir: string,
  design: Design
): Promise<void> => {
  if (await !existsSync(authenticationDir)) await mkdirSync(authenticationDir);

  for (const service of design.services) {
    const servicePath = `${authenticationDir}/${service.name.toLowerCase()}`;
    if (await !existsSync(servicePath)) await mkdirSync(servicePath);

    for (const action of service.actions) {
      const actionPath = `${servicePath}/${action.name.toLowerCase()}`;
      if (await !existsSync(actionPath)) await mkdirSync(actionPath);

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
        genRouteAuthentication(actionPath, service, action)
      );
    }
  }
};

export const genRouteAuthentication = (
  actionPath: string,
  service: Service,
  action: Action
): string => {
  return `import { Request, Response } from 'express';
import appContext from '../../../context/app';
import requestContext from '../../../context/request/${actionPath}';
import { HttpReturn } from '../../../internal/utils';
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
