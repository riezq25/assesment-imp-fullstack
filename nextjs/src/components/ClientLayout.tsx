'use client';

import { AuthProvider } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <Navbar />
      <main className="min-h-screen">
        {children}
      </main>
    </AuthProvider>
  );
}
