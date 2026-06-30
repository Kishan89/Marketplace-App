export interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  image: string;
}

export interface AuthState {
  token: string | null;
  user: User | null;
  isLoading: boolean;
  isRestoring: boolean;
  error: string | null;
}

export interface LoginFormValues {
  email: string;
  password: string;
}
