import {Brackets, DeepPartial, ObjectLiteral, Repository, SelectQueryBuilder, WhereExpressionBuilder} from "typeorm";
import {
    FindAllBody,
    FindAllResponse, FindOneQuery,
    FindWhereBrackets,
    FindWhereInterface,
    FindWhereType, SearchBody
} from "./RequestConstant";
import {HttpException} from "@nestjs/common";

export class CurdService<T extends ObjectLiteral = any> {
    private _repository: Repository<T>;
    protected primary_key: keyof T = "id";


    protected constructor(_repository: any) {
        this._repository = _repository;
    }


    /** 查询列表 */
    async CURD_FindAll(body: FindAllBody): Promise<FindAllResponse<T>> {
        const qb = this._repository.createQueryBuilder("entity");
        CurdService.QbSearch(qb, body);
        if (body.not_page) return qb.getMany();
        const {pageSize = 10, page = 1,} = body;
        // 添加分页
        qb.skip((page - 1) * pageSize).take(pageSize)
        const [result, total] = await qb.getManyAndCount();
        return {
            data: result,
            pagination: {
                page: page,
                pageSize: pageSize,
                total,
            },
        };
    }

    /** 搜索一个 */
    async CURD_SearchOne(body: SearchBody): Promise<T | null> {
        body = body || {};
        const qb = this._repository.createQueryBuilder("entity");
        CurdService.QbSearch(qb, body);
        return qb.getOne();
    }


    /** 获取一个的详情 */
    async CURD_FindOne(id: string | number, opt?: FindOneQuery): Promise<T | null> {
        opt = opt || {}
        const qb = this._repository.createQueryBuilder("entity");
        // 处理选择字段
        CurdService.QbAddSelect(qb, opt.select);
        // 处理关系筛选
        CurdService.QbAddRelations(qb, opt.relations, opt.relationSelect)
        qb.where("entity.id = :id", {id})
        return qb.getOne();
    }

    /** 获取一个的详情 */
    async CURD_FindOneOrFail(id: string | number, opt?: FindOneQuery): Promise<T> {
        const entity = await this.CURD_FindOne(id, opt);
        if (!entity) throw new HttpException("没有找到该数据", 404)
        return entity;
    }

    /** 创建 */
    async CURD_Create(createPostDto: DeepPartial<T>): Promise<T> {
        const newEntity = this._repository.create(createPostDto);
        return this._repository.save(newEntity);
    }

    /** 更新 */
    async CURD_Update(id: string, updatePostDto: DeepPartial<T>): Promise<T> {
        const entity = await this.CURD_FindOneOrFail(id);
        Object.assign(entity, updatePostDto); // 更新实体的属性
        return this._repository.save(entity);
    }

    /** 移除 */
    async CURD_Remove(id: string): Promise<void> {
        const entity = await this.CURD_FindOneOrFail(id);
        await this._repository.remove(entity);
    }

    static QbSearch(qb: SelectQueryBuilder<any>, opt: SearchBody<any>) {
        // 处理选择字段
        CurdService.QbAddSelect(qb, opt.select);
        // 处理排序
        CurdService.QbAddOrder(qb, opt.orderBy);
        // 处理关系筛选
        CurdService.QbAddRelations(qb, opt.relations, opt.relationSelect)
        // 附加where
        CurdService.HandleQueryBuilderWhere(qb, opt);
    }


    static QbAddRelations(qb: SelectQueryBuilder<any>, relations?: FindAllBody["relations"], relationSelect?: FindAllBody["relationSelect"]) {
        relationSelect = relationSelect || {};
        relations = relations || [];

        for (const relation of relations) {
            if (!relationSelect[relation] || relationSelect[relation].length <= 0) {
                qb.leftJoinAndSelect(`entity.${relation}`, relation);
            } else {
                qb.leftJoin(`entity.${relation}`, relation);
                const selectList = relationSelect[relation];
                for (const select of selectList) {
                    qb.addSelect(`${relation}.${select}`);
                }
            }
        }
    }

    static QbAddSelect(qb: SelectQueryBuilder<any>, select?: FindAllBody["select"]) {
        if (select && select.length > 0) {
            qb.select(select.map(field => `entity.${field}`));
        } else {
            qb.select('entity'); // 默认选择整个实体
        }
    }

    static QbAddOrder(qb: SelectQueryBuilder<any>, orderBy?: FindAllBody["orderBy"]) {
        if (orderBy && orderBy.length > 0) {
            for (const {field, order} of orderBy) {
                qb.addOrderBy(`entity.${field}`, order);
            }
        }
    }


    /** 处理 where 条件(最上层) */
    static HandleQueryBuilderWhere(qb: SelectQueryBuilder<any>, opt: FindAllBody<any>) {
        if (!opt.where) return null;
        this.ProcessWhereConditions(qb, opt.where.list, opt.where.uni);
    }

    /** 生成 Brackets 嵌套 */
    static GenerateBrackets(item: FindWhereBrackets) {
        return new Brackets((qb) => {
            this.ProcessWhereConditions(qb, item.list, item.uni);
        });
    }

    /** 通用处理 WHERE 条件的逻辑 */
    static ProcessWhereConditions(qb: SelectQueryBuilder<any> | WhereExpressionBuilder, list: Array<FindWhereBrackets | FindWhereInterface>, uni: "and" | "or") {
        for (const listItem of list) {
            if ("type" in listItem) {
                // 处理单个 WHERE 条件
                const {where, parameters} = this.GetWhereValue(listItem as FindWhereInterface);
                qb[uni === "or" ? "orWhere" : "andWhere"](where, parameters);
            } else {
                // 递归子条件
                const brackets = this.GenerateBrackets(listItem as FindWhereBrackets);
                qb[uni === "or" ? "orWhere" : "andWhere"](brackets);
            }
        }
    }

    /** 将 where 格式化成TypeOrm的where字段需要的内容 */
    static GetWhereValue(data: FindWhereInterface): { where: string, parameters?: ObjectLiteral } {
        // 处理可能存在的表关联情况
        const field = data.field.includes(".") ? data.field : `entity.${data.field}`;

        switch (data.type) {
            // 基本比较
            case FindWhereType.Equal:
                return {where: `${field} = :TheValue`, parameters: {TheValue: data.value}};
            case FindWhereType.NotEqual:
                return {where: `${field} <> :TheValue`, parameters: {TheValue: data.value}};
            case FindWhereType.GreaterThan:
                return {where: `${field} > :TheValue`, parameters: {TheValue: data.value}};
            case FindWhereType.GreaterThanOrEqual:
                return {where: `${field} >= :TheValue`, parameters: {TheValue: data.value}};
            case FindWhereType.LessThan:
                return {where: `${field} < :TheValue`, parameters: {TheValue: data.value}};
            case FindWhereType.LessThanOrEqual:
                return {where: `${field} <= :TheValue`, parameters: {TheValue: data.value}};

            // 范围查询
            case FindWhereType.Between:
                if (!Array.isArray(data.value) || data.value.length !== 2) {
                    throw new Error("FindWhereType.Between requires an array of two values");
                }
                return {
                    where: `${field} BETWEEN :Value1 AND :Value2`,
                    parameters: {Value1: data.value[0], Value2: data.value[1]}
                };
            case FindWhereType.NotBetween:
                if (!Array.isArray(data.value) || data.value.length !== 2) {
                    throw new Error("FindWhereType.NotBetween requires an array of two values");
                }
                return {
                    where: `${field} NOT BETWEEN :Value1 AND :Value2`,
                    parameters: {Value1: data.value[0], Value2: data.value[1]}
                };

            // 集合查询
            case FindWhereType.In:
                if (!Array.isArray(data.value)) {
                    throw new Error("FindWhereType.In requires an array as value");
                }
                return {where: `${field} IN (:...TheValue)`, parameters: {TheValue: data.value}};
            case FindWhereType.NotIn:
                if (!Array.isArray(data.value)) {
                    throw new Error("FindWhereType.NotIn requires an array as value");
                }
                return {where: `${field} NOT IN (:...TheValue)`, parameters: {TheValue: data.value}};

            // 模糊匹配
            case FindWhereType.Like:
                return {where: `${field} LIKE :TheValue`, parameters: {TheValue: `%${data.value}%`}};
            case FindWhereType.NotLike:
                return {where: `${field} NOT LIKE :TheValue`, parameters: {TheValue: `%${data.value}%`}};
            case FindWhereType.StartsWith:
                return {where: `${field} LIKE :TheValue`, parameters: {TheValue: `${data.value}%`}};
            case FindWhereType.EndsWith:
                return {where: `${field} LIKE :TheValue`, parameters: {TheValue: `%${data.value}`}};

            // 为空 / 非空
            case FindWhereType.IsNull:
                return {where: `${field} IS NULL`, parameters: {}};
            case FindWhereType.IsNotNull:
                return {where: `${field} IS NOT NULL`, parameters: {}};

            // 复杂查询
            case FindWhereType.Exists:
                return {where: `EXISTS (${data.value})`, parameters: {}}; // 这里的 value 应该是一个子查询
            case FindWhereType.NotExists:
                return {where: `NOT EXISTS (${data.value})`, parameters: {}};

            // JSON 相关（PostgreSQL 专用）
            case FindWhereType.JsonContains:
                return {where: `${field} @> :TheValue`, parameters: {TheValue: JSON.stringify(data.value)}};
            case FindWhereType.JsonNotContains:
                return {where: `NOT (${field} @> :TheValue)`, parameters: {TheValue: JSON.stringify(data.value)}};
            case FindWhereType.JsonHasKey:
                return {where: `${field} ? :TheValue`, parameters: {TheValue: data.value}};

            // MySQL 相关
            case FindWhereType.FindInSet:
                return {where: `FIND_IN_SET(:TheValue, ${field})`, parameters: {TheValue: data.value}};

            default:
                return {where: ""};
        }
    }


}