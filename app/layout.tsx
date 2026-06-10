"use client";

import "./globals.css";

import Sidebar from "./components/Sidebar";

import {
  useEffect,
  useState,
} from "react";

import {
  usePathname,
  useRouter,
} from "next/navigation";

import { supabase } from "@/lib/supabase";

import {
  Toaster,
} from "react-hot-toast";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const router = useRouter();

  const pathname = usePathname();

  const [loading, setLoading] =
    useState(true);

  const rotasPublicas = [
    "/login",
    "/cadastro",
    "/recuperar-senha",
  ];

  const rotaPublica =
    rotasPublicas.includes(pathname);

  useEffect(() => {

    async function verificarLogin() {

      try {

        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (
          !session &&
          !rotaPublica
        ) {

          router.replace("/login");

          return;
        }

        if (
          session &&
          rotaPublica
        ) {

          router.replace("/");

          return;
        }

      } catch (error) {

        console.error(
          "Erro ao verificar login:",
          error
        );

      } finally {

        setLoading(false);
      }
    }

    verificarLogin();

  }, [pathname, router, rotaPublica]);

  if (loading) {

    return (
      <html lang="pt-BR">

        <body className="flex items-center justify-center min-h-screen bg-gray-100">

          Carregando...

        </body>

      </html>
    );
  }

  return (
    <html lang="pt-BR">

      <body>

        <Toaster
          position="top-right"
        />

        {
          rotaPublica ? (

            children

          ) : (

            <div className="flex">

              <Sidebar />

              <main className="flex-1 bg-gray-100 p-4 md:p-10 min-h-screen overflow-x-hidden">
  {children}
  
</main>

            </div>

          )
        }

      </body>

    </html>
  );
}