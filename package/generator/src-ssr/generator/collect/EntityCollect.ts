import {AbstractCollect} from "app/src-ssr/generator/collect/AbstractCollect";
import {GeneratorCtx} from "app/src-ssr/generator/GeneratorCtx";
import path from "node:path";
import fs from "node:fs";
import {EntityGeneratorCxt} from "app/src-ssr/generator/instance/TableGenerator/EntityGeneratorCxt";
import {getTwoTsFileImportPath, writeToFile} from "app/src-ssr/app/PathHelper";

export class EntityCollect extends AbstractCollect {
  import_string_list: Array<string> = [];
  content_string_list: Array<string> = [];

  constructor(ctx: GeneratorCtx) {
    super(ctx);
    this.start();
  }

  get fileName() {
    return `entity.collect.ts`
  }

  get filePath() {
    return path.join(this.ctx.backend_root, `${this.fileName}`)
  }

  get dirPath() {
    return path.dirname(this.filePath);
  }

  start() {
    this.content_string_list.push(`export const EntityList = [`)
    for (const generator of this.ctx.tablesGenerator) {
      if (!(generator instanceof EntityGeneratorCxt)) continue;
      const importPath = getTwoTsFileImportPath(this.filePath, generator.getFilePath())
      this.import_string_list.push(`import { ${generator.config.ClassName} } from '${importPath}';`)

      this.content_string_list.push(`${this.ctx.prefix}/** ${generator.config.Name} */`)
      this.content_string_list.push(`${this.ctx.prefix}${generator.config.ClassName},`)
    }
    this.content_string_list.push(`]`);


    const import_string = this.import_string_list.join("\n")
    const content_string = this.content_string_list.join("\n")
    const content = `${import_string}\n\n${content_string}`;

    writeToFile(this.filePath, content);
  }


}
