'use client'

import { LoginForm } from "@/components/admin/login-form"
import { AuthContext } from "@/lib/context/auth_context"
import { useRouter } from "next/navigation"
import { useContext, useState } from "react"
import { toast } from "sonner"

export default function LoginPage() {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)

    const router = useRouter()
    const { login } = useContext(AuthContext)

    const handleLogin = async () => {
        setLoading(true)
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, password }),
            })

            const data = await res.json().catch(() => null)

            if (!res.ok) {
                if (res.status === 401) {
                    toast.error("Username atau password salah", {
                       style: { backgroundColor: "#FD0000FF", color: "white" },
                    })
                } else {
                    toast.error(data?.message || "Login gagal", {
                       style: { backgroundColor: "#FD0000FF", color: "white" },
                    })
                }
                return
            }

            const token = data.data.access_token
            login(token)
            toast.success("Login berhasil", {
                style: { backgroundColor: "#22c55e", color: "white" },
            })
            router.push("/admin/dashboard")
        } catch (error) {
            console.error("Login failed:", error)
            toast.error("Terjadi kesalahan server", {
                className: "bg-red-500 text-white",
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
            <div className="flex flex-col gap-3 mb-8">
                <div className="text-5xl font-bold text-white">
                    Admin Dashboard
                </div>
                <div className="text-lg font-medium text-[#8EC5FF]">
                    Sistem Layanan Digital Desa Patukrejo
                </div>
            </div>

            <LoginForm
                username={username}
                password={password}
                setUsername={setUsername}
                setPassword={setPassword}
                onLogin={handleLogin}
                loading={loading}
                className="w-full max-w-lg" 
            />
        </div>
    )
}
