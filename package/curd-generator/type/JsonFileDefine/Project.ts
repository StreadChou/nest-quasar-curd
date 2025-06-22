/** 项目配置 */
export interface ProjectConfig {
  /** 项目名称 */
  name: string;
  /** 创建时间 */
  created_at: number;
  /** 更新时间 */
  updated_at: number;
  /** 后端路径 */
  backend_path: string;
  /** 前端路径 */
  frontend_path: string;
}
