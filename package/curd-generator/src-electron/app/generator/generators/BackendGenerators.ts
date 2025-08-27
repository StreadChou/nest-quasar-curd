import { BaseFileGenerator } from "../abstracts/BaseFileGenerator";
import { GenerationContext } from "../types/GenerationContext";
import { FileMetadata } from "../types/FileMetadata";
import { ITemplateProvider, ITemplateEngine } from "../interfaces/ITemplateProvider";
import { IImportManager } from "../interfaces/IOutputManager";
import * as path from "path";

/**
 * Controller file generator
 * Generates NestJS controller files
 */
export class ControllerGenerator extends BaseFileGenerator {
  constructor(
    templateProvider: ITemplateProvider,
    templateEngine: ITemplateEngine,
    importManager: IImportManager
  ) {
    super(templateProvider, templateEngine, importManager);
  }

  shouldGenerate(context: GenerationContext): boolean {
    return !!(context.model?.exportController);
  }

  getFileMetadata(context: GenerationContext): FileMetadata {
    if (!context.model || !context.module) {
      throw new Error('Model and Module context required for controller generation');
    }

    const className = context.model.controllerClassName || `${context.model.name}Controller`;
    const fileName = `${className}.ts`;
    const directoryPath = path.join(context.backendPath, context.module.name || context.module.fileName as string);
    
    return {
      directoryPath,
      fileName,
      filePath: path.join(directoryPath, fileName),
      fileType: 'backend-controller',
      shouldExport: true,
      baseName: className,
      metadata: {
        model: context.model.name,
        module: context.module.name,
        curdPath: context.model.curdPath
      }
    };
  }

  getType(): string {
    return 'backend-controller';
  }

  protected prepareTemplateData(context: GenerationContext): Record<string, any> {
    const metadata = this.getFileMetadata(context);
    const model = context.model!;
    
    return {
      className: metadata.baseName,
      controllerDecorator: true,
      controllerPath: model.curdPath || model.name.toLowerCase(),
      extendsClass: this.shouldExtendBaseController(context) ? 'BaseController' : null,
      constructorParams: this.getConstructorParams(context),
      superCall: this.shouldExtendBaseController(context) ? 'service' : null
    };
  }

  protected addImports(context: GenerationContext, templateData: Record<string, any>): void {
    // Add NestJS imports
    this.importManager.addImport('@nestjs/common', 'Controller', 'named');

    // Add service import if needed
    if (context.model?.serviceName) {
      const serviceName = context.model.serviceName;
      this.importManager.addImport(`./${serviceName}`, serviceName, 'named');
    }

    // Add base controller import if extending
    if (templateData.extendsClass) {
      this.importManager.addImport('../common/BaseController', 'BaseController', 'named');
    }
  }

  protected getTemplate(context: GenerationContext): string {
    return this.templateProvider.getTemplate('backend-controller');
  }

  private shouldExtendBaseController(context: GenerationContext): boolean {
    // Check if there are common controllers defined
    return !!context.jsonConfig.collect?.commonController;
  }

  private getConstructorParams(context: GenerationContext): string[] {
    const params: string[] = [];
    
    if (context.model?.serviceName) {
      params.push(`private readonly service: ${context.model.serviceName}`);
    }

    return params;
  }
}

/**
 * Service file generator
 * Generates NestJS service files
 */
export class ServiceGenerator extends BaseFileGenerator {
  constructor(
    templateProvider: ITemplateProvider,
    templateEngine: ITemplateEngine,
    importManager: IImportManager
  ) {
    super(templateProvider, templateEngine, importManager);
  }

  shouldGenerate(context: GenerationContext): boolean {
    return !!(context.model?.exportService);
  }

  getFileMetadata(context: GenerationContext): FileMetadata {
    if (!context.model || !context.module) {
      throw new Error('Model and Module context required for service generation');
    }

    const className = context.model.serviceName || `${context.model.name}Service`;
    const fileName = `${className}.ts`;
    const directoryPath = path.join(context.backendPath, context.module.name || context.module.fileName as string);
    
    return {
      directoryPath,
      fileName,
      filePath: path.join(directoryPath, fileName),
      fileType: 'backend-service',
      shouldExport: true,
      baseName: className,
      metadata: {
        model: context.model.name,
        module: context.module.name
      }
    };
  }

  getType(): string {
    return 'backend-service';
  }

  protected prepareTemplateData(context: GenerationContext): Record<string, any> {
    const metadata = this.getFileMetadata(context);
    const model = context.model!;
    
    return {
      className: metadata.baseName,
      extendsClass: this.shouldExtendBaseService(context) ? 'BaseService' : null,
      entityName: model.name,
      repositoryInjection: true,
      constructorParams: this.getConstructorParams(context),
      superCall: this.shouldExtendBaseService(context) ? 'repository' : null
    };
  }

  protected addImports(context: GenerationContext, templateData: Record<string, any>): void {
    // Add NestJS imports
    this.importManager.addImport('@nestjs/common', 'Injectable', 'named');
    this.importManager.addImport('@nestjs/typeorm', 'InjectRepository', 'named');
    this.importManager.addImport('typeorm', 'Repository', 'named');

    // Add entity import
    if (context.model) {
      this.importManager.addImport(`./${context.model.name}`, context.model.name, 'named');
    }

    // Add base service import if extending
    if (templateData.extendsClass) {
      this.importManager.addImport('../common/BaseService', 'BaseService', 'named');
    }
  }

  protected getTemplate(context: GenerationContext): string {
    return this.templateProvider.getTemplate('backend-service');
  }

  private shouldExtendBaseService(context: GenerationContext): boolean {
    return !!context.jsonConfig.collect?.commonService;
  }

  private getConstructorParams(context: GenerationContext): string[] {
    const params: string[] = [];
    
    if (context.model) {
      params.push(`@InjectRepository(${context.model.name}) private repository: Repository<${context.model.name}>`);
    }

    return params;
  }
}

/**
 * Entity file generator
 * Generates TypeORM entity files WITHOUT database defaults
 */
export class EntityGenerator extends BaseFileGenerator {
  constructor(
    templateProvider: ITemplateProvider,
    templateEngine: ITemplateEngine,
    importManager: IImportManager
  ) {
    super(templateProvider, templateEngine, importManager);
  }

  shouldGenerate(context: GenerationContext): boolean {
    return !!(context.model && context.model.joinModuleImports);
  }

  getFileMetadata(context: GenerationContext): FileMetadata {
    if (!context.model || !context.module) {
      throw new Error('Model and Module context required for entity generation');
    }

    const className = context.model.name;
    const fileName = `${className}.ts`;
    const directoryPath = path.join(context.backendPath, context.module.name || context.module.fileName as string);
    
    return {
      directoryPath,
      fileName,
      filePath: path.join(directoryPath, fileName),
      fileType: 'backend-entity',
      shouldExport: true,
      baseName: className,
      metadata: {
        model: context.model.name,
        module: context.module.name,
        tableName: context.model.dbName
      }
    };
  }

  getType(): string {
    return 'backend-entity';
  }

  protected prepareTemplateData(context: GenerationContext): Record<string, any> {
    const metadata = this.getFileMetadata(context);
    const model = context.model!;
    
    return {
      className: metadata.baseName,
      tableName: model.dbName,
      columns: this.prepareColumns(model.attrs || [])
    };
  }

  protected addImports(context: GenerationContext, templateData: Record<string, any>): void {
    this.importManager.addImport('typeorm', 'Entity', 'named');
    this.importManager.addImport('typeorm', 'Column', 'named');
    this.importManager.addImport('typeorm', 'PrimaryGeneratedColumn', 'named');
  }

  protected getTemplate(context: GenerationContext): string {
    return this.templateProvider.getTemplate('backend-entity');
  }

  private prepareColumns(attrs: any[]): any[] {
    return attrs.map(attr => {
      const column: any = {
        name: attr.name,
        type: this.mapTypeToTypeScript(attr.type),
        isPrimary: attr.type === 'increment_id'
      };

      // Build column options WITHOUT database defaults
      const options: string[] = [];
      
      if (attr.nullable) {
        options.push('nullable: true');
      }
      
      if (attr.length && attr.type === 'string') {
        options.push(`length: ${attr.length}`);
      }

      // Note: Intentionally NOT adding default values here
      // Database defaults should be handled at the database schema level, not in the entity

      column.columnOptions = options.length > 0 ? options.join(', ') : '';
      
      return column;
    });
  }

  private mapTypeToTypeScript(type: string): string {
    const typeMap: Record<string, string> = {
      'string': 'string',
      'number': 'number',
      'boolean': 'boolean',
      'date': 'Date',
      'json': 'any',
      'increment_id': 'number',
      'created_time': 'Date',
      'updated_time': 'Date',
      'delete_time': 'Date'
    };

    return typeMap[type] || 'any';
  }
}