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
const routes_1 = require("./routes");
exports.genInternal = (tmpDir, design) => __awaiter(this, void 0, void 0, function* () {
    const routePath = `${tmpDir}/routes`;
    yield fs_extra_1.mkdirSync(tmpDir);
    yield fs_extra_1.mkdirSync(routePath);
    for (const service of design.services) {
        const servicePath = `${routePath}/${service.name.toLowerCase()}`;
        yield fs_extra_1.mkdirSync(servicePath);
        for (const action of service.actions) {
            const actionPath = `${servicePath}/${action.name.toLowerCase()}`;
            yield fs_extra_1.mkdirSync(actionPath);
            yield fs_extra_1.writeFileSync(`${actionPath}/index.ts`, routes_1.genRouteAction(service, action));
        }
    }
    yield fs_extra_1.writeFileSync(`${routePath}/index.ts`, routes_1.genRouteIndex(design.services));
});
//# sourceMappingURL=index.js.map