import {GeneratorCtx} from "app/src-ssr/generator/GeneratorCtx";
import {Table} from "app/src-ssr/types/Table";
import {AbsEntityGenerator} from "app/src-ssr/generator/FileGenerator/EntityGenerator/AbsEntityGenerator";
import path from "node:path";
import {AbsColumnsGeneratorCtx} from "app/src-ssr/generator/ColumnGenerator/AbsColumnsGeneratorCtx";

export class BackendGenerator extends AbsEntityGenerator {
  columnsGenerator: AbsColumnsGeneratorCtx[] = [];

  constructor(ctx: GeneratorCtx, config: Table) {
    super(ctx, config);
    this.addColumnsGenerator();
  }

  /** 文件的路径 */
  getFilePath() {
    return path.join(this.ctx.backend_root, `entities/${this.getFileName()}`)
  }

  getDbTableName() {
    if (this.config.DbTableName) return this.config.DbTableName;
    return this.getClassName();
  }

  getEntityStringList(): string[] {
    let reply: string[] = [];

    this.addTypeOrm("Entity");

    // 附加entity
    reply.push(`/** ${this.config.Name} */`)
    reply.push(`@Entity({name: "${this.getDbTableName()}"})`)
    reply.push(`export class ${this.getClassName()} {\n\n`)

    // 附加字段
    const columns_string_list = this.getColumnsStringList();
    reply = reply.concat(columns_string_list);

    reply.push(`\n\n}`)

    return reply;

  }

  getFileContent(): string {
    // 实体
    const content_string = this.getEntityStringList();
    // 附加导入
    const import_string = this.getImportStringList();

    let reply: string[] = [];
    reply = reply.concat(import_string)
    reply.push(`\n\n`)
    reply = reply.concat(content_string)


    return reply.join("\n");
  }

  override isBackend(): boolean {
    return true;
  }

}
