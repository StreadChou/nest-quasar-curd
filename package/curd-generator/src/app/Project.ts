import {JsonFile} from "app/type/JsonFileDefine/Index";
import {InvokeProxy} from "src/library/InvokeProxy";

export class Project {
  data: JsonFile;
  file_path: string
  

  constructor(data: JsonFile, file_path: string) {
    this.data = data;
    this.file_path = file_path;
  }

  async saveData() {
    const data_string = JSON.stringify(this.data, null, 2)
    const data = await InvokeProxy("FileHandler.saveJsonFile", this.file_path, data_string)

  }
}
