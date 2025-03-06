import {AbsPackageGenerator} from "app/src-ssr/generator/FileGenerator/PackageGenerator/AbsPackageGenerator";
import {GeneratorCtx} from "app/src-ssr/generator/GeneratorCtx";
import path from "node:path";

export class CurdServiceGenerator extends AbsPackageGenerator {

  constructor(ctx: GeneratorCtx) {
    super(ctx);
  }

  getFileContent(): string {
    return this.ctx.jsonData?.templates?.CurdServices || "";
  }

  /** 导出的文件名字 */
  getFileName() {
    return `CurdService.ts`
  }

  getFilePath(): string {
    return path.join(this.ctx.backend_root, `package/${this.getFileName()}`)
  }

  start(): void {

  }

}
