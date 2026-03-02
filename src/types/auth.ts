export interface AuthUser {
  id?: string;
  email?: string;
  name?: string;
  role?: string;
}

export interface AuthSession {
  token: string;
  user?: AuthUser;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  fullName: string;
  email: string;
  password: string;
}
