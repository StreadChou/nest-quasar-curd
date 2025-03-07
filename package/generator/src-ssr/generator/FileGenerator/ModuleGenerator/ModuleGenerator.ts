import {AbsModuleGenerator} from "app/src-ssr/generator/FileGenerator/ModuleGenerator/AbsModuleGenerator";
import {GeneratorCtx} from "app/src-ssr/generator/GeneratorCtx";
import {Module} from "app/src-ssr/types/Module";
import {ImportType} from "app/src-ssr/generator/FileGenerator/AbsFileGenerator";

export class ModuleGenerator extends AbsModuleGenerator {
  content_string_list: string[] = [];

  constructor(ctx: GeneratorCtx, config: Module) {
    super(ctx, config);
  }

  getClassName() {
    return this.config.name;
  }

  getFileContent(): string {
    // 实体
    const content_string = this.content_string_list.join("\n");
    // 附加导入
    const import_string = this.getImportStringList();


    let reply: string[] = [];
    reply = reply.concat(import_string)
    reply.push(`\n`)
    reply = reply.concat(content_string)

    return reply.join("\n");
  }


  start(): void {
    this.addImport("@nestjs/common", ImportType.ImportItem, "Module");
    this.content_string_list.push(`@Module({`);

    const ModulesImports = this.getModulesImports();
    this.content_string_list = this.content_string_list.concat(ModulesImports);

    const ModulesControllers = this.getModulesControllers();
    this.content_string_list = this.content_string_list.concat(ModulesControllers);

    const ModulesProviders = this.getModulesProviders();
    this.content_string_list = this.content_string_list.concat(ModulesProviders);

    const ModulesExports = this.getModulesExports();
    this.content_string_list = this.content_string_list.concat(ModulesExports);

    this.content_string_list.push(`})`);
    this.content_string_list.push(`export class ${this.getClassName()} {`)




    this.content_string_list.push(`}`)
  }


  getModulesImports(): string[] {
    let reply: string[] = [];
    reply.push(`imports: [`);
    this.addImport("@nestjs/typeorm", ImportType.ImportItem, "TypeOrmModule");
    reply.push(`${this.ctx.prefix}TypeOrmModule.forFeature([`)
    for (const item of this.config.tables) {
      const instance = this.ctx.findEntity(item, "backend");
      if (!instance) continue;
      this.addImport(instance.getFilePath(), ImportType.ImportItem, instance.getClassName());
      reply.push(`${this.ctx.prefix}${this.ctx.prefix}${instance.getClassName()},`)
    }
    reply.push(`${this.ctx.prefix}]),`)
    reply.push(`],`);
    return reply.map(ele => `${this.ctx.prefix}${ele}`);
  }

  getModulesControllers(): string[] {
    let reply: string[] = [];
    reply.push(`controllers: [`);
    for (const item of this.config.tables) {

    }
    reply.push(`],`);
    return reply.map(ele => `${this.ctx.prefix}${ele}`);
  }

  getModulesProviders(): string[] {
    let reply: string[] = [];
    reply.push(`providers: [`);
    for (const item of this.config.tables) {

    }
    reply.push(`],`);
    return reply.map(ele => `${this.ctx.prefix}${ele}`);
  }

  getModulesExports(): string[] {
    let reply: string[] = [];
    reply.push(`exports: [`);
    for (const item of this.config.tables) {

    }
    reply.push(`],`);
    return reply.map(ele => `${this.ctx.prefix}${ele}`);
  }


}
