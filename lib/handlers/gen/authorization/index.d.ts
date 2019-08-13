import Design from '../types/design';
import Action from '../types/design/action';
import Service from '../types/design/service';
export declare const genAuthorization: (authorizationDir: string, design: Design) => Promise<void>;
export declare const genRouteAuthorization: (service: Service, action: Action) => string;
