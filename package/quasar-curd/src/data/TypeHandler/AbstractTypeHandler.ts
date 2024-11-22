import {AbstractViewData} from "../AbstractViewData";
import {ColumnsDefine} from "../../index";

export abstract class AbstractTypeHandler {
    /** 数据处理器 */
    public ViewData!: AbstractViewData
    /** 配置内容 */
    column: ColumnsDefine

    protected constructor(ViewData: AbstractViewData, column: ColumnsDefine) {
        this.ViewData = ViewData;
        this.column = column;
    }

    isDisable(create_or_update: "create" | "update") {
        if (create_or_update == "create" && this.column.frontend?.disable_at_create) return true;
        if (create_or_update == "update" && this.column.frontend?.disable_at_update) return true;
        //
        return false;
    }

    abstract td_component(): any;

    abstract form_component(): any;
}