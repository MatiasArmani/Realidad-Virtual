export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  name: string;
  password: string;
  companyName: string;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
    companyId: string;
  };
  token: string;
  refreshToken: string;
}

export interface JWTPayload {
  userId: string;
  email: string;
  companyId: string;
  role: string;
  iat?: number;
  exp?: number;
}



