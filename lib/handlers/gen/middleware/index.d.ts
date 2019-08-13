import Design from '../types/design';
import Action from '../types/design/action';
import Service from '../types/design/service';
export declare const genMiddleware: (middlewareDir: string, design: Design) => Promise<void>;
export declare const genRouteMiddleware: (actionPath: string, service: Service, action: Action) => string;
