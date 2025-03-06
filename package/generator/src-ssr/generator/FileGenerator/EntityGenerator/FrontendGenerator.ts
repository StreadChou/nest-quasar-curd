import {AbsEntityGenerator} from "app/src-ssr/generator/FileGenerator/EntityGenerator/AbsEntityGenerator";

export class FrontendGenerator extends AbsEntityGenerator {
  getFileContent(): string {
    return "";
  }

  getFilePath(): string {
    return "";
  }

  start() {

  }

  override isFrontend(): boolean {
    return true;
  }
}
