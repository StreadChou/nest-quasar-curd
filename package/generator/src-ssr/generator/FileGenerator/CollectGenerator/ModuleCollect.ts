import {AbsCollectGenerator} from "app/src-ssr/generator/FileGenerator/CollectGenerator/AbsCollectGenerator";
import {GeneratorCtx} from "app/src-ssr/generator/GeneratorCtx";
import {BackendGenerator} from "app/src-ssr/generator/FileGenerator/EntityGenerator/BackendGenerator";
import {ImportType} from "app/src-ssr/generator/FileGenerator/AbsFileGenerator";
import path from "node:path";
import {ModuleGenerator} from "app/src-ssr/generator/FileGenerator/ModuleGenerator/ModuleGenerator";

export class ModuleCollect extends AbsCollectGenerator {
  constructor(ctx: GeneratorCtx) {
    super(ctx)
  }

  getContentString(): string[] {
    let reply: string[] = [];

    reply.push(`export const ModuleList = [`)
    for (const generator of this.ctx.ModuleGenerator) {
      if (!(generator instanceof ModuleGenerator)) continue;
      reply.push(`${this.ctx.prefix}${generator.getClassName()},`)
    }
    reply.push(`]`);
    return reply;
  }


  getFileName() {
    return `module.collect.ts`
  }

  getFilePath(): string {
    return path.join(this.ctx.backend_root, `collect/${this.getFileName()}`)
  }

  start() {
    for (const generator of this.ctx.EntityGenerator) {
      if (!(generator instanceof BackendGenerator)) continue;

      for (const generator of this.ctx.ModuleGenerator) {
        if (!(generator instanceof ModuleGenerator)) continue;
        this.addImport(generator.getFilePath(), ImportType.ImportItem, generator.getClassName());
      }
    }
  }
}
