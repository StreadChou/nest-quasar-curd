import {AbsPackageGenerator} from "app/src-ssr/generator/FileGenerator/PackageGenerator/AbsPackageGenerator";
import {GeneratorCtx} from "app/src-ssr/generator/GeneratorCtx";
import path from "node:path";

export class RequestConstantGenerator extends AbsPackageGenerator {
  type: "frontend" | "backend"

  constructor(ctx: GeneratorCtx, type: "frontend" | "backend") {
    super(ctx);
    this.type = type;
  }

  getFileContent(): string {
    return this.ctx.jsonData?.templates?.RequestConstant || "";
  }

  /** 导出的文件名字 */
  getFileName() {
    return `RequestConstant.ts`
  }

  getFilePath(): string {
    if (this.type == "frontend") {
      return path.join(this.ctx.frontend_root, `package/${this.getFileName()}`)
    }
    if (this.type == "backend") {
      return path.join(this.ctx.backend_root, `package/${this.getFileName()}`)
    }
    return "";
  }

  start(): void {

  }

}

