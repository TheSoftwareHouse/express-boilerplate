export class AppError extends Error {
  constructor(message: string) {
    super(message);

    Error.captureStackTrace(this, AppError.captureStackTrace);
  }
}
