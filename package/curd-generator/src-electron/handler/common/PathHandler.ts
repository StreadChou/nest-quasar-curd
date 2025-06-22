import type {IpcMainInvokeEvent} from 'electron';
import {Request} from "app/src-electron/ElectronApi/electron/Decorator";
import {getTwoTsFileImportPath} from "app/src-electron/helper/PathHelper";

export class PathHandler {

  @Request({
    desc: "获取target相对于from的路径"
  })
  getRelativePath(event: IpcMainInvokeEvent, data: { from: string, target: string }) {
    console.log(data)
    return getTwoTsFileImportPath(data.from, data.target, false)
  }

}
