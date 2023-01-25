import { HttpException } from './index';

export class WrongRefreshTokenException extends HttpException {
  constructor() {
    super(401, 'Wrong refresh token');
  }
}
