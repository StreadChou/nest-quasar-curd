import {ElectronError} from "src/app/ElectronApi/ElectronError";

export async function ElectronRequest(route: string, data: any): Promise<any> {
  // @ts-ignore
  const reply = await window.Electron.Request(route, data);
  if (reply.code === 0) return reply.data;
  throw new ElectronError(reply.message, reply.code, reply.data, reply.stack);
}
