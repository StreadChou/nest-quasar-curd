import {AbstractTypesHandler} from "./AbstractTypesHandler";
import {ColumnsDefine, ColumnsType} from "../../index";
import {TypeNumber} from "./TypeNumber/TypeNumber";
import {TypeString} from "./TypeString/TypeString";
import {TypeDate} from "./TypeDate/TypeDate";
import {TypeDefault} from "./TypeDefault/TypeDefault";
import {AbstractViewData} from "../AbstractViewData";
import {TypeEnum} from "./TypeEnum/TypeEnum";
import {TypeExtension} from "./TypeExtension/TypeExtension";
import {TypeRelation} from "./TypeRelation/TypeRelation";

export function Factory(column: ColumnsDefine, viewData: AbstractViewData): AbstractTypesHandler {
    switch (column.type) {
        case ColumnsType.Number:
            return new TypeNumber(viewData, column);
        case ColumnsType.String:
            return new TypeString(viewData, column);
        case ColumnsType.Date:
            return new TypeDate(viewData, column);
        case ColumnsType.Enum:
            return new TypeEnum(viewData, column);
        case ColumnsType.Extension:
            return new TypeExtension(viewData, column);
        case ColumnsType.Relation:
            return new TypeRelation(viewData, column);
        default:
            return new TypeDefault(viewData, column);
    }
}