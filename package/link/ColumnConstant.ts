/** 每一个字段的定义 */
export interface ColumnsDefine<T extends ColumnsType = any> {
    /** 字段的名字 */
    label?: string;
    /** 字段的备注 */
    mark?: string;
    /** 字段的类型 */
    type: T;
    /** 字段的扩展类型 */
    type_extension?: ColumnsTypeExtension<T>;
    /** 后端导出 */
    backend?: {
        /** 装饰器 */
        decorator?: Array<string>;
    }
    /** 前端表现 */
    frontend?: {
        /** 在列表页显示 */
        show_at_home?: boolean;
        /** 创建的时候隐藏 */
        hidden_at_create?: boolean;
        /** 创建的时候禁止编辑 */
        disable_at_create?: boolean;
        /** 更新的时候隐藏 */
        hidden_at_update?: boolean;
        /** 更新的时候禁止编辑 */
        disable_at_update?: boolean;
    }
}

/** 字段类型 */
export enum ColumnsType {
    /** 计算属性: 不会进入数据库, 一般是前端自己计算的属性 */
    Computed = "computed",
    /** 自定义属性: 用来处理Array<Class>类型 */
    Customer = "customer",
    /** 关联: 表和表进行关联 */
    Relation = "relation",
    /** 扩展类型: 数据库一般都是JSON type 或者 其他 interface */
    Extension = "extension",
    /** 枚举类型 */
    Enum = "Enum",

    /** 数字 */
    Number = "number",
    /** 创建时间 */
    Date = "Date",
    /** 字符 */
    String = "string",
    /** Boolean 类型 */
    Boolean = "boolean",
}


export type ColumnsTypeExtension<T extends ColumnsType> =
    T extends ColumnsType.Relation ? TypeExtensionForRelation :
        T extends ColumnsType.Customer ? TypeExtensionForCustomer :
            T extends ColumnsType.Enum ? TypeExtensionForEnum :
                T extends ColumnsType.Extension ? TypeExtensionForExtension :
                    never;


/** 数据库关联的附加数据 */
export interface TypeExtensionForRelation {
    /** 这个类型的定义-> a: b; 表示a的类型是b, type_string就是b */
    type_string: string;
    /** 字段导入: [名字, 从哪import] */
    import_path: Array<[string, string]>;
}

/** 自定义类型的附加数据 */
export interface TypeExtensionForCustomer {
    /** 这个类型的定义-> a: b; 表示a的类型是b, type_string就是b */
    type_string: string;
    /** 字段导入: [名字, 从哪import] */
    import_path: Array<[string, string]>;
}


/** 数据库关联的附加数据 */
export interface TypeExtensionForEnum<T extends string | number | symbol = any> {
    /** 这个类型的定义-> a: b; 表示a的类型是b, type_string就是b */
    type_string: string;
    /** 字段导入: [名字, 从哪import] */
    import_path: Array<[string, string]>;
    /** 枚举的选项 */
    option: Record<T, { value: T, label: string }>,
}

/** 自定义类型的附加数据 */
export interface TypeExtensionForExtension {
    /** 这个类型的定义-> a: b; 表示a的类型是b, type_string就是b */
    type_string: string;
    /** 字段导入: [名字, 从哪import] */
    import_path: Array<[string, string]>;
}
