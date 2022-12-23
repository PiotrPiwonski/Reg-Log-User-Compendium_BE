import { HttpException } from './http.exception';

export class ValidationException extends HttpException {
  constructor(message: string) {
    super(400, message);
  }
}
