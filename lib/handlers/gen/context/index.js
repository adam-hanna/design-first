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
exports.genContext = (contextDir, design) => __awaiter(this, void 0, void 0, function* () {
    if (yield !fs_extra_1.existsSync(contextDir))
        throw `could not find directory './context'. Did you '$ design-first init [name] && cd [name] && design-first gen <file>'?`;
    for (const service of design.services) {
        const servicePath = `${contextDir}/request/${service.name.toLowerCase()}`;
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
            yield fs_extra_1.writeFileSync(actionFile, exports.genRouteContext(actionPath, service, action));
        }
    }
});
exports.genRouteContext = (actionPath, service, action) => {
    return `import defaultRequestContext from '../../../request';

export default class extends defaultRequestContext {

}`;
};
//# sourceMappingURL=index.js.map