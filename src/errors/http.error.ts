import { AppError } from "./app.error";

export class HttpError extends AppError {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
  }
}
