import {CreateBody, FindAllBody, FindAllResponse, UpdateBody} from "../link/index";
import {FindOptionsWhere, ObjectLiteral, Repository, SelectQueryBuilder, DeepPartial} from 'typeorm';
import {HttpException, HttpStatus} from "@nestjs/common";

export class CurdService<T extends ObjectLiteral = any> {
    private _repository: Repository<T>;
    // @ts-ignore
    protected primary_key: keyof T = "id";
    protected primary_key_type: "string" | "number" = "number"

    protected constructor(_repository: any) {
        this._repository = _repository;
    }

    async CURD_FindAll(body: FindAllBody): Promise<FindAllResponse<T>> {
        const {pageSize = 10, page = 1,} = body;

        const queryBuilder = this.CURD_FindAllQueryBuilder(body);
        // 添加分页
        queryBuilder.skip((page - 1) * pageSize).take(pageSize)

        // 执行查询
        const [result, total] = await queryBuilder.getManyAndCount();


        return {
            data: result,
            pagination: {
                page: page,
                pageSize: pageSize,
                total,
            },
        };
    }

    async CURD_FindOne(id: string): Promise<T> {
        // @ts-ignore
        const findWhere: FindOptionsWhere<T> = {
            [this.primary_key]: this.primary_key_type == "string" ? id : parseInt(id),
        }
        const entity = await this._repository.findOne({where: findWhere});
        if (!entity) {
            throw new HttpException(`Entity with id ${id} not found`, HttpStatus.NOT_FOUND);
        }
        return entity;
    }

    async CURD_Create(createPostDto: CreateBody<T>): Promise<T> {
        const newEntity = this._repository.create(createPostDto as DeepPartial<T>) as T;
        return this._repository.save(newEntity);
    }

    async CURD_Update(id: string, updatePostDto: UpdateBody<T>): Promise<T> {
        const entity = await this.CURD_FindOne(id);
        Object.assign(entity, updatePostDto as DeepPartial<T>); // 更新实体的属性
        return this._repository.save(entity);
    }

    async CURD_Remove(id: string): Promise<void> {
        const entity = await this.CURD_FindOne(id);
        await this._repository.remove(entity);
    }

    CURD_FindAllQueryBuilder(body: FindAllBody): SelectQueryBuilder<T> {
        const {
            select,
            where,
            whereIn,
            whereNull,
            whereNotNull,
            orderBy,
            relations,
            relationSelect,
        } = body;

        const query = this._repository.createQueryBuilder('entity');

        // 处理筛选条件
        if (where) {
            Object.keys(where).forEach(key => {
                query.andWhere(`entity.${key} = :${key}`, {[key]: where[key]});
            });
        }

        if (whereIn) {
            Object.keys(whereIn).forEach(key => {
                query.andWhere(`entity.${key} IN (:...${key})`, {[key]: whereIn[key]});
            });
        }

        if (whereNull) {
            whereNull.forEach(key => {
                query.andWhere(`entity.${key} IS NULL OR entity.${key} = ""`);
            });
        }

        if (whereNotNull) {
            whereNotNull.forEach(key => {
                query.andWhere(`entity.${key} IS NOT NULL AND entity.${key} != ""`);
            });
        }

        // 处理关系筛选
        if (relations) {
            relations.forEach(relation => {
                query.leftJoinAndSelect(`entity.${relation}`, relation);
                if (relationSelect && relationSelect[relation]) {
                    relationSelect[relation].forEach(field => {
                        query.addSelect(`${relation}.${field}`);
                    });
                }
            });
        }

        // 处理选择字段
        if (select) {
            query.select(select.map(field => `entity.${field}`));
        } else {
            query.select('entity'); // 默认选择整个实体
        }

        // 处理排序
        if (orderBy) {
            orderBy.forEach(order => {
                const key = Object.keys(order)[0];
                query.addOrderBy(`entity.${key}`, order[key]);
            });
        }

        return query;
    }
}
