import { ModernCrudGenerator, generateFromJsonFile } from "./ModernCrudGenerator";
import * as fs from "fs";
import * as path from "path";

/**
 * Migration utility to convert .nqcurd files to .json files
 */
export class LegacyMigrator {
  /**
   * Convert .nqcurd file to .json file
   */
  static convertNqcurdToJson(nqcurdPath: string, outputPath?: string): string {
    const content = fs.readFileSync(nqcurdPath, 'utf-8');
    const jsonData = JSON.parse(content);
    
    const outputFile = outputPath || nqcurdPath.replace('.nqcurd', '.json');
    fs.writeFileSync(outputFile, JSON.stringify(jsonData, null, 2), 'utf-8');
    
    console.log(`Converted ${nqcurdPath} to ${outputFile}`);
    return outputFile;
  }

  /**
   * Migrate entire directory from .nqcurd to .json
   */
  static migrateDirectory(directoryPath: string): string[] {
    const convertedFiles: string[] = [];
    const files = fs.readdirSync(directoryPath);
    
    files.forEach(file => {
      if (file.endsWith('.nqcurd')) {
        const fullPath = path.join(directoryPath, file);
        const outputPath = this.convertNqcurdToJson(fullPath);
        convertedFiles.push(outputPath);
      }
    });
    
    return convertedFiles;
  }
}

/**
 * Usage examples and testing utilities
 */
export class GeneratorUsageExamples {
  /**
   * Example: Generate from JSON configuration
   */
  static async exampleBasicGeneration(): Promise<void> {
    const jsonPath = '/path/to/your/config.json';
    const success = await generateFromJsonFile(jsonPath);
    
    if (success) {
      console.log('Generation completed successfully!');
    } else {
      console.log('Generation failed. Check console for errors.');
    }
  }

  /**
   * Example: Advanced usage with custom configuration
   */
  static async exampleAdvancedUsage(): Promise<void> {
    // Create a sample JSON configuration
    const sampleConfig = {
      project: {
        name: "My CRUD Project",
        created_at: Date.now(),
        updated_at: Date.now(),
        backend_path: "./src/backend",
        frontend_path: "./src/frontend"
      },
      collect: {
        commonController: true,
        commonService: true,
        commonDefine: true
      },
      modules: {
        "user-module": {
          name: "UserModule",
          fileName: "user-module",
          models: {
            "user": {
              name: "User",
              dbName: "users",
              joinModuleImports: true,
              exportController: true,
              controllerClassName: "UserController",
              curdPath: "users",
              joinModuleControllers: true,
              exportService: true,
              serviceName: "UserService",
              joinModuleProviders: true,
              joinModuleExports: true,
              exportInterface: true,
              attrs: [
                {
                  name: "id",
                  type: "increment_id",
                  nullable: false
                },
                {
                  name: "email",
                  type: "string",
                  nullable: false,
                  length: 255
                },
                {
                  name: "name",
                  type: "string",
                  nullable: true,
                  length: 100
                },
                {
                  name: "isActive",
                  type: "boolean",
                  nullable: false
                },
                {
                  name: "createdAt",
                  type: "created_time",
                  nullable: false
                },
                {
                  name: "updatedAt",
                  type: "updated_time",
                  nullable: false
                }
              ],
              constant: [
                {
                  name: "USER_STATUS",
                  value: "{ ACTIVE: 'active', INACTIVE: 'inactive' }",
                  exports: [
                    { name: "USER_STATUS", isDefault: false }
                  ]
                }
              ]
            }
          }
        }
      }
    };

    // Save sample configuration
    const configPath = './sample-config.json';
    fs.writeFileSync(configPath, JSON.stringify(sampleConfig, null, 2), 'utf-8');

    // Generate files
    const generator = new ModernCrudGenerator(configPath, sampleConfig);
    
    if (generator.validateConfiguration()) {
      console.log('Configuration is valid');
      console.log('Generation statistics:', generator.getGenerationStats());
      
      const results = await generator.generateAll();
      const successCount = results.filter(r => r).length;
      
      console.log(`Generated ${successCount} files successfully`);
    }
  }

  /**
   * Example: Batch processing multiple configurations
   */
  static async exampleBatchProcessing(configDirectory: string): Promise<void> {
    const jsonFiles = fs.readdirSync(configDirectory)
      .filter(file => file.endsWith('.json'))
      .map(file => path.join(configDirectory, file));

    console.log(`Processing ${jsonFiles.length} configuration files...`);

    for (const jsonFile of jsonFiles) {
      try {
        console.log(`Processing ${jsonFile}...`);
        const success = await generateFromJsonFile(jsonFile);
        console.log(`${jsonFile}: ${success ? 'Success' : 'Failed'}`);
      } catch (error) {
        console.error(`Error processing ${jsonFile}:`, error);
      }
    }
  }

  /**
   * Create a comprehensive test configuration
   */
  static createTestConfiguration(outputPath: string): void {
    const testConfig = {
      project: {
        name: "Comprehensive Test Project",
        created_at: Date.now(),
        updated_at: Date.now(),
        backend_path: "./test-output/backend",
        frontend_path: "./test-output/frontend"
      },
      collect: {
        commonController: true,
        commonService: true,
        commonDefine: true
      },
      modules: {
        "auth-module": {
          name: "AuthModule",
          fileName: "auth-module",
          models: {
            "user": {
              name: "User",
              dbName: "users",
              joinModuleImports: true,
              exportController: true,
              controllerClassName: "UserController",
              curdPath: "users",
              joinModuleControllers: true,
              exportService: true,
              serviceName: "UserService",
              joinModuleProviders: true,
              joinModuleExports: true,
              exportInterface: true,
              attrs: [
                { name: "id", type: "increment_id", nullable: false },
                { name: "email", type: "string", nullable: false, length: 255 },
                { name: "password", type: "string", nullable: false, length: 255 },
                { name: "firstName", type: "string", nullable: true, length: 50 },
                { name: "lastName", type: "string", nullable: true, length: 50 },
                { name: "isActive", type: "boolean", nullable: false },
                { name: "lastLoginAt", type: "date", nullable: true },
                { name: "metadata", type: "json", nullable: true },
                { name: "createdAt", type: "created_time", nullable: false },
                { name: "updatedAt", type: "updated_time", nullable: false }
              ],
              constant: [
                {
                  name: "USER_ROLES",
                  value: "{ ADMIN: 'admin', USER: 'user', MODERATOR: 'moderator' }",
                  exports: [{ name: "USER_ROLES", isDefault: false }]
                }
              ]
            },
            "role": {
              name: "Role",
              dbName: "roles",
              joinModuleImports: true,
              exportController: true,
              controllerClassName: "RoleController",
              exportService: true,
              serviceName: "RoleService",
              joinModuleProviders: true,
              exportInterface: true,
              attrs: [
                { name: "id", type: "increment_id", nullable: false },
                { name: "name", type: "string", nullable: false, length: 50 },
                { name: "description", type: "string", nullable: true, length: 255 },
                { name: "permissions", type: "json", nullable: true },
                { name: "createdAt", type: "created_time", nullable: false },
                { name: "updatedAt", type: "updated_time", nullable: false }
              ],
              constant: []
            }
          }
        },
        "blog-module": {
          name: "BlogModule",
          fileName: "blog-module",
          models: {
            "post": {
              name: "Post",
              dbName: "posts",
              joinModuleImports: true,
              exportController: true,
              controllerClassName: "PostController",
              exportService: true,
              serviceName: "PostService",
              joinModuleProviders: true,
              exportInterface: true,
              attrs: [
                { name: "id", type: "increment_id", nullable: false },
                { name: "title", type: "string", nullable: false, length: 255 },
                { name: "content", type: "string", nullable: false },
                { name: "published", type: "boolean", nullable: false },
                { name: "publishedAt", type: "date", nullable: true },
                { name: "createdAt", type: "created_time", nullable: false },
                { name: "updatedAt", type: "updated_time", nullable: false }
              ],
              constant: [
                {
                  name: "POST_STATUS",
                  value: "{ DRAFT: 'draft', PUBLISHED: 'published', ARCHIVED: 'archived' }",
                  exports: [{ name: "POST_STATUS", isDefault: false }]
                }
              ]
            }
          }
        }
      }
    };

    fs.writeFileSync(outputPath, JSON.stringify(testConfig, null, 2), 'utf-8');
    console.log(`Test configuration saved to ${outputPath}`);
  }
}

// Export for use in migration scripts
export { ModernCrudGenerator, generateFromJsonFile, LegacyMigrator, GeneratorUsageExamples };