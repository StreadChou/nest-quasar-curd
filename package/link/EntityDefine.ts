import {ColumnsDefine} from "./ColumnConstant";

export interface EntityDefine {
    /** 表的备注 */
    TableMark?: string;
    /** 类的名字 */
    ClassName: string;
    /** Restful接口前缀: 如果没有, 则不会导出controller */
    Restful?: string;
    /** 每个字段 */
    columns: Record<string, ColumnsDefine<any>>;

    /** 后端表现 */
    backend?: {
        /** 类的装饰器 */
        EntityDecorator?: string[]
    },
    /** 前端表现 */
    frontend?: {
        /** 表单页布局 */
        form_grid?: Array<string | Array<string>>;
    }
}