/** 首字母小写 */
export function lowercaseFirstLetter(str: string): string {
  if (!str) return '';
  return str.charAt(0).toLowerCase() + str.slice(1);
}


/** 首字母大写 */
export function uppercaseFirstLetter(str: string): string {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}
