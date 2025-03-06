import {GeneratorCtx} from "app/src-ssr/generator/GeneratorCtx";
import {Table} from "app/src-ssr/types/Table";
import {AbsDataTableGenerator} from "app/src-ssr/generator/FileGenerator/DataTableGenerator/AbsDataTableGenerator";

export class DataTableGenerator extends AbsDataTableGenerator {
  root: string;

  constructor(ctx: GeneratorCtx, config: Table, root: string) {
    super(ctx, config)
    this.root = root;
  }

  getFileContent(): string {
    return "";
  }

  getFilePath(): string {
    return "";
  }

  start() {

  }
}
