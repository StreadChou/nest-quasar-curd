import {AbstractTableGenerator} from "app/src-ssr/generator/instance/AbstractGenerator/AbstractTableGenerator";
import {Table, TableColumns} from "app/src-ssr/types/Table";
import {GeneratorCtx} from "app/src-ssr/generator/GeneratorCtx";
import path from "node:path";
import {writeToFile} from "app/src-ssr/app/PathHelper";
import {AbstractColumnsGeneratorCtx} from "app/src-ssr/generator/columns/AbstractGenerator/AbstractColumnsGeneratorCtx";

export class InterfaceGeneratorCxt extends AbstractTableGenerator {
  columnsGenerator: AbstractColumnsGeneratorCtx[] = [];
  /** 主体内容 */
  content_string_list: Array<string> = [];

  constructor(ctx: GeneratorCtx, config: Table) {
    super(ctx, config);

    this.addColumnsGenerator();
  }

  /** Interface的类名: export出去的类名 */
  getClassName() {
    return this.config.ClassName;
  }

  /** 导出的文件名字 */
  getFileName() {
    return `${this.getClassName()}.ts`
  }

  /** 文件的路径 */
  getFilePath() {
    return path.join(this.ctx.frontend_root, `entities/${this.getFileName()}`)
  }

  start() {
    this.content_string_list.push(`/** ${this.config.Name} */`)
    this.content_string_list.push(`export interface ${this.config.ClassName} {`)

    this.content_string_list.push(`}`)


    const import_string = this.getImportStringList().join("\n")
    const content_string = this.content_string_list.join("\n")
    const content = `${import_string}\n\n${content_string}`;
    writeToFile(this.getFilePath(), content);
  }

  getImportStringList() {
    return [];
  }


  override isBackend(): boolean {
    return false;
  }

  override isFrontend(): boolean {
    return true;
  }
}
