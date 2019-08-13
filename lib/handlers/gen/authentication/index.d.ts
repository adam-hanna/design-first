import Design from '../types/design';
import Action from '../types/design/action';
import Service from '../types/design/service';
export declare const genAuthentication: (authenticationDir: string, design: Design) => Promise<void>;
export declare const genRouteAuthentication: (service: Service, action: Action) => string;
