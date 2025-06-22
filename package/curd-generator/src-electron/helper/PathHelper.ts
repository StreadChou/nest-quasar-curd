import path from "path";

/** 获取target文件相对于from的相对路径 */
export function getRelativePath(from: string, target: string) {
  // 计算相对路径
  let relativePath = path.relative(path.dirname(from), target);
  if (!relativePath.startsWith('.')) relativePath = './' + relativePath;
  return relativePath;
}

/** 将相对路径还原为绝对路径（基于from文件） */
export function getAbsolutePath(from: string, relativePath: string) {
  return path.resolve(path.dirname(from), relativePath);
}

/** 获取from如果需要引用target的相对路径(传入必须是绝对路径) */
export function getTwoTsFileImportPath(from: string, target: string, removeExtension = true) {
  // 计算相对路径
  let relativePath = getRelativePath(from, target);
  // 去掉 .ts 扩展名
  if (removeExtension) relativePath = relativePath.replace(/\.ts$/, '');
  return relativePath;
}

export function getImportPath(from: string, target: string) {
  if (path.extname(target) == ".ts") {
    return getTwoTsFileImportPath(from, target)
  } else {
    return target;
  }
}
