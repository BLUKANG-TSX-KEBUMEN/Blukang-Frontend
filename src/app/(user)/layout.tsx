"use client";
import ChatPopover from "@/components/chat";
import Header from "@/components/header";
import React, { useState } from "react";


export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className={`min-h-screen bg-gray-100 antialiased ${isMenuOpen ? 'h-screen overflow-hidden' : ''}`}>

      <Header
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
      />

      <main className="">
        {children}
      </main>

      <ChatPopover />
    </div>
  );
}