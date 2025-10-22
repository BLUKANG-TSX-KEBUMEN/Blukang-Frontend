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
                // Jika username/password salah atau tidak valid
                if (res.status === 401) {
                    toast.error("Username atau password salah", {
                        className: "bg-red-500 text-white",
                    })
                } else {
                    toast.error(data?.message || "Login gagal", {
                        className: "bg-red-500 text-white",
                    })
                }
                return
            }

            const token = data.data.access_token
            login(token)
            toast.success("Login berhasil")
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
        <div className="w-full max-w-sm md:max-w-3xl justify-center mx-auto my-20">
            <LoginForm
                username={username}
                password={password}
                setUsername={setUsername}
                setPassword={setPassword}
                onLogin={handleLogin}
                loading={loading}
            />
        </div>
    )
}
