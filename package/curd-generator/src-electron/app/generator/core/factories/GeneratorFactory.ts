import { IGeneratorFactory } from "../interfaces/IGeneratorFactory";
import { IFileGenerator } from "../interfaces/IFileGenerator";
import { GenerationContext } from "../types/GenerationContext";

/**
 * Concrete implementation of the Generator Factory
 * Following Factory Pattern and Open/Closed Principle
 */
export class GeneratorFactory implements IGeneratorFactory {
  private generators = new Map<string, new () => IFileGenerator>();

  /**
   * Creates appropriate generator for the given file type
   */
  createGenerator(fileType: string, context: GenerationContext): IFileGenerator | null {
    const GeneratorClass = this.generators.get(fileType);
    if (!GeneratorClass) {
      return null;
    }

    return new GeneratorClass();
  }

  /**
   * Registers a new generator type
   */
  registerGenerator(fileType: string, generatorClass: new () => IFileGenerator): void {
    this.generators.set(fileType, generatorClass);
  }

  /**
   * Gets all supported file types
   */
  getSupportedTypes(): string[] {
    return Array.from(this.generators.keys());
  }

  /**
   * Checks if a file type is supported
   */
  isTypeSupported(fileType: string): boolean {
    return this.generators.has(fileType);
  }

  /**
   * Registers all default generators
   */
  registerDefaultGenerators(): void {
    // Import and register default generators
    this.registerBackendGenerators();
    this.registerFrontendGenerators();
    this.registerCommonGenerators();
  }

  private registerBackendGenerators(): void {
    // These will be registered by the main generator class
    // Examples: 'backend-controller', 'backend-service', 'backend-entity', 'backend-module'
  }

  private registerFrontendGenerators(): void {
    // Frontend generators will be registered here when implemented
    // Examples: 'frontend-component', 'frontend-service', 'frontend-interface'
  }

  private registerCommonGenerators(): void {
    // These will be registered by the main generator class
    // Examples: 'interface', 'constant', 'type-definition'
  }
}