import { JsonFile } from "../../../type/JsonFileDefine/Index";
import { ModelConfig } from "../../../type/JsonFileDefine/Model";
import { ModuleConfig } from "../../../type/JsonFileDefine/Module";
import { ProjectConfig } from "../../../type/JsonFileDefine/Project";

/**
 * Generation context containing all data needed for file generation
 */
export interface GenerationContext {
  /** Complete JSON configuration */
  jsonConfig: JsonFile;
  
  /** Project configuration */
  project: ProjectConfig;
  
  /** Current module configuration (if applicable) */
  module?: ModuleConfig;
  
  /** Current model configuration (if applicable) */
  model?: ModelConfig;
  
  /** Backend output path */
  backendPath: string;
  
  /** Frontend output path */
  frontendPath: string;
  
  /** Source JSON file path */
  jsonFilePath: string;
  
  /** Additional context data */
  additionalData?: Record<string, any>;
}

/**
 * File metadata information
 */
export interface FileMetadata {
  /** Directory path where file should be created */
  directoryPath: string;
  
  /** File name with extension */
  fileName: string;
  
  /** Full file path */
  filePath: string;
  
  /** File type identifier */
  fileType: string;
  
  /** Whether file should be exported */
  shouldExport: boolean;
  
  /** Base class/interface name */
  baseName: string;
  
  /** Additional metadata */
  metadata?: Record<string, any>;
}

/**
 * File output data
 */
export interface FileOutput {
  /** File path where content should be written */
  filePath: string;
  
  /** File content */
  content: string;
  
  /** File metadata */
  metadata: FileMetadata;
  
  /** Whether to overwrite existing file */
  overwrite?: boolean;
}