import {GeneratorCtx} from "app/src-ssr/generator/GeneratorCtx";
import {AbstractGenerator} from "app/src-ssr/generator/instance/AbstractGenerator/AbstractGenerator";
import {Table} from "app/src-ssr/types/Table";

/** 这个是Table的导出, 一般是Entity或者Interface */
export abstract class AbstractTableGenerator extends AbstractGenerator {
  public config: Table;

  protected constructor(ctx: GeneratorCtx, config: Table) {
    super(ctx)
    this.config = config;
  }

  /** Entity或者Interface的类名: export出去的类名 */
  abstract getClassName(): string;

  /** 导出的文件名字 */
  abstract getFileName(): string;

  /** 文件的路径 */
  abstract getFilePath(): string;

}
