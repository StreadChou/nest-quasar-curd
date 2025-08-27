import {JsonFile} from "app/type/JsonFileDefine/Index";
import { GenerationContext } from "./core/types/GenerationContext";
import { FileOutput } from "./core/types/FileOutput";
import { GeneratorFactory } from "./core/factories/GeneratorFactory";
import { FileTemplateProvider, SimpleTemplateEngine, TemplateManager } from "./core/templates/TemplateManager";
import { FileSystemOutputManager, TypeScriptImportManager } from "./core/output/OutputManager";
import { ControllerGenerator, ServiceGenerator, EntityGenerator } from "./generators/BackendGenerators";
import { ModuleGenerator, InterfaceGenerator, ConstantsGenerator } from "./generators/CommonGenerators";
import { getAbsolutePath } from "../helper/PathHelper";
import * as fs from "fs";
import * as path from "path";

/**
 * Modern CRUD generator following SOLID principles and design patterns
 * Supports .json configuration files instead of .nqcurd
 */
export class ModernCrudGenerator {
  private jsonConfig: JsonFile;
  private jsonFilePath: string;
  private generatorFactory: GeneratorFactory;
  private templateManager: TemplateManager;
  private outputManager: FileSystemOutputManager;
  private backendPath: string;
  private frontendPath: string;

  constructor(jsonFilePath: string, jsonConfig?: JsonFile) {
    this.jsonFilePath = jsonFilePath;
    this.jsonConfig = jsonConfig || this.loadJsonConfig(jsonFilePath);

    this.initializePaths();
    this.initializeServices();
    this.registerGenerators();
  }

  /**
   * Load JSON configuration from file
   */
  private loadJsonConfig(filePath: string): JsonFile {
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(content);
    } catch (error) {
      throw new Error(`Failed to load JSON configuration from ${filePath}: ${error}`);
    }
  }

  /**
   * Initialize file paths
   */
  private initializePaths(): void {
    this.backendPath = getAbsolutePath(this.jsonFilePath, this.jsonConfig.project.backend_path);
    this.frontendPath = getAbsolutePath(this.jsonFilePath, this.jsonConfig.project.frontend_path);
  }

  /**
   * Initialize core services
   */
  private initializeServices(): void {
    const templateProvider = new FileTemplateProvider('./templates');
    const templateEngine = new SimpleTemplateEngine();

    this.templateManager = new TemplateManager(templateProvider, templateEngine);
    this.outputManager = new FileSystemOutputManager();
    this.generatorFactory = new GeneratorFactory();
  }

  /**
   * Register all available generators
   */
  private registerGenerators(): void {
    const templateProvider = new FileTemplateProvider('./templates');
    const templateEngine = new SimpleTemplateEngine();

    // Register backend generators
    this.generatorFactory.registerGenerator('backend-controller', () =>
      new ControllerGenerator(templateProvider, templateEngine, new TypeScriptImportManager())
    );

    this.generatorFactory.registerGenerator('backend-service', () =>
      new ServiceGenerator(templateProvider, templateEngine, new TypeScriptImportManager())
    );

    this.generatorFactory.registerGenerator('backend-entity', () =>
      new EntityGenerator(templateProvider, templateEngine, new TypeScriptImportManager())
    );

    // Register common generators
    this.generatorFactory.registerGenerator('backend-module', () =>
      new ModuleGenerator(templateProvider, templateEngine, new TypeScriptImportManager())
    );

    this.generatorFactory.registerGenerator('interface', () =>
      new InterfaceGenerator(templateProvider, templateEngine, new TypeScriptImportManager())
    );

    this.generatorFactory.registerGenerator('constants', () =>
      new ConstantsGenerator(templateProvider, templateEngine, new TypeScriptImportManager())
    );
  }

  /**
   * Generate all files based on configuration
   */
  async generateAll(): Promise<boolean[]> {
    const outputs: FileOutput[] = [];

    // Generate module-level files
    for (const [moduleKey, moduleConfig] of Object.entries(this.jsonConfig.modules)) {
      const moduleContext: GenerationContext = {
        jsonConfig: this.jsonConfig,
        project: this.jsonConfig.project,
        module: moduleConfig,
        backendPath: this.backendPath,
        frontendPath: this.frontendPath,
        jsonFilePath: this.jsonFilePath
      };

      // Generate module file
      const moduleOutput = await this.generateFile('backend-module', moduleContext);
      if (moduleOutput) outputs.push(moduleOutput);

      // Generate model-level files
      for (const [modelKey, modelConfig] of Object.entries(moduleConfig.models || {})) {
        const modelContext: GenerationContext = {
          ...moduleContext,
          model: modelConfig
        };

        // Generate all applicable file types for this model
        const fileTypes = ['backend-controller', 'backend-service', 'backend-entity', 'interface', 'constants'];

        for (const fileType of fileTypes) {
          const output = await this.generateFile(fileType, modelContext);
          if (output) outputs.push(output);
        }
      }
    }

    // Generate common files if defined
    await this.generateCommonFiles(outputs);

    // Write all files
    return await this.outputManager.writeFiles(outputs);
  }

  /**
   * Generate a specific file type
   */
  private async generateFile(fileType: string, context: GenerationContext): Promise<FileOutput | null> {
    const generator = this.generatorFactory.createGenerator(fileType, context);
    if (!generator || !generator.shouldGenerate(context)) {
      return null;
    }

    try {
      const content = await generator.generateContent(context);
      const metadata = generator.getFileMetadata(context);

      return {
        filePath: metadata.filePath,
        content,
        metadata,
        overwrite: true
      };
    } catch (error) {
      console.error(`Failed to generate ${fileType}:`, error);
      return null;
    }
  }

  /**
   * Generate common files (base controllers, services, etc.)
   */
  private async generateCommonFiles(outputs: FileOutput[]): Promise<void> {
    if (this.jsonConfig.collect?.commonController) {
      const baseControllerOutput = await this.generateBaseController();
      if (baseControllerOutput) outputs.push(baseControllerOutput);
    }

    if (this.jsonConfig.collect?.commonService) {
      const baseServiceOutput = await this.generateBaseService();
      if (baseServiceOutput) outputs.push(baseServiceOutput);
    }

    if (this.jsonConfig.collect?.commonDefine) {
      const baseDefineOutput = await this.generateBaseDefine();
      if (baseDefineOutput) outputs.push(baseDefineOutput);
    }
  }

  /**
   * Generate base controller file
   */
  private async generateBaseController(): Promise<FileOutput | null> {
    const filePath = path.join(this.backendPath, 'common', 'BaseController.ts');
    const content = this.templateManager.processTemplate('base-controller', {
      className: 'BaseController',
      // Add common controller functionality
    });

    return {
      filePath,
      content,
      metadata: {
        directoryPath: path.dirname(filePath),
        fileName: 'BaseController.ts',
        filePath,
        fileType: 'base-controller',
        shouldExport: true,
        baseName: 'BaseController'
      },
      overwrite: true
    };
  }

  /**
   * Generate base service file
   */
  private async generateBaseService(): Promise<FileOutput | null> {
    const filePath = path.join(this.backendPath, 'common', 'BaseService.ts');
    const content = this.templateManager.processTemplate('base-service', {
      className: 'BaseService',
      // Add common service functionality
    });

    return {
      filePath,
      content,
      metadata: {
        directoryPath: path.dirname(filePath),
        fileName: 'BaseService.ts',
        filePath,
        fileType: 'base-service',
        shouldExport: true,
        baseName: 'BaseService'
      },
      overwrite: true
    };
  }

  /**
   * Generate base definitions file
   */
  private async generateBaseDefine(): Promise<FileOutput | null> {
    const filePath = path.join(this.backendPath, 'common', 'BaseDefine.ts');
    const content = this.templateManager.processTemplate('base-define', {
      // Add common definitions
    });

    return {
      filePath,
      content,
      metadata: {
        directoryPath: path.dirname(filePath),
        fileName: 'BaseDefine.ts',
        filePath,
        fileType: 'base-define',
        shouldExport: true,
        baseName: 'BaseDefine'
      },
      overwrite: true
    };
  }

  /**
   * Validate JSON configuration
   */
  validateConfiguration(): boolean {
    try {
      // Basic validation
      if (!this.jsonConfig.project) {
        throw new Error('Missing project configuration');
      }

      if (!this.jsonConfig.modules || Object.keys(this.jsonConfig.modules).length === 0) {
        throw new Error('No modules defined');
      }

      // Validate paths exist
      if (!fs.existsSync(path.dirname(this.backendPath))) {
        console.warn(`Backend path parent directory does not exist: ${path.dirname(this.backendPath)}`);
      }

      if (!fs.existsSync(path.dirname(this.frontendPath))) {
        console.warn(`Frontend path parent directory does not exist: ${path.dirname(this.frontendPath)}`);
      }

      return true;
    } catch (error) {
      console.error('Configuration validation failed:', error);
      return false;
    }
  }

  /**
   * Get generation statistics
   */
  getGenerationStats(): Record<string, number> {
    const stats: Record<string, number> = {};

    for (const moduleConfig of Object.values(this.jsonConfig.modules)) {
      for (const modelConfig of Object.values(moduleConfig.models || {})) {
        if (modelConfig.exportController) {
          stats['controllers'] = (stats['controllers'] || 0) + 1;
        }
        if (modelConfig.exportService) {
          stats['services'] = (stats['services'] || 0) + 1;
        }
        if (modelConfig.joinModuleImports) {
          stats['entities'] = (stats['entities'] || 0) + 1;
        }
        if (modelConfig.exportInterface) {
          stats['interfaces'] = (stats['interfaces'] || 0) + 1;
        }
      }
    }

    stats['modules'] = Object.keys(this.jsonConfig.modules).length;

    return stats;
  }
}

/**
 * Factory function to create generator instances
 */
export function createModernCrudGenerator(jsonFilePath: string, jsonConfig?: JsonFile): ModernCrudGenerator {
  return new ModernCrudGenerator(jsonFilePath, jsonConfig);
}

/**
 * Utility function to generate from JSON file
 */
export async function generateFromJsonFile(jsonFilePath: string): Promise<boolean> {
  try {
    const generator = createModernCrudGenerator(jsonFilePath);

    if (!generator.validateConfiguration()) {
      console.error('Configuration validation failed');
      return false;
    }

    console.log('Starting generation...');
    console.log('Statistics:', generator.getGenerationStats());

    const results = await generator.generateAll();
    const successCount = results.filter(r => r).length;
    const totalCount = results.length;

    console.log(`Generation completed: ${successCount}/${totalCount} files generated successfully`);

    return successCount === totalCount;
  } catch (error) {
    console.error('Generation failed:', error);
    return false;
  }
}
