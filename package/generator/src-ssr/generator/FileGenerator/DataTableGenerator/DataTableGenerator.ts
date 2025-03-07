import {GeneratorCtx} from "app/src-ssr/generator/GeneratorCtx";
import {Table} from "app/src-ssr/types/Table";
import {AbsDataTableGenerator} from "app/src-ssr/generator/FileGenerator/DataTableGenerator/AbsDataTableGenerator";

export class DataTableGenerator extends AbsDataTableGenerator {


  constructor(ctx: GeneratorCtx, config: Table, env: "backend" | "frontend") {
    super(ctx, config, env)
  }

  /** 导出的文件名字 */
  getFileName() {
    return `${this.config.ClassName}Constants.ts`
  }

  start() {

  }
}
