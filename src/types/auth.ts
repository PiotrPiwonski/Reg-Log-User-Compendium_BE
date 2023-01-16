export interface JwtPayload {
  id: string;
  token: string;
}
export interface TokenData {
  token: string;
  expiresIn: number;
}

export enum CookiesNames {
  AUTHORIZATION = 'Authorization',
}
