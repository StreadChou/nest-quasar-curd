import {GeneratorCtx} from "app/src-ssr/generator/GeneratorCtx";
import {AbstractGenerator} from "app/src-ssr/generator/instance/AbstractGenerator/AbstractGenerator";
import {Table, TableColumns} from "app/src-ssr/types/Table";
import {AbstractColumnsGeneratorCtx} from "app/src-ssr/generator/columns/AbstractGenerator/AbstractColumnsGeneratorCtx";
import {ColumnsGeneratorFactory} from "app/src-ssr/generator/columns/ColumnsGeneratorFactory";

/** 这个是Table的导出, 一般是Entity或者Interface */
export abstract class AbstractTableGenerator extends AbstractGenerator {
  abstract columnsGenerator: AbstractColumnsGeneratorCtx[];
  public config: Table;

  protected constructor(ctx: GeneratorCtx, config: Table) {
    super(ctx)
    this.config = config;
  }


  addColumnsGenerator() {
    let columns = Object.entries(this.config.columns).map(([key, value]) => ({key, value}));
    columns = columns.sort((A, B) => (A.value?.sort || 0) - (B.value?.sort || 0))
    for (const item of columns) {
      const instance = ColumnsGeneratorFactory(this.ctx, this, item.key, item.value as TableColumns)
      if (instance) this.columnsGenerator.push(instance)
    }
  }


  abstract isBackend(): boolean;

  abstract isFrontend(): boolean;


  /** Entity或者Interface的类名: export出去的类名 */
  abstract getClassName(): string;

  /** 导出的文件名字 */
  abstract getFileName(): string;

  /** 文件的路径 */
  abstract getFilePath(): string;

}
