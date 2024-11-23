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

    /** 是否导出 controller 和 services, 默认true */
    with_controller_services?: boolean;
    /** 是否导出前端的interface */
    with_interface?: boolean;
    /** 是否导出前端的数据请求器 */
    with_view_data?: boolean;

    /** 后端表现 */
    backend?: {
        /** 类的装饰器 */
        EntityDecorator?: string[]
    },
    /** 前端表现 */
    frontend?: {
        /** 列表页Url */
        home_page?: string;
        /** 表单页Url */
        form_page?: string;
    }
}