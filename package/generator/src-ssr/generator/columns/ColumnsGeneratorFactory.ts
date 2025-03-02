import {GeneratorCtx} from "app/src-ssr/generator/GeneratorCtx";
import {AbstractTableGenerator} from "app/src-ssr/generator/instance/AbstractGenerator/AbstractTableGenerator";
import {ColumnType, TableColumns} from "app/src-ssr/types/Table";
import {IncrementIdGenerator} from "app/src-ssr/generator/columns/OrmTypeGenerator/IncrementIdGenerator";
import {AbstractColumnsGeneratorCtx} from "app/src-ssr/generator/columns/AbstractGenerator/AbstractColumnsGeneratorCtx";
import {StringGenerator} from "app/src-ssr/generator/columns/BaseTypeGenerator/StringGenerator";
import {NumberGenerator} from "app/src-ssr/generator/columns/BaseTypeGenerator/NumberGenerator";
import {BooleanGenerator} from "app/src-ssr/generator/columns/BaseTypeGenerator/BooleanGenerator";
import {DateGenerator} from "app/src-ssr/generator/columns/BaseTypeGenerator/DateGenerator";
import {CreatedTimeGenerator} from "app/src-ssr/generator/columns/OrmTypeGenerator/CreatedTimeGenerator";
import {UpdatedTimeGenerator} from "app/src-ssr/generator/columns/OrmTypeGenerator/UpdatedTimeGenerator";
import {JsonGenerator} from "app/src-ssr/generator/columns/ExtensionTypeGenerator/JsonGenerator";
import {OneManyToGenerator} from "app/src-ssr/generator/columns/RelationTypeGenerator/OneManyToGenerator";

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
      return null;
    case ColumnType.Json:
      return new JsonGenerator(ctx, parent, key, config);
    case ColumnType.CreatedTime:
      return new CreatedTimeGenerator(ctx, parent, key, config);
    case ColumnType.UpdatedTime:
      return new UpdatedTimeGenerator(ctx, parent, key, config);
    case ColumnType.RelationOneToMany:
      return new OneManyToGenerator(ctx, parent, key, config);
    default:
      console.log("Factory", config)
      return null;
  }

}
