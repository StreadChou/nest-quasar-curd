import * as path from "path";

export function GetFileBasenameNoExt(_path: string) {
    const basename = path.basename(_path)
    const extname = path.extname(_path)
    return basename.replace(extname, "");
}

export function toCamelCase(input: string): string {
    return input
        // 使用正则表达式匹配非字母数字字符并替换为空格
        .replace(/[^a-zA-Z0-9]+/g, ' ')
        // 将字符串拆分为单词数组
        .split(' ')
        // 将每个单词的首字母大写
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        // 将数组中的单词连接成一个字符串
        .join('');
}