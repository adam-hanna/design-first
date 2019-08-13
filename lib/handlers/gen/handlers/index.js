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
exports.genHandlers = (handlersDir, design) => __awaiter(this, void 0, void 0, function* () {
    if (yield !fs_extra_1.existsSync(handlersDir))
        throw `could not find directory './context'. Did you '$ design-first init [name] && cd [name] && design-first gen <file>'?`;
    for (const service of design.services) {
        const servicePath = `${handlersDir}/${service.name.toLowerCase()}`;
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
            yield fs_extra_1.writeFileSync(actionFile, exports.genRouteHandler(actionPath, service, action));
        }
    }
});
exports.genRouteHandler = (actionPath, service, action) => {
    return `import appContext from '../../../context/app';
import { HttpReturn } from 'design-first';
import requestContext from '../../../context/request/${service.name.toLowerCase()}/${action.name.toLowerCase()}';
import {${action.response
        ? `
  ${action.response},`
        : ''}${action.payload
        ? `
  ${action.payload},`
        : ''}
} from '../../../models';

export const Handler = async (appCtx: appContext, requestCtx: requestContext${action.payload ? `, payload: ${action.payload}` : ''}): Promise<HttpReturn> => {
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
//# sourceMappingURL=index.js.map