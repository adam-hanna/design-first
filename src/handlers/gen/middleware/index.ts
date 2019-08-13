import chalk from 'chalk';
import { existsSync, mkdirSync, writeFileSync } from 'fs-extra';
import Design from '../types/design';
import Action from '../types/design/action';
import Service from '../types/design/service';

export const genMiddleware = async (
  middlewareDir: string,
  design: Design
): Promise<void> => {
  if (await !existsSync(middlewareDir)) {
    throw new Error(
      "could not find directory './context'. Did you '$ design-first init [name] && cd [name] && design-first gen <file>'?"
    );
  }

  for (const service of design.services) {
    const servicePath = `${middlewareDir}/${service.name.toLowerCase()}`;
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
        genRouteMiddleware(actionPath, service, action)
      );
    }
  }
};

export const genRouteMiddleware = (
  actionPath: string,
  service: Service,
  action: Action
): string => {
  return `import { Request, Response, NextFunction } from 'express';

export default (req: Request, res: Response, next: NextFunction): void => {
  next();
}`;
};
