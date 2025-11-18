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
  response?: string;
}

interface DeathRecord {
  id: number
  nama: string
  tanggal_lahir: string
  tanggal_kematian: string
  alamat: string
  jumlah_keluarga: string
  keterangan: string
  foto: string
  createdAt: string
  updatedAt: string
}

interface News {
  id: number;
  title: string;
  imageArticle: string;
  bodyArticle: string;
  
}

interface StatsResponse {
  arsipKematian: { count: number }
  articles: { count: number }
  reports: {
    all: number
    pending: number
    inProgress: number
    completed: number
  }
}

interface SliderContent {
  id: number;
  imageSlider: string;
  createdAt: string;
}