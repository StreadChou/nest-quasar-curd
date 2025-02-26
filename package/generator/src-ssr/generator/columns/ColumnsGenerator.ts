import {ColumnType, ColumnTypeOptions, TableColumns, TableColumnsExtension} from "app/src-ssr/types/Table";

export class ColumnsGeneratorContext {
  public readonly key: string;
  public readonly config: TableColumns;
  public readonly toFrontend: boolean;

  columnsFiledList: string[] = [];
  backendImportFiledList: Array<{ item: Set<string>, from: string }> = [];

  importFieldList: Array<[string, string]> = [];

  constructor(key: string, config: TableColumns, toFrontend = false) {
    this.key = key;
    this.config = config;
    this.toFrontend = toFrontend;
    this.startGenerateEntity();
  }

  get extension(): TableColumnsExtension {
    if (!this.config.splitExtension) return this.config.extension;
    if (this.toFrontend) return this.config.extension_frontend || this.config.extension;
    return this.config.extension_backend || this.config.extension;
  }


  startGenerateEntity() {
    // 备注
    if (this.config.name) this.columnsFiledList.push(`/** ${this.config.name} */`);

    // TypeOrm的定义
    if (!this.toFrontend) {
      this.setTypeOrmDefine();
    }

    // 字段本身
    this.columnsFiledList.push(`${this.key}${this.config.nullable ? '?' : ''}: ${this.getColumnTypeString()};`);
  }


  getBackendImportString(): string {
    return "";
  }

  getEntityString(): string {
    return this.columnsFiledList.join("\n")
  }


  getColumnTypeString() {
    let type_string = ColumnTypeOptions[this.config.dataType]?.type_string
    if (type_string) return type_string;

    switch (this.config.dataType) {
      case ColumnType.IncrementId: {
        const uuid = this.extension?.uuid;
        return uuid ? "string" : "number"
      }
      default:
        return "any";

    }
  }


  setTypeOrmDefine() {
    switch (this.config.dataType) {
      case ColumnType.IncrementId: {
        this.importFromTypeOrm("PrimaryGeneratedColumn");
        const uuid = this.extension?.uuid;
        if (uuid) this.columnsFiledList.push(`@PrimaryGeneratedColumn("uuid")`)
        else this.columnsFiledList.push(`@PrimaryGeneratedColumn()`)

        break;
      }
    }
  }


  private importFromTypeOrm(name: string) {
    this.backendImportFiledList.push(["PrimaryGeneratedColumn", "typeorm"]);
  }


}
