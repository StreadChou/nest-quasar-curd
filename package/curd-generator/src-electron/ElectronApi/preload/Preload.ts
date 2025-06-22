import {contextBridge, ipcRenderer} from "electron";

contextBridge.exposeInMainWorld('Electron', {
  Request: (route: string, data: any) => ipcRenderer.invoke('Electron:Request', {route, data})
});
