import { mkdirSync, writeFileSync } from 'fs-extra';
import Design from '../types/design';
import { genRouteAction, genRouteIndex } from './routes';

export const genInternal = async (
  tmpDir: string,
  design: Design
): Promise<void> => {
  const routePath = `${tmpDir}/routes`;
  await mkdirSync(tmpDir);
  await mkdirSync(routePath);

  for (const service of design.services) {
    const servicePath = `${routePath}/${service.name.toLowerCase()}`;
    await mkdirSync(servicePath);
    for (const action of service.actions) {
      const actionPath = `${servicePath}/${action.name.toLowerCase()}`;
      await mkdirSync(actionPath);
      await writeFileSync(
        `${actionPath}/index.ts`,
        genRouteAction(service, action)
      );
    }
  }

  await writeFileSync(`${routePath}/index.ts`, genRouteIndex(design.services));
};
