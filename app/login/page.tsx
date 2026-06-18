"use client";

import Image from "next/image";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Eye,
  EyeOff,
  LogIn,
  ShieldCheck,
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
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-white to-blue-50 flex items-center justify-center p-4">

      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 bg-white border border-gray-200 rounded-[2rem] shadow-sm overflow-hidden">

        <div className="hidden lg:flex relative bg-gradient-to-br from-slate-900 via-blue-900 to-blue-700 text-white p-10 flex-col justify-between overflow-hidden">
          <div className="absolute -top-20 -right-20 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-cyan-300/20 rounded-full blur-3xl" />

          <div className="relative">
            <div className="w-20 h-20 rounded-3xl bg-white flex items-center justify-center overflow-hidden shadow-sm mb-6">
              <Image
                src="/logo.png"
                alt="Logo Copystar"
                width={74}
                height={74}
                className="object-contain"
                priority
              />
            </div>

            <h1 className="text-4xl font-extrabold leading-tight">
              Estoque da Copystar
            </h1>

            <p className="text-blue-100 mt-4 text-lg">
              Controle entradas, saídas, locais, usuários e histórico em um único sistema.
            </p>
          </div>

          <div className="relative bg-white/10 border border-white/10 rounded-3xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <ShieldCheck size={22} />
              <p className="font-bold">Acesso protegido</p>
            </div>

            <p className="text-sm text-blue-100">
              Apenas emails autorizados conseguem acessar o sistema interno.
            </p>
          </div>
        </div>

        <form
          onSubmit={fazerLogin}
          className="w-full p-6 md:p-10"
        >
          <div className="mb-8 text-center lg:text-left">

            <div className="mx-auto lg:mx-0 mb-4 w-24 h-24 rounded-3xl bg-gray-50 border border-gray-200 shadow-sm flex items-center justify-center overflow-hidden lg:hidden">
              <Image
                src="/logo.png"
                alt="Logo Copystar"
                width={86}
                height={86}
                className="object-contain"
                priority
              />
            </div>

            <p className="text-sm font-bold text-blue-600 mb-2">
              Bem-vindo de volta
            </p>

            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">
              Acesse sua conta
            </h2>

            <p className="text-gray-500 mt-2">
              Entre para acessar o Estoque da Copystar
            </p>
          </div>

          <div className="space-y-5">

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">
                Email
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seuemail@empresa.com"
                className="w-full border border-gray-300 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">
                Senha
              </label>

              <div className="relative">
                <input
                  type={mostrarSenha ? "text" : "password"}
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  placeholder="Digite sua senha"
                  className="w-full border border-gray-300 rounded-2xl px-4 py-3 pr-12 outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />

                <button
                  type="button"
                  onClick={() => setMostrarSenha(!mostrarSenha)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800"
                >
                  {mostrarSenha ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

          </div>

          <button
            disabled={loading}
            className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-2xl font-bold transition disabled:opacity-70 flex items-center justify-center gap-2"
          >
            <LogIn size={20} />
            {loading ? "Entrando..." : "Entrar"}
          </button>

          <div className="flex flex-col gap-3 mt-6 text-center">
            <Link
              href="/cadastro"
              className="text-blue-600 hover:underline font-medium"
            >
              Criar nova conta
            </Link>

            <Link
              href="/recuperar-senha"
              className="text-gray-500 hover:text-gray-800 hover:underline"
            >
              Esqueci a senha
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}