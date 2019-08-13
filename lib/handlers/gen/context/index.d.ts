import Design from '../types/design';
import Action from '../types/design/action';
import Service from '../types/design/service';
export declare const genContext: (contextDir: string, design: Design) => Promise<void>;
export declare const genRouteContext: (actionPath: string, service: Service, action: Action) => string;
