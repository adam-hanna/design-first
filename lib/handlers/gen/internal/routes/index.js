"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../../../../utils");
exports.genRouteAction = (service, action) => {
    const actionPath = `${service.name.toLowerCase()}/${action.name.toLowerCase()}`;
    return `/**
 * DO NOT EDIT
 * AUTO-GENERATED FILE
 * This file was generated with 'design-first'
 */

import { Request, Response } from 'express';
import { RequestPayload, ValidatePayload, MalformedPayloadError, HttpReturn } from 'design-first';
import app from '../../../app';
import appContext from '../../../../context/app';
import requestContext from '../../../../context/request/${actionPath}';
import authenticate from '../../../../authentication/${actionPath}';
import authorize from '../../../../authorization/${actionPath}';
import { Handler } from '../../../../handlers/${actionPath}';
${action.payload
        ? `import { ${action.payload} } from '../../../../models';
`
        : ''}
export default async (req: Request, res: Response): Promise<void> => {
  try {
    const appCtx: appContext = app.get('context');
    const requestCtx: requestContext = new requestContext();
    ${action.payload
        ? `

    let payload: ${action.payload} = new ${action.payload}(new RequestPayload(req.body, req.query, req.params));

    const validationErr: string | void = await ValidatePayload(payload);
    if (validationErr) {
      res.status(400).send(validationErr);
      return
    }
`
        : ''}
    const authenticationErr: HttpReturn | void = await authenticate(appCtx, requestCtx, ${action.payload ? 'payload, ' : ''}req, res);
    if (authenticationErr) {
      res.status(authenticationErr.status).send(authenticationErr.body);
      return
    }

    const authorizationErr: HttpReturn | void = await authorize(appCtx, requestCtx, ${action.payload ? 'payload, ' : ''}req, res)
    if (authorizationErr) {
      res.status(authorizationErr.status).send(authorizationErr.body);
      return
    }

    const result: HttpReturn = await Handler(appCtx, requestCtx${action.payload ? ', payload' : ''})
    res.status(result.status).send(result.body);
  } catch (e) {
    if (e instanceof MalformedPayloadError) {
      res.status(400).send(e.message);
      return
    }

    // TODO: add logging, here?
    res.status(500).send('internal server error');
    return
  }
}`;
};
exports.genRouteIndex = (services) => {
    return `/**
 * DO NOT EDIT
 * AUTO-GENERATED FILE
 * This file was generated with 'design-first'
 */

import { Router } from 'express';

// Middlewares
import DefaultAppMiddleware from '../../middleware/app';
${services
        .map(service => service.actions
        .map(action => `import ${utils_1.capitalize(service.name)}${utils_1.capitalize(action.name)}Middleware from '../../middleware/${service.name.toLowerCase()}/${action.name.toLowerCase()}';
`)
        .join(''))
        .join('')}

// Handlers
${services
        .map(service => service.actions
        .map(action => `import ${utils_1.capitalize(service.name)}${utils_1.capitalize(action.name)}Handler from './${service.name.toLowerCase()}/${action.name.toLowerCase()}';
`)
        .join(''))
        .join('')}

// Routes
const router: Router = Router();
${services
        .map(service => service.actions
        .map(action => `router.${action.method.toLowerCase()}('${service.path}${action.path}', DefaultAppMiddleware, ${utils_1.capitalize(service.name)}${utils_1.capitalize(action.name)}Middleware, ${utils_1.capitalize(service.name)}${utils_1.capitalize(action.name)}Handler);
`)
        .join(''))
        .join('')}

export default router`;
};
//# sourceMappingURL=index.js.map