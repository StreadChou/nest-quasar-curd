import {GeneratorCtx} from "app/src-ssr/generator/GeneratorCtx";
import {Table, TableColumns} from "app/src-ssr/types/Table";
import {AbsFileGenerator} from "app/src-ssr/generator/FileGenerator/AbsFileGenerator";
import {AbsColumnsGeneratorCtx} from "app/src-ssr/generator/ColumnGenerator/AbsColumnsGeneratorCtx";
import {ColumnsGeneratorFactory} from "app/src-ssr/generator/ColumnGenerator/ColumnsGeneratorFactory";

export abstract class AbsEntityGenerator extends AbsFileGenerator {
  abstract columnsGenerator: AbsColumnsGeneratorCtx[];
  config: Table;

  constructor(ctx: GeneratorCtx, config: Table) {
    super(ctx);
    this.config = config;
  }

  /** Entity是否给后端 */
  public isBackend() {
    return false;
  }

  /** Entity是否给前端端 */
  public isFrontend() {
    return false;
  }

  /** Entity的类名: export出去的类名 */
  getClassName() {
    return this.config.ClassName;
  }

  /** 导出的文件名字 */
  getFileName() {
    return `${this.getClassName()}.ts`
  }

  start() {
    for (const generator of this.columnsGenerator) {
      generator.start();
    }
  }


  addColumnsGenerator() {
    let columns = Object.entries(this.config.columns).map(([key, value]) => ({key, value}));
    columns = columns.sort((A, B) => (A.value?.sort || 0) - (B.value?.sort || 0))
    for (const item of columns) {
      const instance = ColumnsGeneratorFactory(this.ctx, this, item.key, item.value as TableColumns)
      if (!instance) continue;

      this.columnsGenerator.push(instance)
    }
  }

  getColumnsStringList() {
    const list: string[] = [];
    for (const generator of this.columnsGenerator) {
      list.push(generator.getString(this.ctx.prefix))
    }
    return list;
  }
}
