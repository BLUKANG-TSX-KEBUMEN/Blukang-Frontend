interface AuthContextType {
  accessToken: string | null;

  login: (token: string) => void;
  logout: () => void;
  loading: boolean;
}

interface Report {
  id: number;
  namaLengkap: string;
  NIK: string;
  title: string;
  description: string;
  coordinates: string;
  files: string[];
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "DECLINED" | string;
  createdAt: string;
}
