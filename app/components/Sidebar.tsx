"use client";

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
  Printer,
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
          className="md:hidden fixed inset-0 bg-black/30 z-40"
        />
      )}

      <aside
        className={`
          fixed md:sticky top-0 left-0 z-50
          bg-white text-gray-800 min-h-screen h-screen
          border-r border-gray-200
          flex flex-col justify-between
          transition-all duration-300
          ${abertoDesktop ? "md:w-72" : "md:w-24"}
          w-72
          ${abertoMobile ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        <div className="p-5">

          <div
            className={`
              flex items-center mb-8
              ${abertoDesktop ? "justify-between" : "justify-center"}
            `}
          >
            <div
              className={`
                flex items-center gap-3
                ${!abertoDesktop ? "md:justify-center" : ""}
              `}
            >
              <div className="w-11 h-11 rounded-2xl bg-blue-600 text-white flex items-center justify-center shrink-0">
                <Printer size={22} />
              </div>

              {abertoDesktop && (
                <div className="hidden md:block">
                  <h1 className="text-xl font-bold text-gray-900">
                    EstoquePro
                  </h1>

                  <p className="text-gray-500 text-sm">
                    Impressoras e suprimentos
                  </p>
                </div>
              )}

              <div className="md:hidden">
                <h1 className="text-xl font-bold text-gray-900">
                  EstoquePro
                </h1>

                <p className="text-gray-500 text-sm">
                  Impressoras e suprimentos
                </p>
              </div>
            </div>

            <button
              onClick={fecharMenuMobile}
              className="md:hidden text-gray-500 hover:text-gray-900"
            >
              <X size={24} />
            </button>
          </div>

          <button
            onClick={() => setAbertoDesktop(!abertoDesktop)}
            className="
              hidden md:flex
              w-full
              mb-4
              items-center
              justify-center
              gap-2
              border border-gray-200
              text-gray-600
              hover:text-gray-900
              hover:bg-gray-50
              rounded-2xl
              px-3 py-3
              transition
            "
            title={abertoDesktop ? "Recolher menu" : "Expandir menu"}
          >
            {abertoDesktop ? (
              <>
                <PanelLeftClose size={20} />
                <span className="text-sm font-medium">
                  Recolher
                </span>
              </>
            ) : (
              <PanelLeftOpen size={20} />
            )}
          </button>

          <nav className="flex flex-col gap-1">
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
                    text-sm font-medium
                    transition
                    ${abertoDesktop ? "md:justify-start md:gap-3" : "md:justify-center md:gap-0"}
                    gap-3
                    ${
                      ativo
                        ? "bg-blue-50 text-blue-700"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    }
                  `}
                >
                  <Icon size={20} className="shrink-0" />

                  <span
                    className={`
                      md:${abertoDesktop ? "inline" : "hidden"}
                    `}
                  >
                    {item.name}
                  </span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-5 space-y-4">

          {abertoDesktop && (
            <div className="hidden md:block bg-gray-50 border border-gray-200 rounded-2xl p-4">
              <p className="text-sm font-medium text-gray-800">
                Sistema interno
              </p>

              <p className="text-xs text-gray-500 mt-1">
                Acesso restrito por email autorizado.
              </p>
            </div>
          )}

          <div className="md:hidden bg-gray-50 border border-gray-200 rounded-2xl p-4">
            <p className="text-sm font-medium text-gray-800">
              Sistema interno
            </p>

            <p className="text-xs text-gray-500 mt-1">
              Acesso restrito por email autorizado.
            </p>
          </div>

          <button
            onClick={sair}
            title="Sair"
            className={`
              w-full
              flex items-center
              bg-gray-900 hover:bg-black
              text-white
              transition
              px-4 py-3 rounded-2xl
              font-medium
              ${abertoDesktop ? "md:justify-center md:gap-3" : "md:justify-center md:gap-0"}
              justify-center gap-3
            `}
          >
            <LogOut size={20} />

            <span
              className={`
                md:${abertoDesktop ? "inline" : "hidden"}
              `}
            >
              Sair
            </span>
          </button>
        </div>
      </aside>
    </>
  );
}