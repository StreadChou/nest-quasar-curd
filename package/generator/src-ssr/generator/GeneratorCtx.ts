import {EntityGeneratorCxt} from "app/src-ssr/generator/instance/TableGenerator/EntityGeneratorCxt";
import {InterfaceGeneratorCxt} from "app/src-ssr/generator/instance/TableGenerator/InterfaceGeneratorCxt";
import {AbstractGenerator} from "app/src-ssr/generator/instance/AbstractGenerator/AbstractGenerator";
import {getConfigJson, getGeneratorJson} from "app/src-ssr/app/JsonFileHelper";
import {ExportConfig} from "app/src-ssr/types/ExportConfig";
import {AbstractCollect} from "app/src-ssr/generator/collect/AbstractCollect";
import {EntityCollect} from "app/src-ssr/generator/collect/EntityCollect";

export class GeneratorCtx {
  public readonly tablesGenerator: AbstractGenerator[] = [];
  public readonly tablesCollect: AbstractCollect[] = [];

  public config: ExportConfig;

  constructor() {
    this.config = getConfigJson();
    const {modules, tables} = getGeneratorJson();


    for (const table of tables) {
      this.tablesGenerator.push(new EntityGeneratorCxt(this, table))
      this.tablesGenerator.push(new InterfaceGeneratorCxt(this, table))
    }

    this.tablesCollect.push(new EntityCollect(this))
  }

  get backend_root() {
    return this.config.backend;
  }

  get frontend_root() {
    return this.config.frontend;
  }

  get prefix() {
    return "    ";
  }

  /** 获取table的实体生成器 */
  findTableEntityCtx(tableName: string) {
    for (const generator of this.tablesGenerator) {
      if (!(generator instanceof EntityGeneratorCxt)) continue;
      if (generator.config.ClassName == tableName) return generator;
    }
    return null;
  }

  /** 获取table的接口生成器 */
  findTableInterfaceCtx(tableName: string) {
    for (const generator of this.tablesGenerator) {
      if (!(generator instanceof InterfaceGeneratorCxt)) continue;
      if (generator.config.ClassName == tableName) return generator;
    }
    return null;
  }


  start() {

  }

}
