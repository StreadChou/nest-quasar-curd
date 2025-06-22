import type {IpcMainInvokeEvent} from 'electron';

export interface RequestIC {
  desc?: string;
}

type HandlerFn = (event: IpcMainInvokeEvent, data: any) => Promise<any> | any;

export const Inject: Record<string, HandlerFn> = {};


export function Request(config?: Partial<RequestIC>) {
  return (target: any, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) => {
    const originalMethod = descriptor.value;
    if (typeof originalMethod !== 'function') {
      throw new Error('Request decorator can only be used on methods');
    }

    const className = target.constructor.name;
    const route = `${className}.${propertyKey}`;

    const boundMethod = originalMethod.bind(target);

    if (Inject[route]) {
      throw new Error(`Duplicate route detected: ${route}`);
    }

    Inject[route] = boundMethod;
  };
}
