import {contextBridge, webUtils} from 'electron'
import {InvokeHelper} from "app/src-electron/handler/RendererHelper";

contextBridge.exposeInMainWorld('FileHandler', {
  openFileDialog: (...args: any[]) => InvokeHelper("FileHandler.openFileDialog", args),
  openDirSelectDialog: (...args: any[]) => InvokeHelper("FileHandler.openDirSelectDialog", args),
  loadJsonFile: (...args: any[]) => InvokeHelper("FileHandler.loadJsonFile", args),
  saveJsonFile: (...args: any[]) => InvokeHelper("FileHandler.saveJsonFile", args),
  startExport: (...args: any[]) => InvokeHelper("FileHandler.startExport", args),
  getPathForFile: (file: File) => {
    return webUtils.getPathForFile(file)
  }
})
