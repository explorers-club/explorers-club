export enum ErrorType {
  NOT_FOUND = 'NOT_FOUND',
}

// TODO here we can add custom error types
export class CustomError extends Error {
  constructor(message: ErrorType) {
    super(message);
    Object.setPrototypeOf(this, CustomError.prototype);
  }
}
