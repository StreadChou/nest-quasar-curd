import {GeneratorCtx} from "app/src-ssr/generator/GeneratorCtx";
import {TableColumns} from "app/src-ssr/types/Table";
import {AbsEntityGenerator} from "app/src-ssr/generator/FileGenerator/EntityGenerator/AbsEntityGenerator";
import {AbsBaseTypeGenerator} from "app/src-ssr/generator/ColumnGenerator/BaseTypeGenerator/AbsBaseTypeGenerator";

export class DateGenerator extends AbsBaseTypeGenerator {

  constructor(ctx: GeneratorCtx, parent: AbsEntityGenerator, key: string, config: TableColumns) {
    super(ctx, parent, key, config);
  }


  getTypeString(): string {
    return "Date"
  }

}
