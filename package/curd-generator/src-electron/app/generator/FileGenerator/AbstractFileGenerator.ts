import fs from "fs";

export abstract class AbstractFileGenerator {

  /** 获取原本的内容 */
  loadRawContent() {
    if (!fs.existsSync(this.getFilePath())) return ""
    return fs.readFileSync(this.getFilePath(), "utf-8").toString();
  }

  /** 替换用户自定义的内容 */
  replaceCustomerInfo(raw: string, content: string, key: string) {
    const pattern = new RegExp(
      `(\\s// CUSTOMER ${key} START)([\\s\\S]*?)(// CUSTOMER ${key} END)`,
      'g'
    );
    const matchRes = raw.match(pattern);
    if (!matchRes) return content;
    content = content.replace(pattern, matchRes[0])


    return content;
  }


  writeFileContent(content: string) {
    const dir_path = this.getDirPath();
    if (!fs.existsSync(dir_path)) fs.mkdirSync(dir_path, {recursive: true});
    const file_path = this.getFilePath();
    fs.writeFileSync(file_path, content);
  }






}

