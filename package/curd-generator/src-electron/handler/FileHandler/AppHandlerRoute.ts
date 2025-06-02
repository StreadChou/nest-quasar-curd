import {contextBridge} from 'electron'
import {InvokeHelper} from "app/src-electron/handler/RendererHelper";

contextBridge.exposeInMainWorld('AppHandler', {
  createProject: (...args: any[]) => InvokeHelper("AppHandler.createProject", args),
})
