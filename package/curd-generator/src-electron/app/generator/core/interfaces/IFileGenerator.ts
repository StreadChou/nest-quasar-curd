import { GenerationContext } from "../types/GenerationContext";
import { FileMetadata } from "../types/FileMetadata";

/**
 * Core interface for file generators
 * Following Single Responsibility Principle - only handles file generation logic
 */
export interface IFileGenerator {
  /**
   * Generates file content based on the provided context
   * @param context Generation context containing all necessary data
   * @returns Generated file content as string
   */
  generateContent(context: GenerationContext): Promise<string>;

  /**
   * Determines if this generator should generate a file for the given context
   * @param context Generation context
   * @returns true if file should be generated, false otherwise
   */
  shouldGenerate(context: GenerationContext): boolean;

  /**
   * Gets metadata about the file that will be generated
   * @param context Generation context
   * @returns File metadata including path, name, type etc.
   */
  getFileMetadata(context: GenerationContext): FileMetadata;

  /**
   * Gets the generator type identifier
   * @returns String identifier for this generator type
   */
  getType(): string;
}