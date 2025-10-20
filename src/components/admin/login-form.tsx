"use client"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Image from "next/image"
import { useState } from "react"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import { Checkbox } from "../ui/checkbox"
import { useRouter } from "next/navigation"

interface LoginFormProps extends React.ComponentProps<"div"> {
  username: string
  password: string
  setUsername: (value: string) => void
  setPassword: (value: string) => void
  onLogin: () => void
  loading: boolean
}

export function LoginForm({
  className,
  username,
  password,
  setUsername,
  setPassword,
  onLogin,
  loading,
}: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false)

  const router = useRouter()




  return (
    <div className={cn("flex flex-col gap-6", className)}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form
            className="p-6 md:p-8"
            onSubmit={(e) => {
              e.preventDefault()
              onLogin()
            }}
          >
            <div className="flex flex-col gap-3">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Login</h1>
                <p className="text-muted-foreground text-balance">
                  Masukkan username dan password Anda
                </p>
              </div>

              <div className="grid gap-3">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="19.06.1..."
                  required
                />
              </div>

              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                 
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    value={password}
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                <p className="text-sm min-h-[20px]">
                  {password.length > 0 && password.length < 8 ? (
                    <span className="text-red-500">Password minimal 8 karakter</span>
                  ) : (
                    ""
                  )}
                </p>

              </div>

              <Button type="submit" className="w-full text-white" disabled={loading}>
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  'Login'
                )}
              </Button>
              

            </div>
          </form>

          <div className="bg-muted relative hidden md:block">
            <Image
              src="/login-1.png"
              alt="Image"
              width={500}
              height={500}
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}