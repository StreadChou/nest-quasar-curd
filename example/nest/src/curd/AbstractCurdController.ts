
import {Body, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Put, Query, Type} from "@nestjs/common";
import {FindAllBody, FindAllResponse, FindOneQuery, SearchBody} from "./CurdDefine";
import {AbstractCurdService} from "./AbstractCurdService";
import {DeepPartial, ObjectLiteral} from "typeorm";

export class AbstractCurdController<T extends ObjectLiteral = any> {
    protected _services: AbstractCurdService<T>;

    /** 创建/更新使用的DTO类 */
    protected createDtoValidator?: (createDto: DeepPartial<T>) => void | Promise<void>;
    protected updateDtoValidator?: (id: string, createDto: DeepPartial<T>) => void | Promise<void>;

    protected constructor(_services: AbstractCurdService<T>) {
        this._services = _services;
    }

    @Post("PostFindAll")
    @HttpCode(HttpStatus.OK)
    CurePostFindAll(@Body() body: FindAllBody): Promise<FindAllResponse<T>> {
        return this._services.CURD_FindAll(body);
    }

    @Post("PostFindOne")
    @HttpCode(HttpStatus.OK)
    CurePostFindOne(@Body() body: SearchBody): Promise<T | null> {
        return this._services.CURD_SearchOne(body);
    }

    @Get('findOne/:id')
    CureFindOne(@Param('id') id: string, @Query() query?: FindOneQuery) {
        return this._services.CURD_FindOne(id, query);
    }

    @Post("create")
    async CureCreate(@Body() createDto: DeepPartial<T>) {
        if (this.createDtoValidator) await this.createDtoValidator(createDto);
        return this._services.CURD_Create(createDto);
    }

    @Patch('update/:id')
    @Put('update/:id')
    async CureUpdate(@Param('id') id: string, @Body() updateDto: DeepPartial<T>) {
        if (this.updateDtoValidator) await this.updateDtoValidator(id, updateDto);
        return this._services.CURD_Update(id, updateDto);
    }

    @Delete('delete/:id')
    CureRemove(@Param('id') id: string) {
        return this._services.CURD_Delete(id);
    }

    @Delete('softDelete/:id')
    CureSoftDelete(@Param('id') id: string) {
        return this._services.CURD_SoftDelete(id);
    }

    @Delete('restore/:id')
    CureRestore(@Param('id') id: string) {
        return this._services.CURD_Restore(id);
    }


}
