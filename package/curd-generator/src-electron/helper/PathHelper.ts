import path from "path";

/** 获取from如果需要引用target的相对路径(传入必须是绝对路径) */
export function getTwoTsFileImportPath(from: string, target: string) {
// 计算相对路径
  let relativePath = path.relative(path.dirname(from), target);
  // 去掉 .ts 扩展名
  relativePath = relativePath.replace(/\.ts$/, '');
  if (!relativePath.startsWith('.')) relativePath = './' + relativePath;

  return relativePath;
}

export function getImportPath(from: string, target: string) {
  if (path.extname(target) == ".ts") {
    return getTwoTsFileImportPath(from, target)
  } else {
    return target;
  }
}
