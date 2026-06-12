"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { Eye, EyeOff, Printer, UserPlus } from "lucide-react";

export default function Cadastro() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [loading, setLoading] = useState(false);

  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmarSenha, setMostrarConfirmarSenha] = useState(false);

  async function criarConta(e: React.FormEvent) {
    e.preventDefault();

    const emailFormatado = email.trim().toLowerCase();

    if (senha !== confirmarSenha) {
      alert("As senhas não coincidem.");
      return;
    }

    setLoading(true);

    const { data: usuarioAutorizado } = await supabase
      .from("usuarios_autorizados")
      .select("email")
      .eq("email", emailFormatado)
      .single();

    if (!usuarioAutorizado) {
      setLoading(false);
      alert("Este email não possui autorização para cadastro.");
      return;
    }

    const { error } = await supabase.auth.signUp({
      email: emailFormatado,
      password: senha,
      options: {
        emailRedirectTo:
          "https://controle-estoque-three-olive.vercel.app/login",
      },
    });

    setLoading(false);

    if (error) {
      alert("Erro ao criar conta: " + error.message);
      return;
    }

    alert("Conta criada! Verifique seu email para confirmar o cadastro.");

    setEmail("");
    setSenha("");
    setConfirmarSenha("");
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">

      <form
        onSubmit={criarConta}
        className="w-full max-w-md bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-200"
      >
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 w-14 h-14 rounded-3xl bg-blue-600 text-white flex items-center justify-center">
            <Printer size={28} />
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            Cadastro
          </h1>

          <p className="text-gray-500 mt-2">
            Crie sua conta autorizada aqui
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
                minLength={6}
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

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Confirmar senha
            </label>

            <div className="relative">
              <input
                type={mostrarConfirmarSenha ? "text" : "password"}
                value={confirmarSenha}
                onChange={(e) => setConfirmarSenha(e.target.value)}
                placeholder="Confirme sua senha"
                className="w-full border border-gray-300 rounded-2xl px-4 py-3 pr-12 outline-none focus:ring-2 focus:ring-blue-500"
                required
                minLength={6}
              />

              <button
                type="button"
                onClick={() =>
                  setMostrarConfirmarSenha(!mostrarConfirmarSenha)
                }
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800"
              >
                {mostrarConfirmarSenha ? (
                  <EyeOff size={20} />
                ) : (
                  <Eye size={20} />
                )}
              </button>
            </div>
          </div>

        </div>

        <button
          disabled={loading}
          className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-2xl font-medium transition disabled:opacity-70 flex items-center justify-center gap-2"
        >
          <UserPlus size={20} />

          {loading ? "Verificando..." : "Criar Conta"}
        </button>

        <div className="mt-6 text-center">
          <Link
            href="/login"
            className="text-blue-600 hover:underline"
          >
            Voltar para login
          </Link>
        </div>
      </form>

    </div>
  );
}