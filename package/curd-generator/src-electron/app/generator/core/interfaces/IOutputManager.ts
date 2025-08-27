import { FileOutput } from "../types/FileOutput";

/**
 * Interface for output managers
 * Following Single Responsibility Principle - only handles file output operations
 */
export interface IOutputManager {
  /**
   * Writes file to the file system
   * @param output File output containing path and content
   * @returns Promise resolving to true if successful, false otherwise
   */
  writeFile(output: FileOutput): Promise<boolean>;

  /**
   * Writes multiple files to the file system
   * @param outputs Array of file outputs
   * @returns Promise resolving to array of results (true for success, false for failure)
   */
  writeFiles(outputs: FileOutput[]): Promise<boolean[]>;

  /**
   * Checks if file exists
   * @param filePath Path to the file
   * @returns Promise resolving to true if file exists, false otherwise
   */
  fileExists(filePath: string): Promise<boolean>;

  /**
   * Creates directory if it doesn't exist
   * @param dirPath Path to the directory
   * @returns Promise resolving to true if successful, false otherwise
   */
  ensureDirectory(dirPath: string): Promise<boolean>;

  /**
   * Reads existing file content
   * @param filePath Path to the file
   * @returns Promise resolving to file content or null if file doesn't exist
   */
  readFile(filePath: string): Promise<string | null>;
}

/**
 * Interface for import managers
 * Following Single Responsibility Principle - only handles import statement management
 */
export interface IImportManager {
  /**
   * Adds an import statement
   * @param importPath Path to import from
   * @param importName Name to import
   * @param importType Type of import (default, named, namespace)
   */
  addImport(importPath: string, importName: string, importType: 'default' | 'named' | 'namespace'): void;

  /**
   * Adds multiple imports from the same path
   * @param importPath Path to import from
   * @param imports Array of import names
   * @param importType Type of imports
   */
  addImports(importPath: string, imports: string[], importType: 'named'): void;

  /**
   * Generates import statements
   * @returns Array of import statement strings
   */
  generateImportStatements(): string[];

  /**
   * Clears all imports
   */
  clear(): void;
}