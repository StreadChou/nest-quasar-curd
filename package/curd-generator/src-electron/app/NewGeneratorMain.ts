/**
 * New Modern CRUD Generator - Entry Point
 * 
 * This is the new main entry point for the modernized CRUD generator.
 * The old files (RootGenerator.ts, ModuleGenerator.ts, ModelGenerator.ts) are now deprecated
 * in favor of this new architecture that follows SOLID principles and design patterns.
 * 
 * Key improvements:
 * - Factory Pattern for generator creation
 * - Strategy Pattern for different generation approaches
 * - Builder Pattern for complex content construction
 * - Template management separation
 * - Clean output management
 * - Supports .json files instead of .nqcurd
 * - Removes database default value generation
 * - Better error handling and validation
 * - Extensible architecture for new file types
 */

import { generateFromJsonFile, ModernCrudGenerator, LegacyMigrator } from "./ModernCrudGenerator";

// Main execution for testing with updated path handling
async function main() {
  try {
    // Example with a JSON file (new approach)
    const jsonFile = `/Volumes/Project/003_Stread/nest-quasar-curd/example/test.json`;
    
    console.log('='.repeat(50));
    console.log('Modern CRUD Generator - JSON Configuration');
    console.log('='.repeat(50));
    
    const success = await generateFromJsonFile(jsonFile);
    
    if (success) {
      console.log('✅ Generation completed successfully!');
    } else {
      console.log('❌ Generation failed. Check console for errors.');
    }
    
  } catch (error) {
    console.error('❌ Error during generation:', error);
  }
}

// Export the main components
export {
  ModernCrudGenerator,
  generateFromJsonFile,
  LegacyMigrator
};

// Run main if this file is executed directly
if (require.main === module) {
  main().catch(console.error);
}