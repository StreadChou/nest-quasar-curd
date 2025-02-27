import path from "node:path";
import fs from "node:fs";

/** 获取from如果需要引用target的相对路径(传入必须是绝对路径) */
export function getTwoTsFileImportPath(from: string, target: string) {
// 计算相对路径
  let relativePath = path.relative(path.dirname(from), target);
  // 去掉 .ts 扩展名
  relativePath = relativePath.replace(/\.ts$/, '');
  if (!relativePath.startsWith('.')) relativePath = './' + relativePath;

  return relativePath;
}


export function writeToFile(filePath: string, content: string) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, {recursive: true});
  fs.writeFileSync(filePath, content);
}
