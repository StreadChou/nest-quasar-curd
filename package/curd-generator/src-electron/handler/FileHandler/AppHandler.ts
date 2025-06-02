import {IpcMainRegister} from "app/src-electron/handler/HandlerLoader";
import {ipcMain, type IpcMainInvokeEvent} from "electron";
import path from "path";
import {JsonFile} from "app/type/JsonFileDefine";
import fs from "fs";

export class AppHandler {
  @IpcMainRegister({
    name: "AppHandler.selectProjectDir",
    type: ipcMain.handle,
    desc: "选择项目目录",
  })
  selectProjectDir() {

  }

  @IpcMainRegister({
    name: "AppHandler.createProject",
    type: ipcMain.handle,
    desc: "创建一个项目",
  })
  createProject(event: IpcMainInvokeEvent, target: string, name: string) {
    const target_json_path = path.join(target, "project.nqcurd")
    const data: JsonFile = {
      name: name,
      created_at: Date.now(),
      updated_at: Date.now(),
      modules: {},
    }
    fs.writeFileSync(target_json_path, JSON.stringify(data, null, 2))
    return {code: 0, data: {targetPath: target_json_path, targetContent: data}}
  }

  private static _instance: AppHandler;

  public get Instance(): AppHandler {
    if (!AppHandler._instance) AppHandler._instance = new AppHandler()
    return AppHandler._instance
  }
}
