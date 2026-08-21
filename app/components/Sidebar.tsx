"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

import {
  LayoutDashboard,
  Package,
  Printer,
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
    { name: "Impressoras", icon: Printer, path: "/impressoras" },
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
      {/* Botão Mobile */}
      <button
        onClick={() => setAbertoMobile(true)}
        className="md:hidden fixed top-4 left-4 z-50 bg-white text-slate-800 p-2.5 rounded-lg shadow-sm border border-slate-200 hover:bg-slate-50 transition-colors"
      >
        <Menu size={22} />
      </button>

      {/* Overlay Mobile */}
      {abertoMobile && (
        <div
          onClick={fecharMenuMobile}
          className="md:hidden fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 transition-opacity"
        />
      )}

      <aside
        className={`
          fixed md:sticky top-0 left-0 z-50
          min-h-screen h-screen
          bg-white
          border-r border-slate-200
          flex flex-col justify-between
          transition-all duration-300 ease-in-out
          shadow-[4px_0_24px_rgba(0,0,0,0.02)]
          ${abertoDesktop ? "md:w-72" : "md:w-20"}
          w-72
          ${abertoMobile ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        <div className="p-4 flex-1 flex flex-col">
          {/* Header do Logo */}
          <div
            className={`
              flex items-center mb-8 mt-2
              ${abertoDesktop ? "md:justify-between" : "md:justify-center"}
              justify-between
            `}
          >
            <div className={`flex items-center gap-3 ${abertoDesktop ? "" : "md:hidden"}`}>
              <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-center overflow-hidden shrink-0">
                <Image
                  src="/logo.png"
                  alt="Logo Copystar"
                  width={32}
                  height={32}
                  className="object-contain"
                  priority
                />
              </div>

              {/* Título visível no Desktop Aberto e no Mobile */}
              <div className={`flex flex-col ${abertoDesktop ? "hidden md:flex" : "md:hidden"}`}>
                <h1 className="text-base font-bold tracking-tight text-slate-900">
                  Copystar
                </h1>
                <p className="text-slate-500 text-[11px] font-medium uppercase tracking-wider">
                  Gestão de Estoque
                </p>
              </div>
            </div>

            {/* Ícone isolado para quando o menu desktop estiver fechado */}
            {!abertoDesktop && (
              <div className="hidden md:flex w-10 h-10 rounded-xl bg-white border border-slate-200 shadow-sm items-center justify-center overflow-hidden shrink-0 mx-auto">
                <Image
                  src="/logo.png"
                  alt="Logo Copystar"
                  width={28}
                  height={28}
                  className="object-contain"
                  priority
                />
              </div>
            )}

            <button
              onClick={fecharMenuMobile}
              className="md:hidden text-slate-400 hover:text-slate-700 transition-colors p-1"
            >
              <X size={20} />
            </button>
          </div>

          {/* Botão de Colapsar/Expandir (Apenas Desktop) */}
          <button
            onClick={() => setAbertoDesktop(!abertoDesktop)}
            className="
              hidden md:flex
              w-full mb-6
              items-center justify-center gap-2
              bg-slate-50 hover:bg-slate-100
              border border-slate-200
              text-slate-500 hover:text-slate-800
              rounded-lg
              px-3 py-2
              transition-colors duration-200
            "
            title={abertoDesktop ? "Recolher menu" : "Expandir menu"}
          >
            {abertoDesktop ? (
              <>
                <PanelLeftClose size={18} />
                <span className="text-sm font-medium">
                  Recolher painel
                </span>
              </>
            ) : (
              <PanelLeftOpen size={18} />
            )}
          </button>

          {/* Navegação */}
          <nav className="flex flex-col gap-1.5 flex-1">
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
                    group flex items-center
                    px-3 py-2.5 rounded-lg
                    text-sm font-medium
                    transition-all duration-200
                    gap-3
                    ${abertoDesktop ? "md:justify-start" : "md:justify-center"}
                    ${
                      ativo
                        ? "bg-blue-50 text-blue-700"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }
                  `}
                >
                  <Icon 
                    size={20} 
                    strokeWidth={ativo ? 2.5 : 2}
                    className={`shrink-0 transition-colors ${ativo ? "text-blue-600" : "text-slate-400 group-hover:text-slate-700"}`} 
                  />

                  {abertoDesktop && (
                    <span className={`hidden md:inline ${ativo ? "font-semibold" : ""}`}>
                      {item.name}
                    </span>
                  )}

                  <span className={`md:hidden ${ativo ? "font-semibold" : ""}`}>
                    {item.name}
                  </span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Rodapé da Sidebar */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
          
          <div className={`mb-4 ${abertoDesktop ? "hidden md:block" : "md:hidden"}`}>
            <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-sm">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <p className="text-xs font-semibold text-slate-700">
                  Sistema Online
                </p>
              </div>
              <p className="text-[10px] text-slate-500 leading-tight">
                Acesso restrito por email.
              </p>
            </div>
          </div>

          <button
            onClick={sair}
            title="Sair do sistema"
            className={`
              w-full
              flex items-center 
              ${abertoDesktop ? "justify-start px-3" : "justify-center md:px-0"}
              text-slate-500 hover:text-rose-600 hover:bg-rose-50
              transition-colors duration-200
              py-2.5 rounded-lg
              font-medium text-sm
              gap-3
            `}
          >
            <LogOut size={20} className="shrink-0" />

            {abertoDesktop && (
              <span className="hidden md:inline">
                Sair da conta
              </span>
            )}

            <span className="md:hidden">
              Sair da conta
            </span>
          </button>
        </div>
      </aside>
    </>
  );
}