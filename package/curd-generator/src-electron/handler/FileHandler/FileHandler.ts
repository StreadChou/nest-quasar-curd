import {ipcMain, dialog, type IpcMainInvokeEvent} from 'electron'
import fs from 'fs'
import {IpcMainRegister} from "app/src-electron/handler/HandlerLoader";
import {Generator} from "app/src-electron/app/Generator";
import path from "path";
import {getImportPath} from "app/src-electron/helper/PathHelper";
import {JsonFile} from "app/type/JsonFileDefine";


export class FileHandler {

  // 打开文件选择框
  @IpcMainRegister({
    name: "FileHandler.openFileDialog",
    type: ipcMain.handle,
  })
  public async openFileDialog(): Promise<string> {
    const result = await dialog.showOpenDialog({
      properties: ['openFile']
    })
    return {
      code: 0,
      data: {
        file: result.filePaths[0] as string,
      }
    }
  }


  // 打开文件夹选择框
  @IpcMainRegister({
    name: "FileHandler.openDirSelectDialog",
    type: ipcMain.handle
  })
  public async openDirSelectDialog(): Promise<string> {
    const result = await dialog.showOpenDialog({
      properties: ['openDirectory'],
    })
    // 返回第一个选中的文件路径
    return {
      code: 0,
      data: {
        dir: result.filePaths[0] as string
      }
    }
  }


  @IpcMainRegister({
    name: "FileHandler.loadJsonFile",
    type: ipcMain.handle
  })
  public async loadJsonFile(event: IpcMainInvokeEvent, _p: string) {
    if (!fs.existsSync(_p)) return {message: "文件不存在", code: 500}
    if (!_p.endsWith(".nqcurd")) return {message: "文件类型不是指定类型", code: 500}
    try {
      const str = fs.readFileSync(_p).toString();
      return {data: JSON.parse(str), code: 0};
    } catch (e) {
      return {message: "文件不是标准JSON", code: 500}
    }
  }


  @IpcMainRegister({
    name: "FileHandler.saveJsonFile",
    type: ipcMain.handle
  })
  public async saveJsonFile(event: IpcMainInvokeEvent, _p: string, string: string) {
    _p = _p || defaultJsonPath;
    fs.writeFileSync(_p, string);
    return true;
  }


  @IpcMainRegister({
    name: "FileHandler.startExport",
    type: ipcMain.handle
  })
  public async startExport(event: IpcMainInvokeEvent, target: string) {
    const json_string = fs.readFileSync(target).toString();
    const json_data: JsonFile = JSON.parse(json_string);
    const generator = new Generator(target, json_data);
    generator.start();
    generator.writeToFile();
  }

  @IpcMainRegister({
    name: "FileHandler.getImportPath",
    type: ipcMain.handle
  })
  public async getImportPath(event: IpcMainInvokeEvent, from: string, target: string) {
    const importString = getImportPath(from, target);
    return {code: 0, data: {importString}}
  }


  private static _instance: FileHandler;

  public get Instance(): FileHandler {
    if (!FileHandler._instance) FileHandler._instance = new FileHandler()
    return FileHandler._instance
  }
}
