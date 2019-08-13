import Design from '../types/design';
import Action from '../types/design/action';
import Service from '../types/design/service';
export declare const genHandlers: (handlersDir: string, design: Design) => Promise<void>;
export declare const genRouteHandler: (actionPath: string, service: Service, action: Action) => string;
