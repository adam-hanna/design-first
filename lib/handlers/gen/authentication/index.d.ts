import Service from '../types/design/service';
import Action from '../types/design/action';
import Design from '../types/design';
export declare const genAuthentication: (authenticationDir: string, design: Design) => Promise<void>;
export declare const genRouteAuthentication: (actionPath: string, service: Service, action: Action) => string;
