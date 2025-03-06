import {AbsFileGenerator} from "app/src-ssr/generator/FileGenerator/AbsFileGenerator";
import {GeneratorCtx} from "app/src-ssr/generator/GeneratorCtx";
import {Table} from "app/src-ssr/types/Table";

export abstract class AbsDataTableGenerator extends AbsFileGenerator{
  ctx: GeneratorCtx;
  config: Table;

  constructor(ctx: GeneratorCtx, config: Table) {
    super();
    this.ctx = ctx;
    this.config = config;
  }
}
