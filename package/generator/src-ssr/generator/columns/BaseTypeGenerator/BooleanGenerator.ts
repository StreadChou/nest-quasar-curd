import {AbstractBaseTypeGenerator} from "app/src-ssr/generator/columns/AbstractGenerator/AbstractBaseTypeGenerator";
import {GeneratorCtx} from "app/src-ssr/generator/GeneratorCtx";
import {AbstractTableGenerator} from "app/src-ssr/generator/instance/AbstractGenerator/AbstractTableGenerator";
import {TableColumns} from "app/src-ssr/types/Table";

export class BooleanGenerator extends AbstractBaseTypeGenerator {

  constructor(ctx: GeneratorCtx, parent: AbstractTableGenerator, key: string, config: TableColumns) {
    super(ctx, parent, key, config);
    this.start();
  }


  getTypeString(): string {
    return "boolean"
  }
}
