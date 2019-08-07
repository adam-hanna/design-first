import Service from '../types/design/service';
import Action from '../types/design/action';
import Design from '../types/design';
export declare const genAuthorization: (authorizationDir: string, design: Design) => Promise<void>;
export declare const genRouteAuthorization: (service: Service, action: Action) => string;
