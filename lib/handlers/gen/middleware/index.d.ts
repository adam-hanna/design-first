import Service from '../types/design/service';
import Action from '../types/design/action';
import Design from '../types/design';
export declare const genMiddleware: (middlewareDir: string, design: Design) => Promise<void>;
export declare const genRouteMiddleware: (actionPath: string, service: Service, action: Action) => string;
