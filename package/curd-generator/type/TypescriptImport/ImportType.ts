export enum ImportType {
  /** import * as xxx from 'xxx' */
  ImportAnyAs = "ImportAnyAs",
  /** import xxx from 'xxx' */
  ImportDefault = "ImportDefault",
  /** import { xxx } from 'xxx' */
  ImportItem = "ImportItem",
}


export const ImportTypeOption = [
  {label: "import * as xxx from 'xxx'", value: ImportType.ImportAnyAs},
  {label: "import xxx from 'xxx'", value: ImportType.ImportDefault},
  {label: "import { xxx } from 'xxx'", value: ImportType.ImportItem},
]


export interface ImportDataConfig {
  /** 数据类型: 默认 any */
  type: string,
  /** 需要导入的内容 */
  imports: Array<{
    from: "project" | "file",
    name: string,
    file: string,
    type: ImportType,
  }>,
}
