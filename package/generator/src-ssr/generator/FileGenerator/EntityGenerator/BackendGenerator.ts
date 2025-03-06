import {GeneratorCtx} from "app/src-ssr/generator/GeneratorCtx";
import {Table} from "app/src-ssr/types/Table";
import {AbsEntityGenerator} from "app/src-ssr/generator/FileGenerator/EntityGenerator/AbsEntityGenerator";

export class BackendGenerator extends AbsEntityGenerator {

  constructor(ctx: GeneratorCtx, config: Table) {
    super(ctx, config);
  }

  getFileContent(): string {
    return "";
  }

  getFilePath(): string {
    return "";
  }

  start() {

  }

  override isBackend(): boolean {
    return true;
  }

}
