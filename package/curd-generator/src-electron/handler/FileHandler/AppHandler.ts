import {IpcMainRegister} from "app/src-electron/handler/HandlerLoader";
import {ipcMain, type IpcMainInvokeEvent} from "electron";
import path from "path";
import fs from "fs";
import {JsonFile} from "app/type/JsonFileDefine/Index";
import ts from "typescript";

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
    const stat = fs.statSync(target);
    if (stat.isDirectory()) target = path.join(target, "project.json")

    const data: JsonFile = {
      project: {
        name: name,
        created_at: Date.now(),
        updated_at: Date.now(),
      },
      collect: {
        toModulesList: true,
        toEntityList: true,
      },
      modules: {},
    }
    fs.writeFileSync(target, JSON.stringify(data, null, 2))
    return {code: 0, data: {targetPath: target, targetContent: data}}
  }

  @IpcMainRegister({
    name: "AppHandler.analysisTsExport",
    type: ipcMain.handle,
    desc: "分析TS文本的导出信息",
  })
  analysisTsExport(event: IpcMainInvokeEvent, target: string) {
    const reply = analyzeExports(target)
    return {code: 0, data: {exports: reply}}
  }

  @IpcMainRegister({
    name: "AppHandler.analysisTsFileExport",
    type: ipcMain.handle,
    desc: "分析TS文件的导出信息",
  })
  analysisTsFileExport(event: IpcMainInvokeEvent, target: string) {
    const content = fs.readFileSync(target).toString();
    const reply = analyzeExports(content)
    return {code: 0, data: {exports: reply}}
  }


  private static _instance: AppHandler;

  public get Instance(): AppHandler {
    if (!AppHandler._instance) AppHandler._instance = new AppHandler()
    return AppHandler._instance
  }
}


function analyzeExports(code: string) {
  const sourceFile = ts.createSourceFile(
    "temp.ts",
    code,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TS
  );

  const exports: { name: string; isDefault?: boolean }[] = [];

  sourceFile.forEachChild(node => {
    const isExported = node.modifiers?.some(mod => mod.kind === ts.SyntaxKind.ExportKeyword);
    const isDefault = node.modifiers?.some(mod => mod.kind === ts.SyntaxKind.DefaultKeyword);

    if (isExported) {

      // 变量声明（如 export const a = ...）
      if (ts.isVariableStatement(node)) {
        for (const declaration of node.declarationList.declarations) {
          if (ts.isIdentifier(declaration.name)) {
            exports.push({
              name: declaration.name.text,
              isDefault
            });
          }
        }
      }

      // 函数、类、接口等
      else if (
        ts.isFunctionDeclaration(node) ||
        ts.isClassDeclaration(node) ||
        ts.isInterfaceDeclaration(node) ||
        ts.isEnumDeclaration(node) ||
        ts.isTypeAliasDeclaration(node)
      ) {
        if (node.name) {
          exports.push({
            name: node.name.text,
            isDefault
          });
        }
      }
    }

    // 处理 `export { a, b }`
    if (ts.isExportDeclaration(node) && node.exportClause && ts.isNamedExports(node.exportClause)) {
      for (const element of node.exportClause.elements) {
        const name = element.name.text;
        exports.push({name});
      }
    }
  });

  return exports;
}
