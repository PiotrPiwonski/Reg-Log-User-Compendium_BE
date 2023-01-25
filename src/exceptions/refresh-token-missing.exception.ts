import { HttpException } from './index';

export class RefreshTokenMissingException extends HttpException {
  constructor() {
    super(401, 'Refresh token missing');
  }
}
