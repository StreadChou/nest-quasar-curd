import {ColumnsDefine, ColumnsType} from "../constant";

export function ColumnsTypeToBase(columns: ColumnsDefine) {
    switch (columns.type) {
        case ColumnsType.number:
            return "number";
        case ColumnsType.string:
            return "string";
        case ColumnsType.Date:
            return "Date";
        case ColumnsType.extension:


    }
}

export function ColumnsTypeToClassProp(columns: ColumnsDefine) {
    if (columns.type == ColumnsType.relation) {

    }
}