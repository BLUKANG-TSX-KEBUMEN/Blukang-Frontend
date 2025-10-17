import React from 'react'

const AdminLayout = ({ children}: {children: React.ReactNode}) => {
  return (
    <div>
        <main className="w-full">{children}</main>
    </div>
  )
}

export default AdminLayout