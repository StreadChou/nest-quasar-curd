import {AbsFileGenerator} from "app/src-ssr/generator/FileGenerator/AbsFileGenerator";
import {GeneratorCtx} from "app/src-ssr/generator/GeneratorCtx";

export abstract class AbsCollectGenerator extends AbsFileGenerator {

  constructor(ctx: GeneratorCtx) {
    super(ctx);
  }
}
