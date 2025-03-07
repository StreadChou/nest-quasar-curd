import {AbsFileGenerator} from "app/src-ssr/generator/FileGenerator/AbsFileGenerator";
import {GeneratorCtx} from "app/src-ssr/generator/GeneratorCtx";

export abstract class AbsPackageGenerator extends AbsFileGenerator {
  constructor(ctx: GeneratorCtx) {
    super(ctx);
    this.ctx = ctx;
  }
}
