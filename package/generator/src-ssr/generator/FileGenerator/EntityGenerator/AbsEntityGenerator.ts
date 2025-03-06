import {GeneratorCtx} from "app/src-ssr/generator/GeneratorCtx";
import {Table} from "app/src-ssr/types/Table";
import {AbsFileGenerator} from "app/src-ssr/generator/FileGenerator/AbsFileGenerator";

export abstract class AbsEntityGenerator extends AbsFileGenerator {
  ctx: GeneratorCtx;
  config: Table;

  constructor(ctx: GeneratorCtx, config: Table) {
    super();
    this.ctx = ctx;
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

}
