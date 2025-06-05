export interface ProjectHistoryItem {
  /** 项目名称 */
  project: string;
  /** 文件路径 */
  file_path: string;
  /** module 数量 */
  modules_number: number;
  /** model 数量 */
  models_number: number;
  /** 创建时间 */
  created_at: number;
  /** 更新时间 */
  updated_at: number;
}
