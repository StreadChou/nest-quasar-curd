import {Module} from "app/src-ssr/types/Module";
import {Table} from "app/src-ssr/types/Table";
import {Template} from "app/src-ssr/types/Template";

export interface InputJson {
  /** 模块 */
  modules: Array<Module>;
  /** 表 */
  tables: Array<Table>;
  /** 模板 */
  templates: Template;
}
