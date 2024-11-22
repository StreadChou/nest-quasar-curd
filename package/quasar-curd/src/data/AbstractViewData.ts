import type {AxiosInstance} from "axios";
import {type ColumnsDefine, type FindAllBody, type ViewDataOption} from "../index";
import {AbstractTypeHandler} from "./TypeHandler/AbstractTypeHandler";
import {Factory} from "./TypeHandler/Factory";

/** 前端请求需要的数据 */
export abstract class AbstractViewData<T = any> {
    /** restful api 的前缀 */
    abstract restful: string;
    /** 字段定义 */
    abstract columns: Record<string, ColumnsDefine>

    /** axios 实例 */
    api: AxiosInstance;
    /** 附加参数 */
    option: ViewDataOption;

    /** 字段的处理 */
    columnsTypeHandler: Record<string, AbstractTypeHandler> = {};


    protected constructor(api: AxiosInstance, option?: ViewDataOption) {
        this.api = api;
        this.option = option;
        this.initColumnsTypeHandler();
    }

    initColumnsTypeHandler() {
        for (const key in this.columns) {
            this.columnsTypeHandler[key] = Factory(this.columns[key], this);
        }
    }

    get HomeShowColumns(): Array<string> {
        const reply: Array<string> = [];
        for (const key in this.columns) {
            const config = this.columns[key];
            const show_at_home = config?.frontend?.show_at_home;
            if (!show_at_home) continue;
            reply.push(key);
        }
        return reply;
    }

    getFormShowColumns(id?: string): Array<string> {
        return (id && id !== "0") ? this.UpdateShowColumns : this.CreateShowColumns;
    }

    get CreateShowColumns(): Array<string> {
        const reply: Array<string> = [];
        for (const key in this.columns) {
            const config = this.columns[key];
            const hidden_at_create = config?.frontend?.hidden_at_create;
            if (hidden_at_create) continue;
            reply.push(key);
        }
        return reply;
    }

    get UpdateShowColumns(): Array<string> {
        const reply: Array<string> = [];
        for (const key in this.columns) {
            const config = this.columns[key];
            const hidden_at_update = config?.frontend?.hidden_at_update;
            if (hidden_at_update) continue;
            reply.push(key);
        }
        return reply;
    }

    /** 获取对象列表页 */
    async fetch_entity_list(requestBody: FindAllBody<T>) {
        const url = `${this.restful}/query`;
        return this.api.post<T>(url, requestBody)
    }

    /** 获取单个对象 */
    async fetch_entity_one(id: string) {
        const url = `${this.restful}/${id}`
        return this.api.get<T>(url);
    }

    /** 保存单个对象 */
    async save_entity(id: string, form: T) {
        const method = id === "0" ? 'post' : 'patch';
        const url = id === "0"
            ? `${this.restful}`
            : `${this.restful}/${id}`;
        return await this.api[method]<T>(url, form);
    }

    /** 删除单个对象 */
    async delete_entity(delete_id: string) {
        return this.api.delete(`${this.restful}/${delete_id}`)
    }

    /** 初始化表单数据 */
    async init_form_data(form: object, entity?: T) {
        /** 展示出来的字段(会根据是编辑还是修改来给定不同的字段) */
        const show_show_columns = this.getFormShowColumns(entity?.id)
        for (const key in this.columns) {
            if (!show_show_columns.includes(key)) continue;
            form[key] = entity?.[key] || undefined;
        }
        return form;
    }


}