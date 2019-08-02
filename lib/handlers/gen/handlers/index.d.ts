import Service from '../types/design/service';
import Action from '../types/design/action';
import Design from '../types/design';
export declare const genHandlers: (handlersDir: string, design: Design) => Promise<void>;
export declare const genRouteHandler: (actionPath: string, service: Service, action: Action) => string;
