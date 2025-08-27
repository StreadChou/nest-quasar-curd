import { IFileGenerator } from "../interfaces/IFileGenerator";
import { ITemplateProvider, ITemplateEngine } from "../interfaces/ITemplateProvider";
import { IImportManager } from "../interfaces/IOutputManager";
import { GenerationContext } from "../types/GenerationContext";
import { FileMetadata } from "../types/FileMetadata";

/**
 * Abstract base class for all file generators
 * Provides common functionality and enforces interface implementation
 */
export abstract class BaseFileGenerator implements IFileGenerator {
  protected templateProvider: ITemplateProvider;
  protected templateEngine: ITemplateEngine;
  protected importManager: IImportManager;

  constructor(
    templateProvider: ITemplateProvider,
    templateEngine: ITemplateEngine,
    importManager: IImportManager
  ) {
    this.templateProvider = templateProvider;
    this.templateEngine = templateEngine;
    this.importManager = importManager;
  }

  /**
   * Template method pattern - defines the algorithm structure
   */
  async generateContent(context: GenerationContext): Promise<string> {
    if (!this.shouldGenerate(context)) {
      return '';
    }

    // Clear previous imports
    this.importManager.clear();

    // Prepare template data
    const templateData = this.prepareTemplateData(context);
    
    // Add necessary imports
    this.addImports(context, templateData);
    
    // Get template content
    const template = this.getTemplate(context);
    
    // Process template with data
    const processedContent = this.templateEngine.process(template, templateData);
    
    // Generate import statements
    const imports = this.importManager.generateImportStatements();
    
    // Combine imports and content
    return this.combineImportsAndContent(imports, processedContent);
  }

  /**
   * Abstract methods to be implemented by concrete generators
   */
  abstract shouldGenerate(context: GenerationContext): boolean;
  abstract getFileMetadata(context: GenerationContext): FileMetadata;
  abstract getType(): string;

  /**
   * Protected methods that can be overridden by subclasses
   */
  protected abstract prepareTemplateData(context: GenerationContext): Record<string, any>;
  protected abstract addImports(context: GenerationContext, templateData: Record<string, any>): void;
  protected abstract getTemplate(context: GenerationContext): string;

  /**
   * Default implementation for combining imports and content
   */
  protected combineImportsAndContent(imports: string[], content: string): string {
    const importSection = imports.length > 0 ? imports.join('\n') + '\n\n' : '';
    return importSection + content;
  }

  /**
   * Utility method to get file extension based on type
   */
  protected getFileExtension(): string {
    return '.ts';  // Default to TypeScript
  }

  /**
   * Utility method to sanitize class/interface names
   */
  protected sanitizeName(name: string): string {
    // Remove special characters and capitalize first letter
    return name.replace(/[^a-zA-Z0-9]/g, '')
               .replace(/^./, str => str.toUpperCase());
  }

  /**
   * Utility method to convert to camelCase
   */
  protected toCamelCase(name: string): string {
    return name.replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase());
  }

  /**
   * Utility method to convert to PascalCase
   */
  protected toPascalCase(name: string): string {
    const camelCase = this.toCamelCase(name);
    return camelCase.charAt(0).toUpperCase() + camelCase.slice(1);
  }
}