import {type AxiosInstance} from "axios";
import {AbstractViewData} from "../data";
import {AbstractTypeHandler} from "../data/TypeHandler/AbstractTypeHandler";
import type {ViewDataOption} from "./constant";

/** Props 类型定义 */
export interface FormProps {
    /** Ajax 实例 */
    api: AxiosInstance;
    /** 使用的数据处理器 */
    view_data: new (api: AxiosInstance, option?: ViewDataOption) => AbstractViewData,
    /** 编辑的资源ID */
    id?: string;
}


/** 表单的单个字段的Props定义 */
export interface FormItemProps {
    /** 表单是在创建还是在更新 */
    create_or_update: "create" | "update",
    /** 编辑的是 实体的某个字段  */
    columns_key: string,
    /** 表单的数据结构体  */
    form: object,
    /** 字段的处理器  */
    handler: AbstractTypeHandler,

    /** Form 使用 v-model 绑定的内容 */
    modelValue?: any | undefined,

    /** 使用 value 传值 */
    value?: any | undefined,
    /** 使用 value 传值 的 更新方法  */
    update?: (key: string, value: any) => void;
}