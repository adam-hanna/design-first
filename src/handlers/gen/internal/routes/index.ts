import Service from '../../types/design/service';
import Action from '../../types/design/action';
import { capitalize } from '../../../../utils';

export const genRouteAction = (service: Service, action: Action): string => {
  const actionPath = `${service.name.toLowerCase()}/${action.name.toLowerCase()}`;

  return `/**
 * DO NOT EDIT
 * AUTO-GENERATED FILE
 * This file was generated with 'design-first'
 */

import { Request, Response } from 'express';
import app from '../../../app';
import appContext from '../../../../context/app';
import requestContext from '../../../../context/request/${actionPath}';
import { Validate, HttpReturn } from '../../../utils';
import authenticate from '../../../../authentication/${actionPath}';
import authorize from '../../../../authorization/${actionPath}';
import { Handler } from '../../../../handlers/${actionPath}';
${
  action.payload
    ? `import { ${action.payload} } from '../../../../models';
`
    : ''
}
export default async (req: Request, res: Response): Promise<void> => {
  const appCtx: appContext = app.get('context');
  const requestCtx: requestContext = new requestContext();
  ${
    action.payload
      ? `
  let reqPayload: any = Object.assign({}, req.params, req.body);
  const validationErr: string | void = await Validate(${action.payload}, reqPayload);
  if (validationErr) {
    res.status(400).send(validationErr);
    return
  }
  let payload: ${action.payload} = Object.assign({}, new ${action.payload}, reqPayload);
`
      : ''
  }
  const authenticationErr: HttpReturn | void = await authenticate(appCtx, requestCtx, ${
    action.payload ? 'payload, ' : ''
  }req, res);
  if (authenticationErr) {
    res.status(authenticationErr.status).send(authenticationErr.body);
    return
  }

  const authorizationErr: HttpReturn | void = await authorize(appCtx, requestCtx, ${
    action.payload ? 'payload, ' : ''
  }req, res)
  if (authorizationErr) {
    res.status(authorizationErr.status).send(authorizationErr.body);
    return
  }

  const result: HttpReturn = await Handler(appCtx, requestCtx${
    action.payload ? ', payload' : ''
  })
  res.status(result.status).send(result.body);
}`;
};

export const genRouteIndex = (services: Service[]): string => {
  return `/**
 * DO NOT EDIT
 * AUTO-GENERATED FILE
 * This file was generated with 'design-first'
 */

import { Router } from 'express';

// Middlewares
import DefaultAppMiddleware from '../../middleware/app';
${services
  .map(service =>
    service.actions
      .map(
        action => `import ${capitalize(service.name)}${capitalize(
          action.name
        )}Middleware from '../../middleware/${service.name.toLowerCase()}/${action.name.toLowerCase()}';
`
      )
      .join('')
  )
  .join('')}

// Handlers
${services
  .map(service =>
    service.actions
      .map(
        action => `import ${capitalize(service.name)}${capitalize(
          action.name
        )}Handler from './${service.name.toLowerCase()}/${action.name.toLowerCase()}';
`
      )
      .join('')
  )
  .join('')}

// Routes
const router: Router = Router();
${services
  .map(service =>
    service.actions
      .map(
        action => `router.${action.method.toLowerCase()}('${service.path}${
          action.path
        }', DefaultAppMiddleware, ${capitalize(service.name)}${capitalize(
          action.name
        )}Middleware, ${capitalize(service.name)}${capitalize(
          action.name
        )}Handler);
`
      )
      .join('')
  )
  .join('')}

export default router`;
};
