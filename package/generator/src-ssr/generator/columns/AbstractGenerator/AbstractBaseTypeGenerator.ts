import {GeneratorCtx} from "app/src-ssr/generator/GeneratorCtx";
import {AbstractTableGenerator} from "app/src-ssr/generator/instance/AbstractGenerator/AbstractTableGenerator";
import {TableColumns} from "app/src-ssr/types/Table";
import {AbstractColumnsGeneratorCtx} from "app/src-ssr/generator/columns/AbstractGenerator/AbstractColumnsGeneratorCtx";
import {EntityGeneratorCxt} from "app/src-ssr/generator/instance/TableGenerator/EntityGeneratorCxt";

/** 基础类型的构造器 */
export abstract class AbstractBaseTypeGenerator extends AbstractColumnsGeneratorCtx {
  /** 主体内容 */
  content_string_list: Array<string> = [];

  constructor(ctx: GeneratorCtx, parent: AbstractTableGenerator, key: string, config: TableColumns) {
    super(ctx, parent, key, config);
  }


  start() {
    this.content_string_list.push(`/** ${this.config.name} */`)

    if (this.isBackend) {
      const parent = (this.parent as EntityGeneratorCxt)
      parent.addImportFromTypeOrm("Column");

      const ColumnOptions = this.getColumnOptions();
      const string = this.columnOptionsToString(ColumnOptions);


      this.content_string_list.push(`@Column(${string})`)
    }
    this.content_string_list.push(`${this.key}${this.config.nullable ? '?' : ''}: ${this.getTypeString()};`);
  }


  getColumnOptions() {
    const ColumnOptions: any = {
      comment: this.config.name,
    }
    if ("nullable" in this.config) ColumnOptions.nullable = this.config.nullable;
    if ("unique" in this.config) ColumnOptions.unique = this.config.unique;
    if ("dbType" in (this.extension || {})) ColumnOptions.type = this.extension.dbType;
    if ("length" in (this.extension || {})) ColumnOptions.length = this.extension.length;
    if ("default" in (this.extension || {})) ColumnOptions.default = this.extension.default;

    return ColumnOptions;
  }

  columnOptionsToString(ColumnOptions: any) {
    let string = `{`
    const keys = Object.keys(ColumnOptions);
    for (const i in keys) {
      const index = parseInt(i);
      const key = keys[index] as string;
      const value = ColumnOptions[key] as any;
      if (index == 0) {
        string += `${key}: `
      } else {
        string += ` ${key}: `
      }

      if (typeof value === "string") {
        string += `"${value}",`
      } else {
        string += `${value},`
      }
    }
    string += `}`

    return string;
  }


  getString(prefix: string) {
    return this.content_string_list.map(ele => `${prefix}${ele}`).join("\n")
  }


  abstract getTypeString(): string;
}
