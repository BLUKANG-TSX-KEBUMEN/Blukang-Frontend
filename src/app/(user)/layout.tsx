import React from "react";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <nav>Navbar User</nav>
      <main>{children}</main>
    </div>
  );
}
