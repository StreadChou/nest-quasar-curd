import { BaseFileGenerator } from "../abstracts/BaseFileGenerator";
import { GenerationContext } from "../types/GenerationContext";
import { FileMetadata } from "../types/FileMetadata";
import { ITemplateProvider, ITemplateEngine } from "../interfaces/ITemplateProvider";
import { IImportManager } from "../interfaces/IOutputManager";
import * as path from "path";

/**
 * Module file generator
 * Generates NestJS module files
 */
export class ModuleGenerator extends BaseFileGenerator {
  constructor(
    templateProvider: ITemplateProvider,
    templateEngine: ITemplateEngine,
    importManager: IImportManager
  ) {
    super(templateProvider, templateEngine, importManager);
  }

  shouldGenerate(context: GenerationContext): boolean {
    return !!(context.module);
  }

  getFileMetadata(context: GenerationContext): FileMetadata {
    if (!context.module) {
      throw new Error('Module context required for module generation');
    }

    const className = `${context.module.name || context.module.fileName}Module`;
    const fileName = `${className}.ts`;
    const directoryPath = path.join(context.backendPath, context.module.name || context.module.fileName as string);
    
    return {
      directoryPath,
      fileName,
      filePath: path.join(directoryPath, fileName),
      fileType: 'backend-module',
      shouldExport: true,
      baseName: className,
      metadata: {
        module: context.module.name
      }
    };
  }

  getType(): string {
    return 'backend-module';
  }

  protected prepareTemplateData(context: GenerationContext): Record<string, any> {
    const metadata = this.getFileMetadata(context);
    const moduleConfig = context.module!;
    
    return {
      className: metadata.baseName,
      imports: this.getModuleImports(context),
      controllers: this.getModuleControllers(context),
      providers: this.getModuleProviders(context),
      exports: this.getModuleExports(context)
    };
  }

  protected addImports(context: GenerationContext, templateData: Record<string, any>): void {
    this.importManager.addImport('@nestjs/common', 'Module', 'named');
    
    // Add TypeORM imports if entities are present
    const hasEntities = this.hasEntities(context);
    if (hasEntities) {
      this.importManager.addImport('@nestjs/typeorm', 'TypeOrmModule', 'named');
    }

    // Add imports for controllers, services, and entities
    this.addComponentImports(context);
  }

  protected getTemplate(context: GenerationContext): string {
    return this.templateProvider.getTemplate('backend-module');
  }

  private getModuleImports(context: GenerationContext): string[] {
    const imports: string[] = [];
    
    // Add TypeORM feature imports
    const entities = this.getEntities(context);
    if (entities.length > 0) {
      imports.push(`TypeOrmModule.forFeature([${entities.join(', ')}])`);
    }

    return imports;
  }

  private getModuleControllers(context: GenerationContext): string[] {
    const controllers: string[] = [];
    const moduleConfig = context.module!;

    if (moduleConfig.models) {
      Object.values(moduleConfig.models).forEach(model => {
        if (model.exportController && model.joinModuleControllers !== false) {
          const controllerName = model.controllerClassName || `${model.name}Controller`;
          controllers.push(controllerName);
        }
      });
    }

    return controllers;
  }

  private getModuleProviders(context: GenerationContext): string[] {
    const providers: string[] = [];
    const moduleConfig = context.module!;

    if (moduleConfig.models) {
      Object.values(moduleConfig.models).forEach(model => {
        if (model.exportService && model.joinModuleProviders !== false) {
          const serviceName = model.serviceName || `${model.name}Service`;
          providers.push(serviceName);
        }
      });
    }

    return providers;
  }

  private getModuleExports(context: GenerationContext): string[] {
    const exports: string[] = [];
    const moduleConfig = context.module!;

    if (moduleConfig.models) {
      Object.values(moduleConfig.models).forEach(model => {
        if (model.exportService && model.joinModuleExports) {
          const serviceName = model.serviceName || `${model.name}Service`;
          exports.push(serviceName);
        }
      });
    }

    return exports;
  }

  private getEntities(context: GenerationContext): string[] {
    const entities: string[] = [];
    const moduleConfig = context.module!;

    if (moduleConfig.models) {
      Object.values(moduleConfig.models).forEach(model => {
        if (model.joinModuleImports) {
          entities.push(model.name);
        }
      });
    }

    return entities;
  }

  private hasEntities(context: GenerationContext): boolean {
    return this.getEntities(context).length > 0;
  }

  private addComponentImports(context: GenerationContext): void {
    const moduleConfig = context.module!;

    if (moduleConfig.models) {
      Object.values(moduleConfig.models).forEach(model => {
        // Import controllers
        if (model.exportController && model.joinModuleControllers !== false) {
          const controllerName = model.controllerClassName || `${model.name}Controller`;
          this.importManager.addImport(`./${controllerName}`, controllerName, 'named');
        }

        // Import services
        if (model.exportService && model.joinModuleProviders !== false) {
          const serviceName = model.serviceName || `${model.name}Service`;
          this.importManager.addImport(`./${serviceName}`, serviceName, 'named');
        }

        // Import entities
        if (model.joinModuleImports) {
          this.importManager.addImport(`./${model.name}`, model.name, 'named');
        }
      });
    }
  }
}

/**
 * Interface file generator
 * Generates TypeScript interface files
 */
export class InterfaceGenerator extends BaseFileGenerator {
  constructor(
    templateProvider: ITemplateProvider,
    templateEngine: ITemplateEngine,
    importManager: IImportManager
  ) {
    super(templateProvider, templateEngine, importManager);
  }

  shouldGenerate(context: GenerationContext): boolean {
    return !!(context.model?.exportInterface);
  }

  getFileMetadata(context: GenerationContext): FileMetadata {
    if (!context.model || !context.module) {
      throw new Error('Model and Module context required for interface generation');
    }

    const interfaceName = `${context.model.name}Interface`;
    const fileName = `${interfaceName}.ts`;
    const directoryPath = path.join(context.backendPath, context.module.name || context.module.fileName as string, 'interfaces');
    
    return {
      directoryPath,
      fileName,
      filePath: path.join(directoryPath, fileName),
      fileType: 'interface',
      shouldExport: true,
      baseName: interfaceName,
      metadata: {
        model: context.model.name,
        module: context.module.name
      }
    };
  }

  getType(): string {
    return 'interface';
  }

  protected prepareTemplateData(context: GenerationContext): Record<string, any> {
    const metadata = this.getFileMetadata(context);
    const model = context.model!;
    
    return {
      interfaceName: metadata.baseName,
      properties: this.prepareProperties(model.attrs || [])
    };
  }

  protected addImports(context: GenerationContext, templateData: Record<string, any>): void {
    // Interfaces typically don't need imports unless using external types
  }

  protected getTemplate(context: GenerationContext): string {
    return this.templateProvider.getTemplate('interface');
  }

  private prepareProperties(attrs: any[]): any[] {
    return attrs.map(attr => ({
      name: attr.name,
      type: this.mapTypeToTypeScript(attr.type),
      optional: attr.nullable ? '?' : ''
    }));
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

/**
 * Constants file generator
 * Generates constant files for models
 */
export class ConstantsGenerator extends BaseFileGenerator {
  constructor(
    templateProvider: ITemplateProvider,
    templateEngine: ITemplateEngine,
    importManager: IImportManager
  ) {
    super(templateProvider, templateEngine, importManager);
  }

  shouldGenerate(context: GenerationContext): boolean {
    return !!(context.model?.constant && context.model.constant.length > 0);
  }

  getFileMetadata(context: GenerationContext): FileMetadata {
    if (!context.model || !context.module) {
      throw new Error('Model and Module context required for constants generation');
    }

    const fileName = `${context.model.name}Constants.ts`;
    const directoryPath = path.join(context.backendPath, context.module.name || context.module.fileName as string, 'constants');
    
    return {
      directoryPath,
      fileName,
      filePath: path.join(directoryPath, fileName),
      fileType: 'constants',
      shouldExport: true,
      baseName: `${context.model.name}Constants`,
      metadata: {
        model: context.model.name,
        module: context.module.name
      }
    };
  }

  getType(): string {
    return 'constants';
  }

  protected prepareTemplateData(context: GenerationContext): Record<string, any> {
    const model = context.model!;
    
    return {
      constants: (model.constant || []).map(constant => ({
        name: constant.name,
        value: constant.value
      }))
    };
  }

  protected addImports(context: GenerationContext, templateData: Record<string, any>): void {
    // Constants typically don't need imports
  }

  protected getTemplate(context: GenerationContext): string {
    return this.templateProvider.getTemplate('constants');
  }
}