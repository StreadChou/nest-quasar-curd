import {AbsCollectGenerator} from "app/src-ssr/generator/FileGenerator/CollectGenerator/AbsCollectGenerator";
import {GeneratorCtx} from "app/src-ssr/generator/GeneratorCtx";
import {BackendGenerator} from "app/src-ssr/generator/FileGenerator/EntityGenerator/BackendGenerator";
import {ImportType} from "app/src-ssr/generator/FileGenerator/AbsFileGenerator";
import path from "node:path";

export class EntityCollect extends AbsCollectGenerator {
  constructor(ctx: GeneratorCtx) {
    super(ctx)
  }


  getContentString(): string[] {
    let reply: string[] = [];

    reply.push(`export const EntityList = [`)
    for (const generator of this.ctx.EntityGenerator) {
      if (!(generator instanceof BackendGenerator)) continue;

      reply.push(`${this.ctx.prefix}/** ${generator.config.Name} */`)
      reply.push(`${this.ctx.prefix}${generator.config.ClassName},`)
    }
    reply.push(`]`);
    return reply;
  }


  getFileName() {
    return `entity.collect.ts`
  }

  getFilePath(): string {
    return path.join(this.ctx.backend_root, `collect/${this.getFileName()}`)
  }

  start() {
    for (const generator of this.ctx.EntityGenerator) {
      if (!(generator instanceof BackendGenerator)) continue;

      this.addImport(generator.getFilePath(), ImportType.ImportItem, generator.getClassName());
    }
  }
}
