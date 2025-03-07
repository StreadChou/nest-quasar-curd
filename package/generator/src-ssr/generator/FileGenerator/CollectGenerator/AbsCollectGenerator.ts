import {AbsFileGenerator} from "app/src-ssr/generator/FileGenerator/AbsFileGenerator";
import {GeneratorCtx} from "app/src-ssr/generator/GeneratorCtx";

export abstract class AbsCollectGenerator extends AbsFileGenerator {

  constructor(ctx: GeneratorCtx) {
    super(ctx);
  }

  abstract getContentString(): string[];


  getFileContent(): string {
    // 附加导入
    const import_string = this.getImportStringList();
    // 实体
    const content_string = this.getContentString();

    let reply: string[] = [];
    reply = reply.concat(import_string)
    reply.push(`\n`)
    reply = reply.concat(content_string)

    return reply.join("\n");
  }

}
