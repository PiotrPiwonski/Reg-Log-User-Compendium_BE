export interface JwtPayload {
  id: string;
  token: string;
}

export interface RefreshJwtPayload {
  userId: string;
  iat: number;
  exp: number;
}

export interface TokenData {
  token: string;
  expiresIn: number;
}

export enum CookiesNames {
  AUTHORIZATION = 'Authorization',
  REFRESH = 'Refresh',
}
