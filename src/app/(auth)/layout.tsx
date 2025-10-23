'use client'

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center"
      style={{
        backgroundImage: "url('/login-bg.png')", // ganti dengan path gambarmu
      }}
    >


      {/* Content wrapper */}
      <div className="justify center">
        {children}
      </div>
    </div>
  )
}

export default AuthLayout
