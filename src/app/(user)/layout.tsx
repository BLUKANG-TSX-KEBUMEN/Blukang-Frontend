// src/app/(user)/layout.tsx
"use client";
import React from "react";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-100 antialiased">
      {children}
    </div>
  );
}
