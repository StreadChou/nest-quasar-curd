import {GeneratorCtx} from "app/src-ssr/generator/GeneratorCtx";
import {TableColumns} from "app/src-ssr/types/Table";
import {AbsColumnsGeneratorCtx} from "app/src-ssr/generator/ColumnGenerator/AbsColumnsGeneratorCtx";
import {AbsEntityGenerator} from "app/src-ssr/generator/FileGenerator/EntityGenerator/AbsEntityGenerator";

// 更新时间类型的字段生成器
export class UpdatedTimeGenerator extends AbsColumnsGeneratorCtx {
  /** 主体内容 */
  content_string_list: Array<string> = [];

  constructor(ctx: GeneratorCtx, parent: AbsEntityGenerator, key: string, config: TableColumns) {
    super(ctx, parent, key, config);
  }


  start() {
    this.content_string_list.push(`/** ${this.config.name} */`)
    if (this.isBackend) {
      this.parent.addTypeOrm("UpdateDateColumn")
      this.content_string_list.push(`@UpdateDateColumn()`)
    }
    this.content_string_list.push(`${this.key}${this.config.nullable ? '?' : ''}: Date;`);
  }


  getString(prefix: string) {
    return this.content_string_list.map(ele => `${prefix}${ele}`).join("\n")
  }


}
