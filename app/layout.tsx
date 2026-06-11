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
    "/atualizar-senha",
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

      if (session) {
        const emailUsuario = session.user.email;

        const { data: usuarioAutorizado } = await supabase
          .from("usuarios_autorizados")
          .select("email")
          .eq("email", emailUsuario)
          .single();

        if (!usuarioAutorizado) {
          await supabase.auth.signOut();

          alert(
            "Seu email não possui autorização para acessar o sistema."
          );

          setAutorizado(false);
          router.replace("/login");
          setLoading(false);
          return;
        }
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
          <div className="flex w-full max-w-full overflow-x-hidden">
            <Sidebar />

            <main className="flex-1 min-w-0 bg-gray-100 p-4 md:p-10 min-h-screen overflow-x-hidden">
              {children}
            </main>
          </div>
        )}
      </body>
    </html>
  );
}