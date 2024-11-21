import {AxiosInstance} from "axios";

/** 前端请求需要的数据 */
export abstract class AbstractViewData {
    /** restful api 的前缀 */
    abstract restful: string;
    /** axios 实例 */
    api: AxiosInstance;


}