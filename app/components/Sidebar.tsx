"use client";

import Link from "next/link";

import { usePathname, useRouter } from "next/navigation";

import {
  LayoutDashboard,
  Package,
  MapPin,
  ArrowDownCircle,
  ArrowUpCircle,
  History,
  LogOut,
} from "lucide-react";

import { supabase } from "@/lib/supabase";

export default function Sidebar() {

  const pathname = usePathname();

  const router = useRouter();

  const menu = [
    {
      name: "Dashboard",
      icon: LayoutDashboard,
      path: "/",
    },
    {
      name: "Produtos",
      icon: Package,
      path: "/produtos",
    },
    {
      name: "Locais",
      icon: MapPin,
      path: "/locais",
    },
    {
      name: "Entradas",
      icon: ArrowDownCircle,
      path: "/entradas",
    },
    {
      name: "Saídas",
      icon: ArrowUpCircle,
      path: "/saidas",
    },
    {
      name: "Histórico",
      icon: History,
      path: "/historico",
    },
  ];

  async function sair() {

    await supabase.auth.signOut();

    router.push("/login");
  }

  return (
    <aside className="w-72 bg-[#111827] text-white min-h-screen p-6 border-r border-gray-800 flex flex-col justify-between">

      <div>

        <div className="mb-10">

          <h1 className="text-3xl font-bold">
            EstoquePro
          </h1>

          <p className="text-gray-400 text-sm mt-1">
            Sistema de Controle
          </p>

        </div>

        <nav className="flex flex-col gap-2">

          {menu.map((item) => {

            const Icon = item.icon;

            return (
              <Link
                key={item.path}
                href={item.path}
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
  );
}