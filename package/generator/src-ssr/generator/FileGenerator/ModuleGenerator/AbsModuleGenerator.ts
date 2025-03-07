import {AbsFileGenerator} from "app/src-ssr/generator/FileGenerator/AbsFileGenerator";
import {GeneratorCtx} from "app/src-ssr/generator/GeneratorCtx";
import {Module} from "app/src-ssr/types/Module";
import path from "node:path";

export abstract class AbsModuleGenerator extends AbsFileGenerator {
  config: Module

  constructor(ctx: GeneratorCtx, config: Module) {
    super(ctx);
    this.config = config;
  }


  getFilePath(): string {
    return path.join(this.ctx.backend_root, `modules/${this.config.name}.ts`)
  }
}
