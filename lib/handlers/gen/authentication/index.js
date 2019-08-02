"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_extra_1 = require("fs-extra");
const chalk_1 = require("chalk");
exports.genAuthentication = (authenticationDir, design) => __awaiter(this, void 0, void 0, function* () {
    if (yield !fs_extra_1.existsSync(authenticationDir))
        yield fs_extra_1.mkdirSync(authenticationDir);
    for (const service of design.services) {
        const servicePath = `${authenticationDir}/${service.name.toLowerCase()}`;
        if (yield !fs_extra_1.existsSync(servicePath))
            yield fs_extra_1.mkdirSync(servicePath);
        for (const action of service.actions) {
            const actionPath = `${servicePath}/${action.name.toLowerCase()}`;
            if (yield !fs_extra_1.existsSync(actionPath))
                yield fs_extra_1.mkdirSync(actionPath);
            const actionFile = `${actionPath}/index.ts`;
            if (yield fs_extra_1.existsSync(actionFile)) {
                console.log(chalk_1.default.bold.yellow('WARNING: '), chalk_1.default.yellow(`'${actionPath}/index.ts' exists. Skipping`));
                continue;
            }
            yield fs_extra_1.writeFileSync(actionFile, exports.genRouteAuthentication(actionPath, service, action));
        }
    }
});
exports.genRouteAuthentication = (actionPath, service, action) => {
    return `import { Request, Response } from 'express';
import appContext from '../../../context/app';
import requestContext from '../../../context/request/${actionPath}';
import { HttpReturn } from '../../../internal/utils';
${action.payload
        ? `import { ${action.payload} } from '../../../models';
`
        : ''}
export default async (
  appCtx: appContext,
  requestCtx: requestContext,${action.payload
        ? `
  payload: ${action.payload},`
        : ''}
  req: Request,
  res: Response,
): Promise<HttpReturn | void> => {

}`;
};
//# sourceMappingURL=index.js.map