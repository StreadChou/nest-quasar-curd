import {type AxiosInstance} from "axios";
import {AbstractViewData, FindAllBody, type ViewDataOption} from "../index";
import {AbstractTypeHandler} from "../data/TypeHandler/AbstractTypeHandler";

/** Table 的绑定 */
export interface TableBind {
    flat: boolean;
    dense: boolean;
    dark: boolean;
    bordered: boolean;
    square: boolean;

    separator: 'horizontal' | 'vertical' | 'cell' | 'none',
    "wrap-cells": boolean;

    class: string,
    style: Record<string, string>
}


/** Props 类型定义 */
export interface HomeProps {
    /** Ajax 实例 */
    api: AxiosInstance;
    /** 使用的数据处理器 */
    view_data: new (api: AxiosInstance, option?: ViewDataOption) => AbstractViewData,

    /** 请求的参数 */
    request_body?: FindAllBody,
    /** 表格绑定 */
    table_bind?: TableBind
    /** 表格 head 绑定 */
    thead_bind?: Record<string, any>
    /** 表格 body 绑定 */
    tbody_bind?: Record<string, any>
    /** 表格 tr 绑定 */
    tr_bind?: Record<string, any>
    /** 表格 td 绑定 */
    td_bind?: Record<string, any>
    /** 表格 th 绑定 */
    th_bind?: Record<string, any>
}


/** 列表的单个字段的Props定义 */
export interface HomeItemProps {
    /** 编辑的是 实体的某个字段  */
    columns_key: string,
    /** 实例的类型  */
    entity: object,
    /** 字段的处理器  */
    handler: AbstractTypeHandler,
}