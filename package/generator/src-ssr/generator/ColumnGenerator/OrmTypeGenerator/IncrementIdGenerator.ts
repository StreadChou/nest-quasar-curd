import {GeneratorCtx} from "app/src-ssr/generator/GeneratorCtx";
import {TableColumns} from "app/src-ssr/types/Table";
import {AbsColumnsGeneratorCtx} from "app/src-ssr/generator/ColumnGenerator/AbsColumnsGeneratorCtx";
import {AbsEntityGenerator} from "app/src-ssr/generator/FileGenerator/EntityGenerator/AbsEntityGenerator";

// 自增ID类型的字段生成器
export class IncrementIdGenerator extends AbsColumnsGeneratorCtx {
  /** 主体内容 */
  content_string_list: Array<string> = [];

  constructor(ctx: GeneratorCtx, parent: AbsEntityGenerator, key: string, config: TableColumns) {
    super(ctx, parent, key, config);
  }


  get uuid() {
    return this.extension?.uuid;
  }

  start() {
    this.content_string_list.push(`/** ${this.config.name} */`)
    if (this.isBackend) {
      this.parent.addTypeOrm("PrimaryGeneratedColumn")
      this.content_string_list.push(`@PrimaryGeneratedColumn(${this.uuid ? "'uuid'" : ""})`)
    }
    this.content_string_list.push(`${this.key}${this.config.nullable ? '?' : ''}: ${this.uuid ? 'string' : 'number'};`);
  }


  getString(prefix: string) {
    return this.content_string_list.map(ele => `${prefix}${ele}`).join("\n")
  }


}
