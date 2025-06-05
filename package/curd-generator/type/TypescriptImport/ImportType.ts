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
