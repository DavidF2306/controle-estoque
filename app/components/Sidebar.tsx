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
} from "lucide-react";

import { supabase } from "@/lib/supabase";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const [aberto, setAberto] = useState(false);

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

  function fecharMenu() {
    setAberto(false);
  }

  return (
    <>
      <button
        onClick={() => setAberto(true)}
        className="md:hidden fixed top-4 left-4 z-50 bg-white text-gray-800 p-3 rounded-2xl shadow-sm border border-gray-200"
      >
        <Menu size={24} />
      </button>

      {aberto && (
        <div
          onClick={fecharMenu}
          className="md:hidden fixed inset-0 bg-black/30 z-40"
        />
      )}

      <aside
        className={`
          fixed md:static top-0 left-0 z-50
          w-72 bg-white text-gray-800 min-h-screen
          p-5 border-r border-gray-200
          flex flex-col justify-between
          transition-transform duration-300
          ${aberto ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        <div>
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-blue-600 text-white flex items-center justify-center">
                <Printer size={22} />
              </div>

              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  EstoquePro
                </h1>

                <p className="text-gray-500 text-sm">
                  Impressoras e suprimentos
                </p>
              </div>
            </div>

            <button
              onClick={fecharMenu}
              className="md:hidden text-gray-500 hover:text-gray-900"
            >
              <X size={24} />
            </button>
          </div>

          <nav className="flex flex-col gap-1">
            {menu.map((item) => {
              const Icon = item.icon;
              const ativo = pathname === item.path;

              return (
                <Link
                  key={item.path}
                  href={item.path}
                  onClick={fecharMenu}
                  className={`
                    flex items-center gap-3
                    px-4 py-3 rounded-2xl
                    text-sm font-medium
                    transition
                    ${
                      ativo
                        ? "bg-blue-50 text-blue-700"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    }
                  `}
                >
                  <Icon size={20} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="space-y-4">
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4">
            <p className="text-sm font-medium text-gray-800">
              Sistema interno
            </p>

            <p className="text-xs text-gray-500 mt-1">
              Acesso restrito por email autorizado.
            </p>
          </div>

          <button
            onClick={sair}
            className="
              w-full
              flex items-center justify-center gap-3
              bg-gray-900 hover:bg-black
              text-white
              transition
              px-4 py-3 rounded-2xl
              font-medium
            "
          >
            <LogOut size={20} />
            Sair
          </button>
        </div>
      </aside>
    </>
  );
}