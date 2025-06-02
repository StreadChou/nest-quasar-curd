import {ipcMain, dialog, type IpcMainInvokeEvent} from 'electron'
import fs from 'fs'
import {IpcMainRegister} from "app/src-electron/handler/HandlerLoader";
import {Generator} from "app/src-electron/app/Generator";
import path from "path";


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
    return result.filePaths[0] as string// 返回第一个选中的文件路径
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
  public async startExport(event: IpcMainInvokeEvent, info: string) {
    const data: { json_file_path: string, backend_path: string, frontend_path: string } = JSON.parse(info);
    const generator = new Generator(data);
    generator.start();
    generator.writeToFile();
  }


  private static _instance: FileHandler;

  public get Instance(): FileHandler {
    if (!FileHandler._instance) FileHandler._instance = new FileHandler()
    return FileHandler._instance
  }
}
