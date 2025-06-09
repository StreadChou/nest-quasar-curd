import {RootGenerator} from "app/src-electron/app/RootGenerator";
import {AbstractFileGenerator} from "app/src-electron/app/generator/FileGenerator/AbstractFileGenerator";
import path from "path";

/** service 基类 文件生成 */
export class BaseServiceFileGeneratorBackend extends AbstractFileGenerator {
  generator: RootGenerator;


  constructor(generator: RootGenerator) {
    super();
    this.generator = generator;
  }

  isExport() {
    return true;
  }

  getDirPath(): string {
    return path.join(this.generator.backend_path);
  }

  getFileName(): string {
    return `${this.getBaseName()}.ts`;
  }

  getBaseName(): string {
    return `AbstractCurdService`;
  }

  start() {

  }

  writeToFile() {
    if (!this.isExport) return null;

    let raw = this.loadRawContent();
    let content = this.getTemplate();

    content = this.replaceCustomerInfo(raw, content, "IMPORT");
    content = this.replaceCustomerInfo(raw, content, "DECORATOR");
    content = this.replaceCustomerInfo(raw, content, "CONSTRUCTOR");
    content = this.replaceCustomerInfo(raw, content, "CONTENT");

    this.writeFileContent(content);
  }


  getTemplate(): string {
    return this._template();
  }

  _template(): string {
    return `
import {
    Brackets,
    DeepPartial,
    ObjectLiteral,
    Repository, SelectQueryBuilder, WhereExpressionBuilder
} from 'typeorm';
import {
    FindAllBody,
    FindAllResponse,
    FindOneQuery,
    FindWhereBrackets,
    FindWhereInterface, FindWhereType,
    SearchBody
} from './CurdDefine';
import {HttpException} from '@nestjs/common';

export type PrimaryKeyType = string | number

export abstract class AbstractCurdService<T extends ObjectLiteral = any> {
    protected readonly _repository: Repository<T>;
    protected primaryKey: keyof T = 'id';

    protected constructor(repository: Repository<T>) {
        this._repository = repository;
    }

    /** 查询列表 */
    async CURD_FindAll(body: FindAllBody): Promise<FindAllResponse<T>> {
        const qb = this._repository.createQueryBuilder('entity');
        AbstractCurdService.QbSearch(qb, body, this.primaryKey.toString());
        if (body.not_page) return qb.getMany();
        const {pageSize = 10, page = 1,} = body;
        const safePageSize = Math.max(1, Math.min(pageSize, 100));

        qb.skip((page - 1) * safePageSize).take(safePageSize);
        const [result, total] = await qb.getManyAndCount();
        return {
            data: result,
            pagination: {
                page: page,
                pageSize: safePageSize,
                total,
            },
        };
    }

    /** 搜索一个 */
    async CURD_SearchOne(body: SearchBody): Promise<T | null> {
        body = body || {};
        const qb = this._repository.createQueryBuilder('entity');
        AbstractCurdService.QbSearch(qb, body, this.primaryKey.toString());
        return qb.getOne();
    }

    /** 获取一个的详情 */
    async CURD_FindOne(id: PrimaryKeyType, opt?: FindOneQuery): Promise<T | null> {
        opt = opt || {}
        const qb = this._repository.createQueryBuilder('entity');
        AbstractCurdService.QbAddSelect(qb, opt.select);
        AbstractCurdService.QbAddRelations(qb, opt.relations, opt.relationSelect);
        qb.where('entity.' + this.primaryKey.toString() + ' = :id', {id});
        return qb.getOne();
    }

    /** 获取一个的详情 */
    async CURD_FindOneOrFail(id: PrimaryKeyType, opt?: FindOneQuery): Promise<T> {
        const entity = await this.CURD_FindOne(id, opt);
        if (!entity) throw new HttpException('没有找到该数据', 404);
        return entity;
    }

    async CURD_Create(createDto: DeepPartial<T>): Promise<T> {
        const entity = this._repository.create(createDto as DeepPartial<T>);
        return await this._repository.save(entity);
    }

    async CURD_Update(id: PrimaryKeyType, updateDto: DeepPartial<T>): Promise<T> {
        const entity = await this.CURD_FindOneOrFail(id);
        const updated = this._repository.merge(entity, updateDto);
        return this._repository.save(updated);
    }

    async CURD_Delete(id: any): Promise<void> {
        await this._repository.delete(id);
    }

    async CURD_SoftDelete(id: any): Promise<void> {
        await this._repository.softDelete(id);
    }

    async CURD_Restore(id: any): Promise<void> {
        await this._repository.restore(id);
    }

    static QbSearch(qb: SelectQueryBuilder<any>, opt: SearchBody<any>, defaultKey: string) {
        AbstractCurdService.QbAddSelect(qb, opt.select);
        AbstractCurdService.QbAddOrder(qb, opt.orderBy, defaultKey);
        AbstractCurdService.QbAddRelations(qb, opt.relations, opt.relationSelect);
        AbstractCurdService.HandleQueryBuilderWhere(qb, opt);
    }

    static QbAddRelations(qb: SelectQueryBuilder<any>, relations?: FindAllBody['relations'], relationSelect?: FindAllBody['relationSelect']) {
        relationSelect = relationSelect || {};
        relations = relations || [];

        for (const relation of relations) {
            if (!relationSelect[relation] || relationSelect[relation].length <= 0) {
                qb.leftJoinAndSelect('entity.' + relation, relation);
            } else {
                qb.leftJoin('entity.' + relation, relation);
                const selectList = relationSelect[relation];
                for (const select of selectList) {
                    qb.addSelect(relation + '.' + select);
                }
            }
        }
    }

    static QbAddSelect(qb: SelectQueryBuilder<any>, select?: FindAllBody['select']) {
        if (select && select.length > 0) {
            qb.select(select.map(field => 'entity.' + field));
        } else {
            qb.select('entity');
        }
    }

    static QbAddOrder(qb: SelectQueryBuilder<any>, orderBy: FindAllBody['orderBy'], defaultKey: string) {
        if (orderBy && orderBy.length > 0) {
            for (const {field, order} of orderBy) {
                qb.addOrderBy('entity.' + field, order);
            }
        } else {
            qb.addOrderBy('entity.' + defaultKey, 'DESC');
        }
    }

    static HandleQueryBuilderWhere(qb: SelectQueryBuilder<any>, opt: FindAllBody<any>) {
        if (!opt.where) return null;
        this.ProcessWhereConditions(qb, opt.where.list, opt.where.uni);
    }

    static GenerateBrackets(item: FindWhereBrackets) {
        return new Brackets((qb) => {
            this.ProcessWhereConditions(qb, item.list, item.uni);
        });
    }

    static ProcessWhereConditions(qb: SelectQueryBuilder<any> | WhereExpressionBuilder, list: Array<FindWhereBrackets | FindWhereInterface>, uni: 'and' | 'or') {
        for (const listItem of list) {
            if ('type' in listItem) {
                const {where, parameters} = this.GetWhereValue(listItem as FindWhereInterface);
                qb[uni === 'or' ? 'orWhere' : 'andWhere'](where, parameters);
            } else {
                const brackets = this.GenerateBrackets(listItem as FindWhereBrackets);
                qb[uni === 'or' ? 'orWhere' : 'andWhere'](brackets);
            }
        }
    }

    static GetWhereValue(data: FindWhereInterface): { where: string, parameters?: ObjectLiteral } {
        const field = data.field.includes('.') ? data.field : 'entity.' + data.field;

        switch (data.type) {
            case FindWhereType.Equal:
                return {where: field + ' = :TheValue', parameters: {TheValue: data.value}};
            case FindWhereType.NotEqual:
                return {where: field + ' <> :TheValue', parameters: {TheValue: data.value}};
            case FindWhereType.GreaterThan:
                return {where: field + ' > :TheValue', parameters: {TheValue: data.value}};
            case FindWhereType.GreaterThanOrEqual:
                return {where: field + ' >= :TheValue', parameters: {TheValue: data.value}};
            case FindWhereType.LessThan:
                return {where: field + ' < :TheValue', parameters: {TheValue: data.value}};
            case FindWhereType.LessThanOrEqual:
                return {where: field + ' <= :TheValue', parameters: {TheValue: data.value}};

            case FindWhereType.Between:
                if (!Array.isArray(data.value) || data.value.length !== 2) {
                    throw new Error('FindWhereType.Between requires an array of two values');
                }
                return {
                    where: field + ' BETWEEN :Value1 AND :Value2',
                    parameters: {Value1: data.value[0], Value2: data.value[1]}
                };
            case FindWhereType.NotBetween:
                if (!Array.isArray(data.value) || data.value.length !== 2) {
                    throw new Error('FindWhereType.NotBetween requires an array of two values');
                }
                return {
                    where: field + ' NOT BETWEEN :Value1 AND :Value2',
                    parameters: {Value1: data.value[0], Value2: data.value[1]}
                };

            case FindWhereType.In:
                if (!Array.isArray(data.value)) {
                    throw new Error('FindWhereType.In requires an array as value');
                }
                return {where: field + ' IN (:...TheValue)', parameters: {TheValue: data.value}};
            case FindWhereType.NotIn:
                if (!Array.isArray(data.value)) {
                    throw new Error('FindWhereType.NotIn requires an array as value');
                }
                return {where: field + ' NOT IN (:...TheValue)', parameters: {TheValue: data.value}};

            case FindWhereType.Like:
                return {where: field + ' LIKE :TheValue', parameters: {TheValue: '%' + data.value + '%'}};
            case FindWhereType.NotLike:
                return {where: field + ' NOT LIKE :TheValue', parameters: {TheValue: '%' + data.value + '%'}};
            case FindWhereType.StartsWith:
                return {where: field + ' LIKE :TheValue', parameters: {TheValue: data.value + '%'}};
            case FindWhereType.EndsWith:
                return {where: field + ' LIKE :TheValue', parameters: {TheValue: '%' + data.value}};

            case FindWhereType.IsNull:
                return {where: field + ' IS NULL', parameters: {}};
            case FindWhereType.IsNotNull:
                return {where: field + ' IS NOT NULL', parameters: {}};

            case FindWhereType.Exists:
                return {where: 'EXISTS (' + data.value + ')', parameters: {}};
            case FindWhereType.NotExists:
                return {where: 'NOT EXISTS (' + data.value + ')', parameters: {}};

            case FindWhereType.JsonContains:
                return {where: field + ' @> :TheValue', parameters: {TheValue: JSON.stringify(data.value)}};
            case FindWhereType.JsonNotContains:
                return {where: 'NOT (' + field + ' @> :TheValue)', parameters: {TheValue: JSON.stringify(data.value)}};
            case FindWhereType.JsonHasKey:
                return {where: field + ' ? :TheValue', parameters: {TheValue: data.value}};

            case FindWhereType.FindInSet:
                return {where: 'FIND_IN_SET(:TheValue, ' + field + ')', parameters: {TheValue: data.value}};

            default:
                throw new Error('Unknown where type: ' + data.type);
        }
    }
}

`
  }


}
