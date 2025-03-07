import {AbsColumnsGeneratorCtx} from "app/src-ssr/generator/ColumnGenerator/AbsColumnsGeneratorCtx";
import {AbsEntityGenerator} from "app/src-ssr/generator/FileGenerator/EntityGenerator/AbsEntityGenerator";
import {GeneratorCtx} from "app/src-ssr/generator/GeneratorCtx";
import {TableColumns} from "app/src-ssr/types/Table";
import {ImportType} from "app/src-ssr/generator/FileGenerator/AbsFileGenerator";

export class OneManyToGenerator extends AbsColumnsGeneratorCtx {
  /** 主体内容 */
  content_string_list: Array<string> = [];

  constructor(ctx: GeneratorCtx, parent: AbsEntityGenerator, key: string, config: TableColumns) {
    super(ctx, parent, key, config);
  }


  start() {
    this.content_string_list.push(`/** ${this.config.name} */`)
    const extension = this.extension || {};


    if (this.isBackend) {
      this.parent.addTypeOrm("OneToMany")
      this.content_string_list.push(`@OneToMany(() => ${this.extension.relation_entity}, (target) => target.${this.extension.relation_entity_key})`)
    }
    if (extension.relation_in_generator) {
      this.parent.addImportFromGenerator(extension.relation_entity as string, this.env, extension.relation_entity as string, ImportType.ImportItem);
    }
    this.content_string_list.push(`${this.key}${this.config.nullable ? '?' : ''}: Array<${extension.relation_entity}>;`);
  }


  getString(prefix: string) {
    return this.content_string_list.map(ele => `${prefix}${ele}`).join("\n")
  }

}

