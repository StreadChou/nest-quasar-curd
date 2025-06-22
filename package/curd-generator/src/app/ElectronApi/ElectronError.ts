export class ElectronError extends Error {
  code: number
  data: any

  constructor(message: string, code: number, data: any, stack?: string) {
    super(message);
    this.code = code;
    this.data = data;
    if (stack) this.stack = stack;
  }
}
