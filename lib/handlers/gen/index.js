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
const node_emoji_1 = require("node-emoji");
const chalk_1 = require("chalk");
const ora_1 = require("ora");
const uuid_1 = require("uuid");
const design_1 = require("./types/design");
const internal_1 = require("./internal");
const authentication_1 = require("./authentication");
const authorization_1 = require("./authorization");
const context_1 = require("./context");
const handlers_1 = require("./handlers");
const middleware_1 = require("./middleware");
const emojiSupport = require('detect-emoji-support');
class argv {
    constructor(file) {
        this.file = file;
    }
}
exports.argv = argv;
exports.handler = (args) => __awaiter(this, void 0, void 0, function* () {
    let exit = 0;
    const designFile = `${process.env.PWD}/${args.file}`;
    const tmpDir = `${process.env.PWD}/tmp-${uuid_1.v4()}`; // TODO: use 'mkdtempSync'?
    const authenticationDir = `${process.env.PWD}/src/authentication`;
    const authorizationDir = `${process.env.PWD}/src/authorization`;
    const contextDir = `${process.env.PWD}/src/context`;
    const handlersDir = `${process.env.PWD}/src/handlers`;
    const internalDir = `${process.env.PWD}/src/internal`;
    const middlewareDir = `${process.env.PWD}/src/middleware`;
    const spinner = ora_1.default('Generating api...').start();
    try {
        // 1. check if design file exists
        if (yield !fs_extra_1.existsSync(designFile))
            throw `could not open ${designFile}. File does not exists`;
        // 2. load design file into object
        let design = Object.assign(new design_1.default(), JSON.parse(yield fs_extra_1.readFileSync(designFile).toString()));
        let errors = design.Validate();
        if (errors && errors.length > 0)
            throw errors.map((error) => `${error}\n`);
        // 3. generate the temporary 'internal' files
        yield internal_1.genInternal(tmpDir, design);
        // 4. remove the existing internal route files and copy over the new ones
        if (yield !fs_extra_1.existsSync(internalDir))
            throw `could not find directory './internal'. Did you '$ design-first init [name] && cd [name] && design-first gen <file>'?`;
        yield fs_extra_1.moveSync(`${tmpDir}/routes/`, `${internalDir}/routes/`, {
            overwrite: true
        });
        // 5. generate the authentication files
        yield authentication_1.genAuthentication(authenticationDir, design);
        // 6. generate the authauthorization files
        yield authorization_1.genAuthorization(authorizationDir, design);
        // 7. generate the context files
        yield context_1.genContext(contextDir, design);
        // 8. generate the handlers files
        yield handlers_1.genHandlers(handlersDir, design);
        // 9. generate the middleware files
        yield middleware_1.genMiddleware(middlewareDir, design);
        // 10. all done!
        spinner.succeed(chalk_1.default.bold.green('Done!'));
        console.log(chalk_1.default.bold.green('SUCCESS: '), `${chalk_1.default.green(`generated api from ${args.file}`)} ${emojiSupport() ? node_emoji_1.get('sunglasses') : ''}`);
    }
    catch (e) {
        spinner.fail(chalk_1.default.bold.red('Failed to generate api'));
        console.log(chalk_1.default.bold.red('ERROR: '), `${chalk_1.default.red(`could not generate api from ${args.file}`)} ${emojiSupport() ? node_emoji_1.get('ghost') : ''}`, '\n', chalk_1.default.red(e));
        exit = 1;
    }
    finally {
        try {
            if (yield fs_extra_1.existsSync(tmpDir))
                fs_extra_1.removeSync(tmpDir);
        }
        catch (e) {
            console.log(chalk_1.default.bold.red('ERROR: '), `${chalk_1.default.red(`could not remove tmp dir ${tmpDir}`)} ${emojiSupport() ? node_emoji_1.get('ghost') : ''}`, '\n', chalk_1.default.red(e));
            exit = 1;
        }
        process.exit(exit);
    }
});
//# sourceMappingURL=index.js.map