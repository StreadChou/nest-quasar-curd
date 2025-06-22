export class ElectronException extends Error {
  code: number
  data: any

  constructor(message: string, code: number, data: any) {
    super(message);
    this.code = code;
    this.data = data;
  }

  toClient() {
    return {code: this.code, message: this.message, data: this.data, stack: this.stack}
  }

}
