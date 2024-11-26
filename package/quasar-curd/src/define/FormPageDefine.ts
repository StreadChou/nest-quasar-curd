import {type AxiosInstance, type AxiosResponse} from "axios";
import {AbstractTypeHandler, AbstractViewData} from "../data";
import type {ViewDataOption} from "./constant";
import {FindAllBody} from "../../../link";

/** Props 类型定义 */
export interface FormProps {
    /** Ajax 实例 */
    api: AxiosInstance;
    /** 使用的数据处理器 */
    view_data: new (api: AxiosInstance, option?: ViewDataOption) => AbstractViewData,
    /** 编辑的资源ID */
    id?: string;
    /** 表单编辑器 */
    form_editor?: Record<string, any>;
    /** 给editor传参 */
    from_editor_props?: Record<string, {
        /** 请求参数, 这个selector将会特别好用 */
        request_body?: FindAllBody,
    }>;

    /** 保存之前 */
    before_save?: (form?: object) => Error | false;
    /** 保存之后 */
    after_save?: (form?: object, response?: AxiosResponse) => Error | false;

    /** 删除之前 */
    before_delete?: (form?: object) => Error | false;
    /** 删除之后 */
    after_delete?: (form?: object, response?: AxiosResponse) => Error | false;
}


/** 表单的单个字段的Props定义 */
export interface FormItemProps {
    /** Form 使用 v-model 绑定的内容 */
    modelValue: any | undefined,

    /** 表单是在创建还是在更新 */
    create_or_update: "create" | "update",
    /** 编辑的是 实体的某个字段  */
    columns_key: string,
    /** 表单的数据结构体  */
    form: object,
    /** 字段的处理器  */
    handler: AbstractTypeHandler,
}


export class FormItemPropsClass {

}