export interface User {
  id: number | string;
  email: string;
  name?: string;
  role: 'admin' | 'customer';
  is_active?: boolean;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user?: User;
}
