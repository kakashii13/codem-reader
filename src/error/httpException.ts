export class HttpException extends Error {
  errorCode: number;
  constructor(errorCode: number, message: string | any) {
    super(message);
    this.errorCode = errorCode;
  }
}
