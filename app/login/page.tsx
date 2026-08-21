"use client";

import Image from "next/image";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import {
  Eye,
  EyeOff,
  LogIn,
  ShieldCheck,
  Building,
} from "lucide-react";

export default function Login() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [mostrarSenha, setMostrarSenha] = useState(false);

  async function fazerLogin(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password: senha,
    });

    setLoading(false);

    if (error) {
      alert("Email ou senha inválidos");
      return;
    }

    router.push("/");
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-8">
      
      <div className="w-full max-w-[1000px] grid grid-cols-1 lg:grid-cols-2 bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden">

        {/* Lado Esquerdo - Hero Institucional (Apenas Desktop) */}
        <div className="hidden lg:flex relative bg-slate-900 text-white p-12 flex-col justify-between overflow-hidden">
          {/* Elementos de fundo sutis */}
          <div className="absolute -top-24 -right-20 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -left-20 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl" />

          <div className="relative z-10">
            <div className="w-16 h-16 rounded-xl bg-white flex items-center justify-center p-2.5 shadow-sm mb-8">
              <Image
                src="/logo.png"
                alt="Logo Copystar"
                width={50}
                height={50}
                className="object-contain"
                priority
              />
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-800 border border-slate-700 rounded-md text-xs font-semibold tracking-wide text-slate-300 uppercase mb-4">
              <Building size={14} />
              Portal Corporativo
            </div>

            <h1 className="text-4xl font-bold tracking-tight leading-tight">
              Gestão de Estoque
              <br /> Copystar
            </h1>

            <p className="text-slate-400 mt-5 text-lg max-w-md leading-relaxed">
              Plataforma centralizada para controle de entradas, saídas, alocação de equipamentos e auditoria de usuários[cite: 19].
            </p>
          </div>

          <div className="relative z-10 bg-slate-800/50 border border-slate-700/50 rounded-xl p-5 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                <ShieldCheck size={18} />
              </div>
              <p className="font-semibold text-slate-200">Acesso Restrito</p>
            </div>

            <p className="text-sm text-slate-400 leading-relaxed ml-11">
              Este é um sistema interno. O acesso é permitido exclusivamente para colaboradores previamente autorizados pela administração[cite: 19].
            </p>
          </div>
        </div>

        {/* Lado Direito - Formulário de Login */}
        <form
          onSubmit={fazerLogin}
          className="w-full p-8 sm:p-12 flex flex-col justify-center bg-white relative z-10"
        >
          <div className="mb-10 text-center lg:text-left">

            {/* Logo Mobile */}
            <div className="mx-auto lg:hidden w-16 h-16 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-center p-2 mb-6">
              <Image
                src="/logo.png"
                alt="Logo Copystar"
                width={48}
                height={48}
                className="object-contain"
                priority
              />
            </div>

            <p className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-2">
              Autenticação
            </p>

            <h2 className="text-3xl font-bold text-slate-800 tracking-tight">
              Acesse sua conta
            </h2>

            <p className="text-slate-500 mt-2 text-sm font-medium">
              Insira suas credenciais para acessar o painel[cite: 19].
            </p>
          </div>

          <div className="space-y-6">

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Endereço de E-mail
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu.email@empresa.com.br"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-sm outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Senha de Acesso
              </label>

              <div className="relative">
                <input
                  type={mostrarSenha ? "text" : "password"}
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 pr-12 text-sm outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  required
                />

                <button
                  type="button"
                  onClick={() => setMostrarSenha(!mostrarSenha)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {mostrarSenha ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

          </div>

          <button
            disabled={loading}
            className="w-full mt-8 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm text-sm"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Autenticando...
              </>
            ) : (
              <>
                <LogIn size={18} />
                Entrar no Sistema
              </>
            )}
          </button>
        </form>

      </div>
    </div>
  );
}