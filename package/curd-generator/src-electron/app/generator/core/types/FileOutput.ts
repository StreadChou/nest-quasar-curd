import { FileMetadata } from "./FileMetadata";

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