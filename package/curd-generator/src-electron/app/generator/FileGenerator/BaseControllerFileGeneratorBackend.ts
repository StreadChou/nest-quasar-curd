import {Generator} from "app/src-electron/app/Generator";
import {AbstractFileGenerator} from "app/src-electron/app/generator/FileGenerator/AbstractFileGenerator";
import path from "path";

/** controller 基类 文件生成 */
export class BaseControllerFileGeneratorBackend extends AbstractFileGenerator {
  generator: Generator;


  constructor(generator: Generator) {
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
    return `AbstractCurdController`;
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
import {Body, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Put, Query, Type} from "@nestjs/common";
import {FindAllBody, FindAllResponse, FindOneQuery, SearchBody} from "./CurdDefine";
import {AbstractCurdService} from "./AbstractCurdService";
import {DeepPartial, ObjectLiteral} from "typeorm";

export class AbstractController<T extends ObjectLiteral = any> {
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
`
  }


}
