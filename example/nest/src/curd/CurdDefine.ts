

/** find all 使用 post 进行复杂查询 */
export interface FindAllBody<T = any> {
    /** 强制不分页  */
    not_page?: boolean;
    /** 每页多少个 默认 10 */
    pageSize?: number;
    /** 当前页数 默认 1*/
    page?: number;

    /** 选择哪些字段 */
    select?: string[];
    /** 关系 */
    relations?: string[];
    /** 关系字段选择 */
    relationSelect?: Record<string, string[]>;
    /** 排序 */
    orderBy?: Array<{ field: string, order: "ASC" | "DESC" }>;

    /** 查询条件 */
    where?: FindWhereBrackets;
}

/** 复杂查询需要的基础数据 */
export type SearchBody<T = any> = Pick<FindAllBody<T>, "select" | "relations" | "relationSelect" | "orderBy" | "where">;

/** 使用 get 查询单个数据时的query */
export type FindOneQuery<T = any> = Pick<FindAllBody<T>, "select" | "relations" | "relationSelect">;

/** 联合find的条件 */
export interface FindWhereBrackets {
    list: Array<FindWhereBrackets | FindWhereInterface>;
    uni: "and" | "or"
}

/** 单个find的条件 */
export interface FindWhereInterface {
    /** 这个查询的类型 */
    type: FindWhereType;
    /** where的字段 */
    field: string;
    /** where的值 */
    value: string | number | Array<string | number>;
}


/**
 * Where 查询类型枚举
 * 用于定义不同的查询条件
 */
export enum FindWhereType {
    // 基本比较
    Equal = "Equal",            // 等于 =
    NotEqual = "NotEqual",      // 不等于 <>
    GreaterThan = "GreaterThan", // 大于 >
    GreaterThanOrEqual = "GreaterThanOrEqual", // 大于等于 >=
    LessThan = "LessThan",       // 小于 <
    LessThanOrEqual = "LessThanOrEqual", // 小于等于 <=

    // 范围查询
    Between = "Between",         // 在某个区间 BETWEEN X AND Y
    NotBetween = "NotBetween",   // 不在某个区间 NOT BETWEEN X AND Y

    // 集合查询
    In = "In",                   // 在集合内 IN (X, Y, Z)
    NotIn = "NotIn",             // 不在集合内 NOT IN (X, Y, Z)

    // 模糊匹配
    Like = "Like",               // 模糊匹配 LIKE '%xxx%'
    NotLike = "NotLike",         // 反向模糊匹配 NOT LIKE '%xxx%'
    StartsWith = "StartsWith",   // 以某个字符串开头 LIKE 'xxx%'
    EndsWith = "EndsWith",       // 以某个字符串结尾 LIKE '%xxx'

    // 为空/非空
    IsNull = "IsNull",           // 为空 IS NULL
    IsNotNull = "IsNotNull",     // 非空 IS NOT NULL

    // 复杂查询
    Exists = "Exists",           // 存在某个子查询 EXISTS (SELECT ...)
    NotExists = "NotExists",     // 不存在某个子查询 NOT EXISTS (SELECT ...)

    // JSON 相关（PostgreSQL）
    JsonContains = "JsonContains",   // JSON 包含 @> '{ "key": "value" }'
    JsonNotContains = "JsonNotContains", // JSON 不包含 NOT (column @> '{ "key": "value" }')
    JsonHasKey = "JsonHasKey",       // JSON 是否包含某个键 column ? 'key'

    // MySQL 相关
    FindInSet = "FindInSet"      // MySQL FIND_IN_SET('value', column)
}

/** find all 使用 post 进行复杂查询结果 */
export type FindAllResponse<T = any> = FindAllPaginationResponse<T> | T[];

/** FindAll查询的分页结果 */
export interface FindAllPaginationResponse<T = any> {
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


