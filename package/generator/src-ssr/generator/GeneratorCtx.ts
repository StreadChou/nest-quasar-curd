import {getConfigJson, getGeneratorJson} from "app/src-ssr/helper/JsonFileHelper";
import {ExportConfig} from "app/src-ssr/types/ExportConfig";
import {AbsEntityGenerator} from "app/src-ssr/generator/FileGenerator/EntityGenerator/AbsEntityGenerator";
import {AbsDataTableGenerator} from "app/src-ssr/generator/FileGenerator/DataTableGenerator/AbsDataTableGenerator";
import {AbsCollectGenerator} from "app/src-ssr/generator/FileGenerator/CollectGenerator/AbsCollectGenerator";
import {BackendGenerator} from "app/src-ssr/generator/FileGenerator/EntityGenerator/BackendGenerator";
import {FrontendGenerator} from "app/src-ssr/generator/FileGenerator/EntityGenerator/FrontendGenerator";
import {DataTableGenerator} from "app/src-ssr/generator/FileGenerator/DataTableGenerator/DataTableGenerator";
import {EntityCollect} from "app/src-ssr/generator/FileGenerator/CollectGenerator/EntityCollect";


export class GeneratorCtx {
  public readonly EntityGenerator: AbsEntityGenerator[] = [];
  public readonly DataTableGenerator: AbsDataTableGenerator[] = [];
  public readonly CollectGenerator: AbsCollectGenerator[] = [];

  public config: ExportConfig;

  constructor() {
    this.config = getConfigJson();
    const {modules, tables} = getGeneratorJson();


    for (const table of tables) {
      this.EntityGenerator.push(new BackendGenerator(this, table))
      this.EntityGenerator.push(new FrontendGenerator(this, table))

      this.DataTableGenerator.push(new DataTableGenerator(this, table, this.backend_root))
      this.DataTableGenerator.push(new DataTableGenerator(this, table, this.frontend_root))
    }

    this.CollectGenerator.push(new EntityCollect(this))

    this.start();
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

  start() {
    // this.tablesGenerator.forEach(ele => ele.start());
    // this.tableConstGenerator.forEach(ele => ele.start());
    // this.tablesCollect.forEach(ele => ele.start());
  }

  /** 获取table的实体生成器 */
  findTableEntityCtx(tableName: string) {
    // for (const generator of this.tablesGenerator) {
    //   if (!(generator instanceof EntityGeneratorCxt)) continue;
    //   if (generator.config.ClassName == tableName) return generator;
    // }
    // return null;
  }

  findTableBackConstCtx(tableName: string) {
    // for (const generator of this.tableConstGenerator) {
    //   if (!(generator instanceof ConstantBackendGenerator)) continue;
    //   if (generator.config.ClassName == tableName) return generator;
    // }
    // return null;
  }

  /** 获取table的接口生成器 */
  findTableInterfaceCtx(tableName: string) {
    // for (const generator of this.tablesGenerator) {
    //   if (!(generator instanceof InterfaceGeneratorCxt)) continue;
    //   if (generator.config.ClassName == tableName) return generator;
    // }
    // return null;
  }

}
