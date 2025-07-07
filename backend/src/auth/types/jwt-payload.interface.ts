export interface JwtPayload {
  sub: number; // User ID
  email: string; // User email
  username: string; // User username
  iat?: number; // Issued at time (optional)
  exp?: number; // Expiration time (optional)
}
