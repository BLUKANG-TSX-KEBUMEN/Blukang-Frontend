interface AuthContextType {
  accessToken: string | null;

  login: (token: string) => void;
  logout: () => void;
  loading: boolean;
}