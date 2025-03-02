import {AbstractColumnsGeneratorCtx} from "app/src-ssr/generator/columns/AbstractGenerator/AbstractColumnsGeneratorCtx";
import {EntityGeneratorCxt} from "app/src-ssr/generator/instance/TableGenerator/EntityGeneratorCxt";

export class OneManyToGenerator extends AbstractColumnsGeneratorCtx {
  /** 主体内容 */
  content_string_list: Array<string> = [];

  constructor(ctx: GeneratorCtx, parent: AbstractTableGenerator, key: string, config: TableColumns) {
    super(ctx, parent, key, config);
  }


  start() {
    this.content_string_list.push(`/** ${this.config.name} */`)
    const extension = this.extension || {};


    if (this.isBackend) {
      const parent = (this.parent as EntityGeneratorCxt)
      parent.addImportFromTypeOrm("OneToMany");
      this.content_string_list.push(`@OneToMany(() => ${this.extension.relation_entity}, (target) => target.${this.extension.relation_entity_key})`)

      if (extension.relation_in_generator) {
        (this.parent as EntityGeneratorCxt).addImportFromGenerator(extension.relation_entity, extension.relation_entity, false);
      }

    }
    this.content_string_list.push(`${this.key}${this.config.nullable ? '?' : ''}: Array<${extension.relation_entity}>;`);
  }


  getString(prefix: string) {
    return this.content_string_list.map(ele => `${prefix}${ele}`).join("\n")
  }

}

