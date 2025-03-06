import {Body, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Put, Query} from "@nestjs/common";
import {FindAllBody, FindAllResponse, FindOneQuery, SearchBody} from "./RequestConstant";
import {CurdService} from "./CurdService";
import {DeepPartial, ObjectLiteral} from "typeorm";

export class CurdController<T extends ObjectLiteral = any> {
    protected _services: CurdService<T>;

    protected constructor(_services: CurdService<T>) {
        this._services = _services;
    }

    @Post("PostFindAll")
    @HttpCode(HttpStatus.OK)
    PostFindAll(@Body() body: FindAllBody): Promise<FindAllResponse<T>> {
        return this._services.CURD_FindAll(body);
    }

    @Post("PostFindOne")
    @HttpCode(HttpStatus.OK)
    PostFindOne(@Body() body: SearchBody): Promise<T | null> {
        return this._services.CURD_SearchOne(body);
    }


    @Get(':id')
    findOne(@Param('id') id: string, @Query() query?: FindOneQuery) {
        return this._services.CURD_FindOne(id, query);
    }

    @Post("")
    create(@Body() createPostDto: DeepPartial<T>) {
        return this._services.CURD_Create(createPostDto);
    }

    @Patch(':id')
    @Put(':id')
    update(@Param('id') id: string, @Body() updatePostDto: DeepPartial<T>) {
        return this._services.CURD_Update(id, updatePostDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this._services.CURD_Remove(id);
    }


}