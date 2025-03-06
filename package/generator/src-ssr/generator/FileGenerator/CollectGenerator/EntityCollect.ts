import {AbsCollectGenerator} from "app/src-ssr/generator/FileGenerator/CollectGenerator/AbsCollectGenerator";
import {GeneratorCtx} from "app/src-ssr/generator/GeneratorCtx";

export class EntityCollect extends AbsCollectGenerator {
  constructor(ctx: GeneratorCtx) {
    super(ctx)
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
