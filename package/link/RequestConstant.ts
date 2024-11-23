/** find all 使用 post 进行复杂查询 */
export interface FindAllBody<T = any> {
    /** 每页多少个 默认 10 */
    pageSize?: number;
    /** 当前页数 默认 1*/
    page?: number;

    /** 选择哪些字段 */
    select?: string[];
    /** where 查询 */
    where?: Record<keyof T, any>;
    /** where not 查询, 多个之间使用and */
    whereNot?: Record<keyof T, any>;
    /** where like 查询, 多个like之间使用or */
    whereLike?: { fields: Array<keyof T>, like: string };
    /** whereIn 查询 */
    whereIn?: Record<keyof T, any[]>;
    /** whereNull 查询 */
    whereNull?: Array<string>;
    /** whereNotNull 查询 */
    whereNotNull?: Array<string>;
    /** 排序 */
    orderBy?: Record<string, 'ASC' | 'DESC'>[];
    /** 关系 */
    relations?: string[];
    /** 关系字段选择 */
    relationSelect?: Record<string, string[]>;
}

/** find all 使用 post 进行复杂查询结果 */
export interface FindAllResponse<T = any> {
    data: T[];
    pagination?: {
        /** 当前页码 */
        page: number;
        /** 每页数据条数 */
        pageSize: number;
        /** 总记录数（可选）*/
        total?: number;
    };
}

export interface FindOneQuery {
    /** 选择哪些字段 */
    select?: string[];
    /** 关系 */
    relations?: string[];
}


export type CreateBody<T = any> = Partial<T>;
export type UpdateBody<T = any> = Partial<T>;