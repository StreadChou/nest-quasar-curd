import {AbstractTableGenerator} from "app/src-ssr/generator/instance/AbstractGenerator/AbstractTableGenerator";
import {Table} from "app/src-ssr/types/Table";
import {GeneratorCtx} from "app/src-ssr/generator/GeneratorCtx";
import path from "node:path";
import {writeToFile} from "app/src-ssr/app/PathHelper";
import {AbstractColumnsGeneratorCtx} from "app/src-ssr/generator/columns/AbstractGenerator/AbstractColumnsGeneratorCtx";

export class EntityGeneratorCxt extends AbstractTableGenerator {
  columnsGenerator: AbstractColumnsGeneratorCtx[] = [];
  /** 从包里的导入的内容 */
  importFromPackage: Record<string, Set<string>> = {};

  /** 主体内容 */
  content_string_list: Array<string> = [];

  constructor(ctx: GeneratorCtx, config: Table) {
    super(ctx, config);
    this.addColumnsGenerator();

    this.start();
  }

  /** Entity的类名: export出去的类名 */
  getClassName() {
    return this.config.ClassName;
  }

  /** 导出的文件名字 */
  getFileName() {
    return `${this.getClassName()}.ts`
  }

  /** 文件的路径 */
  getFilePath() {
    return path.join(this.ctx.backend_root, `entities/${this.getFileName()}`)
  }


  start() {
    this.addImportFromTypeOrm("Entity")
    this.content_string_list.push(`/** ${this.config.Name} */`)
    this.content_string_list.push(`@Entity({name: "__System__Task"})`)
    this.content_string_list.push(`export class ${this.config.ClassName} {\n\n`)

    // 附加字段
    const columns_string_list = this.getColumnsStringList();
    this.content_string_list.push(columns_string_list.join("\n\n"));

    this.content_string_list.push(`\n\n}`)


    const import_string = this.getImportStringList().join("\n")
    const content_string = this.content_string_list.join("\n")
    const content = `${import_string}\n\n${content_string}`;
    writeToFile(this.getFilePath(), content);
  }


  /** 获取import的字段 */
  getImportStringList() {
    let stringList: string[] = [];
    for (const pkg in this.importFromPackage) {
      if (!this.importFromPackage[pkg] || this.importFromPackage[pkg].size <= 0) continue;
      const items = Array.from(this.importFromPackage[pkg]);
      stringList.push(`import {${items.join(", ")}} from "${pkg}";`)
    }
    return stringList;
  }


  getColumnsStringList() {
    const list: string[] = [];
    for (const generator of this.columnsGenerator) {
      list.push(generator.getString(this.ctx.prefix))
    }
    return list;
  }


  /** 增加从typeorm的导入 */
  addImportFromTypeOrm(items: string[] | string) {
    this.addImportFromPackage("typeorm", items);
  }

  /** 增加从包里的导入 */
  addImportFromPackage(pkg: string, items: string[] | string) {
    this.importFromPackage[pkg] = this.importFromPackage[pkg] || new Set();
    const item = typeof items === "string" ? [items] : items;
    item.forEach(e => this.importFromPackage[pkg]?.add(e))
  }

  override isBackend(): boolean {
    return true;
  }

  override isFrontend(): boolean {
    return false;
  }


}
