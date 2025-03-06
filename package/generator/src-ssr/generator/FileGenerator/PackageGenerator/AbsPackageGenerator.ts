import {AbsFileGenerator} from "app/src-ssr/generator/FileGenerator/AbsFileGenerator";
import {GeneratorCtx} from "app/src-ssr/generator/GeneratorCtx";

export abstract class AbsPackageGenerator extends AbsFileGenerator {
  ctx: GeneratorCtx

  constructor(ctx: GeneratorCtx) {
    super();
    this.ctx = ctx;
  }
}
