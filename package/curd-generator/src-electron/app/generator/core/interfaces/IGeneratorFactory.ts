import { IFileGenerator } from "./IFileGenerator";
import { GenerationContext } from "../types/GenerationContext";

/**
 * Factory interface for creating file generators
 * Following Factory Pattern and Open/Closed Principle
 */
export interface IGeneratorFactory {
  /**
   * Creates appropriate generator for the given file type
   * @param fileType Type of file to generate
   * @param context Generation context
   * @returns File generator instance or null if no generator available
   */
  createGenerator(fileType: string, context: GenerationContext): IFileGenerator | null;

  /**
   * Registers a new generator type
   * @param fileType File type identifier
   * @param generatorClass Generator class constructor
   */
  registerGenerator(fileType: string, generatorClass: new () => IFileGenerator): void;

  /**
   * Gets all supported file types
   * @returns Array of supported file type identifiers
   */
  getSupportedTypes(): string[];

  /**
   * Checks if a file type is supported
   * @param fileType File type to check
   * @returns true if supported, false otherwise
   */
  isTypeSupported(fileType: string): boolean;
}