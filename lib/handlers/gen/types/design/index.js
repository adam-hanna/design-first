"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = require("http");
class default_1 {
    Validate() {
        const reg = /^[a-z]+$/i;
        let errors = [];
        let serviceNames = [];
        let routes = [];
        if (this.services.length == 0)
            errors.push('services cannot be empty');
        for (const service of this.services) {
            if (service.name.length === 0)
                errors.push('service names must contain at least one character');
            if (!reg.test(service.name))
                errors.push(`${service.name} service can only contain english alphabetical characters`);
            if (serviceNames.indexOf(service.name.toLowerCase()) !== -1)
                errors.push(`duplicate service names: ${service.name.toLowerCase()}`);
            serviceNames.push(service.name.toLowerCase());
            if (service.path.length === 0 || service.path.charAt(0) !== '/')
                errors.push(`path for ${service.name} service must start with a forward slash '/'`);
            if (service.actions.length == 0)
                errors.push(`actions cannot be empty for ${service.name} service`);
            let actions = [];
            for (const action of service.actions) {
                if (action.name.length === 0)
                    errors.push(`all action names in ${service.name} service must contain at least one character`);
                if (!reg.test(action.name))
                    errors.push(`${action.name} action in ${service.name} service can only contain english alphabetical characters`);
                if (actions.indexOf(action.name.toLowerCase()) !== -1)
                    errors.push(`duplication action names in ${service.name} service: ${action.name}`);
                actions.push(action.name.toLowerCase());
                if (action.method.length === 0 ||
                    http_1.METHODS.indexOf(action.method.toUpperCase()) === -1)
                    errors.push(`${action.method} is not a valid http method in ${action.name} action of ${service.name} service`);
                if (action.path.length > 0 && action.path.charAt(0) !== '/')
                    errors.push(`path for ${action.name} action of ${service.name} service must start with a forward slash '/'`);
                const route = `${action.method.toUpperCase()} ${service.path.toLowerCase()}${action.path.toLowerCase()}`;
                if (routes.indexOf(route) !== -1)
                    errors.push(`duplicate routes: ${route}`);
                routes.push(route);
                if (action.payload)
                    if (!reg.test(action.payload))
                        errors.push(`${action.payload} payload in ${action.name} action in ${service.name} service can only contain english alphabetical characters`);
                if (action.response)
                    if (!reg.test(action.response))
                        errors.push(`${action.response} response in ${action.name} action in ${service.name} service can only contain english alphabetical characters`);
            }
        }
        return errors;
    }
    Valid() {
        let errors = this.Validate();
        return !errors || errors.length == 0;
    }
}
exports.default = default_1;
//# sourceMappingURL=index.js.map