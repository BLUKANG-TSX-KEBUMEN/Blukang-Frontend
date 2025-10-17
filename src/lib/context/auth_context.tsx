"use client";
import { useRouter } from "next/navigation";
import { createContext, useState, useEffect, ReactNode } from "react";
import { toast } from "sonner";



export const AuthContext = createContext<AuthContextType>({
  accessToken: null,
  login: () => { },
  logout: () => { },
  loading: true,
});


export default function AuthProvider({ children }: { children: ReactNode }) {
  const [accessToken, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter()

  useEffect(() => {
    const savedToken = localStorage.getItem("accessToken");

    if (savedToken) setToken(savedToken);

    setLoading(false);
  }, []);

  const login = (accessToken: string) => {
    localStorage.setItem("accessToken", accessToken);

    setToken(accessToken);

  };



  const logout = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        credentials: "include", 
      });
      console.log(res)

      if (res.status !== 200) {
        localStorage.removeItem("accessToken");
        setToken(null);
        router.push("/login");
      }
    } catch (error) {
      console.error("Terjadi error saat logout:", error);
    } finally {
      // hapus accessToken di localStorage
      localStorage.removeItem("accessToken");
      setToken(null);


      toast.success("Logout berhasil", {
        style: {
          background: "var(--success)",
          color: "var(--light)",
        },
      });

      router.push("/login");
    }
  };



  return (
    <AuthContext.Provider value={{ accessToken, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}