import {GeneratorCtx} from "app/src-ssr/generator/GeneratorCtx";
import {AbstractTableGenerator} from "app/src-ssr/generator/instance/AbstractGenerator/AbstractTableGenerator";
import {ColumnType, TableColumns} from "app/src-ssr/types/Table";
import {IncrementIdGenerator} from "app/src-ssr/generator/columns/OrmTypeGenerator/IncrementIdGenerator";
import {AbstractColumnsGeneratorCtx} from "app/src-ssr/generator/columns/AbstractGenerator/AbstractColumnsGeneratorCtx";
import {StringGenerator} from "app/src-ssr/generator/columns/BaseTypeGenerator/StringGenerator";
import {NumberGenerator} from "app/src-ssr/generator/columns/BaseTypeGenerator/NumberGenerator";
import {BooleanGenerator} from "app/src-ssr/generator/columns/BaseTypeGenerator/BooleanGenerator";
import {DateGenerator} from "app/src-ssr/generator/columns/BaseTypeGenerator/DateGenerator";

export function ColumnsGeneratorFactory(ctx: GeneratorCtx, parent: AbstractTableGenerator, key: string, config: TableColumns): AbstractColumnsGeneratorCtx | null {
  switch (config.dataType) {
    case ColumnType.IncrementId:
      return new IncrementIdGenerator(ctx, parent, key, config);
    case ColumnType.String:
      return new StringGenerator(ctx, parent, key, config);
    case ColumnType.Number:
      return new NumberGenerator(ctx, parent, key, config);
    case ColumnType.Boolean:
      return new BooleanGenerator(ctx, parent, key, config);
    case ColumnType.Date:
      return new DateGenerator(ctx, parent, key, config);
    case ColumnType.Enum:
    case ColumnType.Json:
    case ColumnType.Relation:
    case ColumnType.CreatedTime:
    case ColumnType.UpdatedTime:
    default:
      console.log("Factory", config)
      return null;
  }

}
