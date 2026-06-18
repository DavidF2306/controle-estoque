"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

import {
  LayoutDashboard,
  Package,
  MapPin,
  ArrowDownCircle,
  ArrowUpCircle,
  History,
  Settings,
  LogOut,
  Menu,
  X,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";

import { supabase } from "@/lib/supabase";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const [abertoMobile, setAbertoMobile] = useState(false);
  const [abertoDesktop, setAbertoDesktop] = useState(true);

  const menu = [
    { name: "Início", icon: LayoutDashboard, path: "/" },
    { name: "Produtos", icon: Package, path: "/produtos" },
    { name: "Locais", icon: MapPin, path: "/locais" },
    { name: "Entradas", icon: ArrowDownCircle, path: "/entradas" },
    { name: "Saídas", icon: ArrowUpCircle, path: "/saidas" },
    { name: "Histórico", icon: History, path: "/historico" },
    { name: "Configurações", icon: Settings, path: "/configuracoes" },
  ];

  async function sair() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  function fecharMenuMobile() {
    setAbertoMobile(false);
  }

  return (
    <>
      <button
        onClick={() => setAbertoMobile(true)}
        className="md:hidden fixed top-4 left-4 z-50 bg-white text-gray-800 p-3 rounded-2xl shadow-sm border border-gray-200"
      >
        <Menu size={24} />
      </button>

      {abertoMobile && (
        <div
          onClick={fecharMenuMobile}
          className="md:hidden fixed inset-0 bg-black/40 z-40"
        />
      )}

      <aside
        className={`
          fixed md:sticky top-0 left-0 z-50
          min-h-screen h-screen
          bg-gradient-to-b from-slate-950 via-blue-950 to-blue-800
          text-white
          flex flex-col justify-between
          transition-all duration-300
          shadow-xl
          ${abertoDesktop ? "md:w-72" : "md:w-24"}
          w-72
          ${abertoMobile ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        <div className="p-5">
          <div
            className={`
              flex items-center mb-6
              ${abertoDesktop ? "md:justify-between" : "md:justify-center"}
              justify-between
            `}
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center overflow-hidden shadow-sm shrink-0">
                <Image
                  src="/logo.png"
                  alt="Logo Copystar"
                  width={42}
                  height={42}
                  className="object-contain"
                  priority
                />
              </div>

              {abertoDesktop && (
                <div className="hidden md:block">
                  <h1 className="text-lg font-extrabold leading-tight">
                    Estoque da Copystar
                  </h1>

                  <p className="text-blue-100 text-xs mt-1">
                    Impressoras e suprimentos
                  </p>
                </div>
              )}

              <div className="md:hidden">
                <h1 className="text-lg font-extrabold leading-tight">
                  Estoque da Copystar
                </h1>

                <p className="text-blue-100 text-xs mt-1">
                  Impressoras e suprimentos
                </p>
              </div>
            </div>

            <button
              onClick={fecharMenuMobile}
              className="md:hidden text-blue-100 hover:text-white"
            >
              <X size={24} />
            </button>
          </div>

          <button
            onClick={() => setAbertoDesktop(!abertoDesktop)}
            className="
              hidden md:flex
              w-full mb-5
              items-center justify-center gap-2
              bg-white/10 hover:bg-white/15
              border border-white/10
              text-blue-50
              rounded-2xl
              px-3 py-3
              transition
            "
            title={abertoDesktop ? "Recolher menu" : "Expandir menu"}
          >
            {abertoDesktop ? (
              <>
                <PanelLeftClose size={20} />
                <span className="text-sm font-bold">
                  Recolher
                </span>
              </>
            ) : (
              <PanelLeftOpen size={20} />
            )}
          </button>

          <nav className="flex flex-col gap-2">
            {menu.map((item) => {
              const Icon = item.icon;
              const ativo = pathname === item.path;

              return (
                <Link
                  key={item.path}
                  href={item.path}
                  onClick={fecharMenuMobile}
                  title={item.name}
                  className={`
                    flex items-center
                    px-4 py-3 rounded-2xl
                    text-sm font-bold
                    transition
                    gap-3
                    ${abertoDesktop ? "md:justify-start" : "md:justify-center"}
                    ${
                      ativo
                        ? "bg-white text-blue-700 shadow-sm"
                        : "text-blue-100 hover:bg-white/10 hover:text-white"
                    }
                  `}
                >
                  <Icon size={20} className="shrink-0" />

                  {abertoDesktop && (
                    <span className="hidden md:inline">
                      {item.name}
                    </span>
                  )}

                  <span className="md:hidden">
                    {item.name}
                  </span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-5 space-y-4">
          {abertoDesktop && (
            <div className="hidden md:block bg-white/10 border border-white/10 rounded-3xl p-4">
              <p className="text-sm font-bold">
                Sistema interno
              </p>

              <p className="text-xs text-blue-100 mt-1">
                Acesso restrito por email autorizado.
              </p>
            </div>
          )}

          <div className="md:hidden bg-white/10 border border-white/10 rounded-3xl p-4">
            <p className="text-sm font-bold">
              Sistema interno
            </p>

            <p className="text-xs text-blue-100 mt-1">
              Acesso restrito por email autorizado.
            </p>
          </div>

          <button
            onClick={sair}
            title="Sair"
            className={`
              w-full
              flex items-center justify-center
              bg-white text-red-600
              hover:bg-red-50
              transition
              px-4 py-3 rounded-2xl
              font-extrabold
              gap-3
            `}
          >
            <LogOut size={20} />

            {abertoDesktop && (
              <span className="hidden md:inline">
                Sair
              </span>
            )}

            <span className="md:hidden">
              Sair
            </span>
          </button>
        </div>
      </aside>
    </>
  );
}