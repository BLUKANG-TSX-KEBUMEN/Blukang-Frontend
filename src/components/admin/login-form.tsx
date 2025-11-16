"use client"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { useState } from "react"
import { Eye, EyeOff, Loader2, Lock, User } from "lucide-react"


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

  return (
    <div className={cn("flex flex-col items-center", className)}>
      <Card className="overflow-hidden w-[600px] h-[400px] bg-[#1D293D] border border-[#25487D] shadow-xl">
        <CardContent className="p-8 md:p-10">
          <form
            className="flex flex-col gap-5"
            onSubmit={(e) => {
              e.preventDefault()
              onLogin()
            }}
          >
            <div className="grid gap-4">
              <div className="grid gap-2">
                <div className="flex items-center gap-3">
                  <User className="text-[#366fc4]" size={18} />
                  <Label htmlFor="username" className="text-[#366fc4] text-lg">Username</Label>
                </div>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Masukkan username"
                  required
                  className="text-[#90A1B9] border border-[#25487D] py-3 text-base h-12 bg-[#24334B]"
                />
              </div>

              {/* Password */}
              <div className="grid gap-2">
                <div className="flex items-center gap-3">
                  <Lock className="text-[#366fc4]" size={18} />
                  <Label htmlFor="password" className="text-[#366fc4] text-lg">Password</Label>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    value={password}
                    type={showPassword ? "text" : "password"}
                    placeholder="Masukkan password"
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="pr-10 text-[#90A1B9] border border-[#25487D] py-3 text-base h-12 bg-[#24334B]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#366fc4]"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* Tombol login */}
              <Button
                type="submit"
                className="w-full py-3 text-lg bg-gradient-to-r from-[#155DFC] to-[#2B7FFF] shadow-lg shadow-blue-500/50 text-white hover:bg-gradient-to-r h-12 hover:from-[#2a6af3] hover:to-[#3483f8] "
                disabled={loading}
              >
                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Login"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
