import { IOutputManager, IImportManager } from "../interfaces/IOutputManager";
import { FileOutput } from "../types/FileOutput";
import * as fs from "fs";
import * as path from "path";

/**
 * File system output manager
 */
export class FileSystemOutputManager implements IOutputManager {
  async writeFile(output: FileOutput): Promise<boolean> {
    try {
      // Ensure directory exists
      const dirPath = path.dirname(output.filePath);
      await this.ensureDirectory(dirPath);

      // Handle existing files with customer sections
      const finalContent = await this.preserveCustomerSections(output);

      // Write file
      fs.writeFileSync(output.filePath, finalContent, 'utf-8');
      return true;
    } catch (error) {
      console.error(`Failed to write file ${output.filePath}:`, error);
      return false;
    }
  }

  async writeFiles(outputs: FileOutput[]): Promise<boolean[]> {
    const results: boolean[] = [];
    
    for (const output of outputs) {
      const result = await this.writeFile(output);
      results.push(result);
    }

    return results;
  }

  async fileExists(filePath: string): Promise<boolean> {
    try {
      return fs.existsSync(filePath);
    } catch {
      return false;
    }
  }

  async ensureDirectory(dirPath: string): Promise<boolean> {
    try {
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
      }
      return true;
    } catch (error) {
      console.error(`Failed to create directory ${dirPath}:`, error);
      return false;
    }
  }

  async readFile(filePath: string): Promise<string | null> {
    try {
      if (!fs.existsSync(filePath)) {
        return null;
      }
      return fs.readFileSync(filePath, 'utf-8');
    } catch (error) {
      console.error(`Failed to read file ${filePath}:`, error);
      return null;
    }
  }

  /**
   * Preserves customer sections when overwriting files
   */
  private async preserveCustomerSections(output: FileOutput): Promise<string> {
    const existingContent = await this.readFile(output.filePath);
    
    if (!existingContent) {
      return output.content;
    }

    // Extract customer sections from existing file
    const customerSections = this.extractCustomerSections(existingContent);
    
    // Insert customer sections into new content
    return this.insertCustomerSections(output.content, customerSections);
  }

  /**
   * Extracts customer sections from existing file content
   */
  private extractCustomerSections(content: string): Record<string, string> {
    const sections: Record<string, string> = {};
    const pattern = /\/\/ CUSTOMER (\w+) START([\s\S]*?)\/\/ CUSTOMER \1 END/g;
    
    let match;
    while ((match = pattern.exec(content)) !== null) {
      const [fullMatch, sectionName, sectionContent] = match;
      sections[sectionName] = fullMatch;
    }

    return sections;
  }

  /**
   * Inserts customer sections into new content
   */
  private insertCustomerSections(newContent: string, customerSections: Record<string, string>): string {
    let result = newContent;

    Object.keys(customerSections).forEach(sectionName => {
      const placeholder = `// CUSTOMER ${sectionName} START\n// CUSTOMER ${sectionName} END`;
      result = result.replace(placeholder, customerSections[sectionName]);
    });

    return result;
  }
}

/**
 * Import manager for TypeScript imports
 */
export class TypeScriptImportManager implements IImportManager {
  private imports = new Map<string, Set<string>>();
  private defaultImports = new Map<string, string>();
  private namespaceImports = new Map<string, string>();

  addImport(importPath: string, importName: string, importType: 'default' | 'named' | 'namespace'): void {
    switch (importType) {
      case 'default':
        this.defaultImports.set(importPath, importName);
        break;
      case 'named':
        if (!this.imports.has(importPath)) {
          this.imports.set(importPath, new Set());
        }
        this.imports.get(importPath)!.add(importName);
        break;
      case 'namespace':
        this.namespaceImports.set(importPath, importName);
        break;
    }
  }

  addImports(importPath: string, imports: string[], importType: 'named'): void {
    imports.forEach(importName => {
      this.addImport(importPath, importName, importType);
    });
  }

  generateImportStatements(): string[] {
    const statements: string[] = [];

    // Sort imports by type: external packages first, then relative imports
    const allPaths = new Set([
      ...this.imports.keys(),
      ...this.defaultImports.keys(),
      ...this.namespaceImports.keys()
    ]);

    const externalPaths = Array.from(allPaths).filter(p => !p.startsWith('.'));
    const relativePaths = Array.from(allPaths).filter(p => p.startsWith('.'));

    [...externalPaths, ...relativePaths].forEach(importPath => {
      const parts: string[] = [];

      // Add default import
      if (this.defaultImports.has(importPath)) {
        parts.push(this.defaultImports.get(importPath)!);
      }

      // Add named imports
      if (this.imports.has(importPath) && this.imports.get(importPath)!.size > 0) {
        const namedImports = Array.from(this.imports.get(importPath)!).sort();
        parts.push(`{ ${namedImports.join(', ')} }`);
      }

      // Add namespace import
      if (this.namespaceImports.has(importPath)) {
        parts.push(`* as ${this.namespaceImports.get(importPath)!}`);
      }

      if (parts.length > 0) {
        statements.push(`import ${parts.join(', ')} from '${importPath}';`);
      }
    });

    return statements;
  }

  clear(): void {
    this.imports.clear();
    this.defaultImports.clear();
    this.namespaceImports.clear();
  }

  /**
   * Adds common NestJS imports
   */
  addNestJSCommonImport(name: string): void {
    this.addImport('@nestjs/common', name, 'named');
  }

  addNestJSCommonImports(names: string[]): void {
    this.addImports('@nestjs/common', names, 'named');
  }

  /**
   * Adds TypeORM imports
   */
  addTypeOrmImport(name: string): void {
    this.addImport('typeorm', name, 'named');
  }

  addTypeOrmImports(names: string[]): void {
    this.addImports('typeorm', names, 'named');
  }

  /**
   * Adds relative import for another generator file
   */
  addRelativeImport(currentFilePath: string, targetFilePath: string, importName: string): void {
    const relativePath = this.getRelativeImportPath(currentFilePath, targetFilePath);
    this.addImport(relativePath, importName, 'named');
  }

  /**
   * Calculates relative import path between two TypeScript files
   */
  private getRelativeImportPath(fromFile: string, toFile: string): string {
    const fromDir = path.dirname(fromFile);
    const toDir = path.dirname(toFile);
    const toBasename = path.basename(toFile, path.extname(toFile));

    let relativePath = path.relative(fromDir, path.join(toDir, toBasename));
    
    if (!relativePath.startsWith('.')) {
      relativePath = './' + relativePath;
    }

    return relativePath.replace(/\\/g, '/'); // Normalize path separators
  }
}