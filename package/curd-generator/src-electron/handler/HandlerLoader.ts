import {ipcMain} from "electron";
import {FileHandler} from "app/src-electron/handler/FileHandler/FileHandler";


export function initAllHandler() {
  return [
    FileHandler,
  ]
}

export function IpcMainRegister(config: IpcMainRegisterIC) {
  return (target: Object, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<any>) => {
    config.type(config.name, async (...args) => {
      // @ts-ignore
      return target.Instance[propertyKey].apply(target.Instance, args)
    })
  }


}


export interface IpcMainRegisterIC {
  name: string;
  type: typeof ipcMain.handle | typeof ipcMain.on;
}
