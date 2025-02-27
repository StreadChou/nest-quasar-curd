import {AbstractColumnsGeneratorCtx} from "app/src-ssr/generator/columns/AbstractGenerator/AbstractColumnsGeneratorCtx";
import {GeneratorCtx} from "app/src-ssr/generator/GeneratorCtx";
import {AbstractTableGenerator} from "app/src-ssr/generator/instance/AbstractGenerator/AbstractTableGenerator";
import {TableColumns} from "app/src-ssr/types/Table";
import {EntityGeneratorCxt} from "app/src-ssr/generator/instance/TableGenerator/EntityGeneratorCxt";

// 创建时间类型的字段生成器
export class CreatedTimeGenerator extends AbstractColumnsGeneratorCtx {
  /** 主体内容 */
  content_string_list: Array<string> = [];

  constructor(ctx: GeneratorCtx, parent: AbstractTableGenerator, key: string, config: TableColumns) {
    super(ctx, parent, key, config);
    this.start();
  }


  start() {
    this.content_string_list.push(`/** ${this.config.name} */`)
    if (this.isBackend) {
      const parent = (this.parent as EntityGeneratorCxt)
      parent.addImportFromTypeOrm("CreateDateColumn");
      this.content_string_list.push(`@CreateDateColumn()`)
    }
    this.content_string_list.push(`${this.key}${this.config.nullable ? '?' : ''}: Date;`);
  }


  getString(prefix: string) {
    return this.content_string_list.map(ele => `${prefix}${ele}`).join("\n")
  }


}
