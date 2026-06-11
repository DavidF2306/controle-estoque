"use client";

import "./globals.css";
import Sidebar from "./components/Sidebar";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const [loading, setLoading] = useState(true);
  const [autorizado, setAutorizado] = useState(false);

  const rotasPublicas = [
    "/login",
    "/cadastro",
    "/recuperar-senha",
  ];

  const rotaPublica = rotasPublicas.includes(pathname);

  useEffect(() => {
    async function verificarLogin() {
      setLoading(true);

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session && !rotaPublica) {
        setAutorizado(false);
        router.replace("/login");
        setLoading(false);
        return;
      }

      if (session && rotaPublica) {
        setAutorizado(false);
        router.replace("/");
        setLoading(false);
        return;
      }

      setAutorizado(true);
      setLoading(false);
    }

    verificarLogin();
  }, [pathname, router, rotaPublica]);

  if (loading || !autorizado) {
    return (
      <html lang="pt-BR">
        <body className="min-h-screen bg-gray-100 flex items-center justify-center">
          <div className="text-gray-600">
            Carregando...
          </div>
        </body>
      </html>
    );
  }

  return (
    <html lang="pt-BR">
      <body className="overflow-x-hidden">
        {rotaPublica ? (
          children
        ) : (
          <div className="flex">
            <Sidebar />

            <main className="flex-1 bg-gray-100 p-4 md:p-10 min-h-screen overflow-x-hidden w-full">
              {children}
            </main>
          </div>
        )}
      </body>
    </html>
  );
}