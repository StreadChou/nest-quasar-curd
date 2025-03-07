import {GeneratorCtx} from "app/src-ssr/generator/GeneratorCtx";
import {TableColumns} from "app/src-ssr/types/Table";
import {AbsColumnsGeneratorCtx} from "app/src-ssr/generator/ColumnGenerator/AbsColumnsGeneratorCtx";
import {AbsEntityGenerator} from "app/src-ssr/generator/FileGenerator/EntityGenerator/AbsEntityGenerator";
import {ImportType} from "app/src-ssr/generator/FileGenerator/AbsFileGenerator";

// 创建Json类型的字段生成器
export class JsonGenerator extends AbsColumnsGeneratorCtx {
  /** 主体内容 */
  content_string_list: Array<string> = [];

  constructor(ctx: GeneratorCtx, parent: AbsEntityGenerator, key: string, config: TableColumns) {
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
            this.parent.addImportFromGenerator(item.from as string, this.env, item.value as string, ImportType.ImportItem);
            break;
          }
          case "url": {
            break;
          }
        }
      }
    }

    if (this.isBackend) {
      this.parent.addTypeOrm("CreateDateColumn");
      this.content_string_list.push(`@CreateDateColumn()`)
    }
    this.content_string_list.push(`${this.key}${this.config.nullable ? '?' : ''}: ${type_string};`);
  }


  getString(prefix: string) {
    return this.content_string_list.map(ele => `${prefix}${ele}`).join("\n")
  }


}
