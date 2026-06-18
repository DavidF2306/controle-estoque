"use client";

import Image from "next/image";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import {
  Mail,
  ArrowLeft,
  ShieldCheck,
} from "lucide-react";

export default function RecuperarSenha() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  async function recuperarSenha(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);

    const { error } =
      await supabase.auth.resetPasswordForEmail(
        email.trim().toLowerCase(),
        {
          redirectTo:
            "https://controle-estoque-three-olive.vercel.app/atualizar-senha",
        }
      );

    setLoading(false);

    if (error) {
      alert("Erro ao enviar recuperação: " + error.message);
      return;
    }

    alert(
      "Enviamos um link para redefinir sua senha. Verifique seu email."
    );

    setEmail("");
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
              Recupere o acesso ao sistema interno de estoque.
            </p>
          </div>

          <div className="relative bg-white/10 border border-white/10 rounded-3xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <ShieldCheck size={22} />
              <p className="font-bold">Recuperação segura</p>
            </div>

            <p className="text-sm text-blue-100">
              O link será enviado apenas para emails cadastrados no sistema.
            </p>
          </div>
        </div>

        <form
          onSubmit={recuperarSenha}
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
              Recuperação de acesso
            </p>

            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">
              Esqueci a senha
            </h2>

            <p className="text-gray-500 mt-2">
              Digite seu email para receber o link de redefinição.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Email
            </label>

            <div className="relative">
              <Mail
                size={20}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seuemail@empresa.com"
                className="w-full border border-gray-300 rounded-2xl pl-12 pr-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <button
            disabled={loading}
            className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-2xl font-bold transition disabled:opacity-70 flex items-center justify-center gap-2"
          >
            <Mail size={20} />
            {loading ? "Enviando..." : "Enviar link de recuperação"}
          </button>

          <div className="mt-6 text-center">
            <Link
              href="/login"
              className="text-blue-600 hover:underline font-medium inline-flex items-center gap-2"
            >
              <ArrowLeft size={16} />
              Voltar para login
            </Link>
          </div>
        </form>

      </div>
    </div>
  );
}