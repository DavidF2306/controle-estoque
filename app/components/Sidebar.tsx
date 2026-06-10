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
  LogOut,
  Menu,
  X,
} from "lucide-react";

import { supabase } from "@/lib/supabase";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const [aberto, setAberto] = useState(false);

  const menu = [
    { name: "Início", icon: LayoutDashboard, path: "/",},
    { name: "Produtos", icon: Package, path: "/produtos" },
    { name: "Locais", icon: MapPin, path: "/locais" },
    { name: "Entradas", icon: ArrowDownCircle, path: "/entradas" },
    { name: "Saídas", icon: ArrowUpCircle, path: "/saidas" },
    { name: "Histórico", icon: History, path: "/historico" },
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
        className="md:hidden fixed top-4 left-4 z-50 bg-gray-900 text-white p-3 rounded-xl shadow-lg"
      >
        <Menu size={24} />
      </button>

      {aberto && (
        <div
          onClick={fecharMenu}
          className="md:hidden fixed inset-0 bg-black/40 z-40"
        />
      )}

      <aside
        className={`
          fixed md:static top-0 left-0 z-50
          w-72 bg-[#111827] text-white min-h-screen
          p-6 border-r border-gray-800
          flex flex-col justify-between
          transition-transform duration-300
          ${aberto ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        <div>
          <div className="flex items-center justify-between mb-10">
            <div>
              <h1 className="text-3xl font-bold">
                EstoquePro
              </h1>

              <p className="text-gray-400 text-sm mt-1">
                Sistema de Controle
              </p>
            </div>

            <button
              onClick={fecharMenu}
              className="md:hidden text-gray-300 hover:text-white"
            >
              <X size={26} />
            </button>
          </div>

          <nav className="flex flex-col gap-2">
            {menu.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.path}
                  href={item.path}
                  onClick={fecharMenu}
                  className={`
                    flex items-center gap-3
                    px-4 py-3 rounded-xl
                    transition-all duration-200
                    ${
                      pathname === item.path
                        ? "bg-blue-600 text-white"
                        : "hover:bg-gray-800 text-gray-300"
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

        <button
          onClick={sair}
          className="
            flex items-center gap-3
            bg-red-600 hover:bg-red-700
            transition
            px-4 py-3 rounded-xl
            mt-10
          "
        >
          <LogOut size={20} />
          Sair
        </button>
      </aside>
    </>
  );
}