import {Body, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query} from "@nestjs/common";
import {CreateBody, FindAllBody, FindAllResponse, FindOneQuery, UpdateBody} from "../link/index";
import {CurdService} from "./curd.service";

export class CurdController<T = any> {
    protected _services: CurdService<T>;

    protected constructor(_services: CurdService<T>) {
        this._services = _services;
    }


    @Post("query")
    @HttpCode(HttpStatus.OK)
    findAll(@Body() body: FindAllBody): Promise<FindAllResponse<T>> {
        return this._services.CURD_FindAll(body);
    }

    @Get(':id')
    findOne(@Param('id') id: string, @Query() query?: FindOneQuery) {
        return this._services.CURD_FindOne(id, query);
    }

    @Post("")
    create(@Body() createPostDto: CreateBody) {
        return this._services.CURD_Create(createPostDto);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updatePostDto: UpdateBody) {
        return this._services.CURD_Update(id, updatePostDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this._services.CURD_Remove(id);
    }
}