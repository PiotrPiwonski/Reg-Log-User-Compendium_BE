import { HttpException } from './index';

export class ValidationException extends HttpException {
  constructor(message: string) {
    super(400, message);
  }
}
