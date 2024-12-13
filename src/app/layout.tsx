// src/app/layout.tsx

import { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/NavBar";
import AuthProvider from "../components/AuthProvider";
import { ThemeProvider } from "@/components/ThemeProvider"


export const metadata: Metadata = {
  title: "JakubGram",
  description: "Made by JakubPesko",

};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="sk">
      <body>
        <ThemeProvider>
          <AuthProvider>
            <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
              <main style={{ flexGrow: 1 }}>
                
                {children}
              </main>
              <Navbar />
            </div>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
