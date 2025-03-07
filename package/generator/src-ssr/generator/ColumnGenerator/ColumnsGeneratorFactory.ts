import {ColumnType, TableColumns} from "app/src-ssr/types/Table";
import {AbsEntityGenerator} from "../FileGenerator/EntityGenerator/AbsEntityGenerator";
import {GeneratorCtx} from "../GeneratorCtx";
import {BooleanGenerator} from "./BaseTypeGenerator/BooleanGenerator";
import {NumberGenerator} from "./BaseTypeGenerator/NumberGenerator";
import {StringGenerator} from "./BaseTypeGenerator/StringGenerator";
import {IncrementIdGenerator} from "./OrmTypeGenerator/IncrementIdGenerator";
import {DateGenerator} from "app/src-ssr/generator/ColumnGenerator/BaseTypeGenerator/DateGenerator";
import {JsonGenerator} from "app/src-ssr/generator/ColumnGenerator/ExtensionTypeGenerator/JsonGenerator";
import {CreatedTimeGenerator} from "app/src-ssr/generator/ColumnGenerator/OrmTypeGenerator/CreatedTimeGenerator";
import {UpdatedTimeGenerator} from "app/src-ssr/generator/ColumnGenerator/OrmTypeGenerator/UpdatedTimeGenerator";
import {OneManyToGenerator} from "app/src-ssr/generator/ColumnGenerator/RelationTypeGenerator/OneManyToGenerator";
import {AbsColumnsGeneratorCtx} from "app/src-ssr/generator/ColumnGenerator/AbsColumnsGeneratorCtx";

export function ColumnsGeneratorFactory(ctx: GeneratorCtx, parent: AbsEntityGenerator, key: string, config: TableColumns): AbsColumnsGeneratorCtx | null {
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
      console.log("Factory", config);
      return null;
  }

}
