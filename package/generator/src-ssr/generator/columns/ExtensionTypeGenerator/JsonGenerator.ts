import {AbstractColumnsGeneratorCtx} from "app/src-ssr/generator/columns/AbstractGenerator/AbstractColumnsGeneratorCtx";
import {GeneratorCtx} from "app/src-ssr/generator/GeneratorCtx";
import {AbstractTableGenerator} from "app/src-ssr/generator/instance/AbstractGenerator/AbstractTableGenerator";
import {TableColumns} from "app/src-ssr/types/Table";
import {EntityGeneratorCxt} from "app/src-ssr/generator/instance/TableGenerator/EntityGeneratorCxt";

// 创建Json类型的字段生成器
export class JsonGenerator extends AbstractColumnsGeneratorCtx {
  /** 主体内容 */
  content_string_list: Array<string> = [];

  constructor(ctx: GeneratorCtx, parent: AbstractTableGenerator, key: string, config: TableColumns) {
    super(ctx, parent, key, config);
  }


  start() {
    this.content_string_list.push(`/** ${this.config.name} */`)
    const extension = this.extension || {};
    let {type_string, need_import, type_import} = extension;
    if (need_import) {
      type_import = type_import || [];
      for (const item of type_import) {
        switch (item.type) {
          case "customer": {
            break;
          }
          case "generator": {
            if (this.parent.isBackend()) {
              const res = (this.parent as EntityGeneratorCxt).addImportFromGenerator(item.from as string, item.value as string, item.default as boolean)
              console.log(res);
            }
            if (this.parent.isFrontend()) {
              // (this.parent as InterfaceGeneratorCxt).addImportFromGenerator(item.from as string,)
            }

            break;
          }
          case "url": {
            break;
          }
        }
      }
    }

    if (this.isBackend) {
      const parent = (this.parent as EntityGeneratorCxt)
      parent.addImportFromTypeOrm("CreateDateColumn");
      this.content_string_list.push(`@CreateDateColumn()`)
    }
    this.content_string_list.push(`${this.key}${this.config.nullable ? '?' : ''}: ${type_string};`);
  }


  getString(prefix: string) {
    return this.content_string_list.map(ele => `${prefix}${ele}`).join("\n")
  }


}
