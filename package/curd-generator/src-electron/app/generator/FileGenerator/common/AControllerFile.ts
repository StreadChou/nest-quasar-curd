import {AFileGenerator} from "app/src-electron/app/generator/FileGenerator/AFileGenerator";
import {RootGenerator} from "app/src-electron/app/RootGenerator";
import path from "path";
import {ADefineFile} from "app/src-electron/app/generator/FileGenerator/common/ADefineFile";
import {ImportType} from "app/type/TypescriptImport/ImportType";
import {AServicesFile} from "app/src-electron/app/generator/FileGenerator/common/AServicesFile";

export class AControllerFile extends AFileGenerator {
  generator: RootGenerator

  constructor(generator: RootGenerator) {
    super();
    this.generator = generator;
  }

  override start() {
    this.content_list.push(...this.getTemplate());

    this.importer.addImportFromNestjsCommon("Body");
    this.importer.addImportFromNestjsCommon("Delete");
    this.importer.addImportFromNestjsCommon("Get");
    this.importer.addImportFromNestjsCommon("HttpCode");
    this.importer.addImportFromNestjsCommon("HttpStatus");
    this.importer.addImportFromNestjsCommon("Param");
    this.importer.addImportFromNestjsCommon("Patch");
    this.importer.addImportFromNestjsCommon("Post");
    this.importer.addImportFromNestjsCommon("Put");
    this.importer.addImportFromNestjsCommon("Query");

    this.importer.addImportFromTypeOrm("DeepPartial");
    this.importer.addImportFromTypeOrm("ObjectLiteral");

    const aDefineFile = this.generator.findFile((ele => ele instanceof ADefineFile)) as ADefineFile;
    this.importer.addImport(aDefineFile.getFilePath(), ImportType.ImportItem, "FindAllBody")
    this.importer.addImport(aDefineFile.getFilePath(), ImportType.ImportItem, "FindAllResponse")
    this.importer.addImport(aDefineFile.getFilePath(), ImportType.ImportItem, "FindOneQuery")
    this.importer.addImport(aDefineFile.getFilePath(), ImportType.ImportItem, "SearchBody")

    const aServicesFile = this.generator.findFile((ele => ele instanceof AServicesFile)) as AServicesFile;
    const aServicesBaseName = aServicesFile.getBaseName();
    this.importer.addImport(aServicesFile.getFilePath(), ImportType.ImportItem, aServicesBaseName)

    for (const index in this.content_list) {
      let item = this.content_list[index] as string;

      if (item.includes("__BASE_NAME__")) {
        item = item.replace("__BASE_NAME__", this.getBaseName())
      }
      if (item.includes("__A_SERVICE_BASE_NAME__")) {
        item = item.replace("__A_SERVICE_BASE_NAME__", aServicesBaseName)
      }

      this.content_list[index] = item;
    }
  }

  getTemplate(): string[] {
    const string = `

export class __BASE_NAME__<T extends ObjectLiteral = any> {
    protected _services: __A_SERVICE_BASE_NAME__<T>;

    /** 创建/更新使用的DTO类 */
    protected createDtoValidator?: (createDto: DeepPartial<T>) => void | Promise<void>;
    protected updateDtoValidator?: (id: string, createDto: DeepPartial<T>) => void | Promise<void>;

    protected constructor(_services: __A_SERVICE_BASE_NAME__<T>) {
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
    return string.split("\n")
  }

  getBaseName(): string {
    return "CurdBaseController";
  }

  getDirPath(): string {
    return path.join(this.generator.backend_path, "CurdBase");
  }

  getFileName(): string {
    const baseName = this.getBaseName();
    return `${baseName}.ts`;
  }

  isExport(): boolean {
    return true;
  }
}
