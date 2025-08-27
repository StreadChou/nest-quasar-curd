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