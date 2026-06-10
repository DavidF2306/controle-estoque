"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default function Cadastro() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);

  async function criarConta(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
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
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">

      <form
        onSubmit={criarConta}
        className="
          w-full
          max-w-md
          bg-white
          p-6 md:p-8
          rounded-2xl
          shadow-sm
          border border-gray-200
        "
      >

        <div className="mb-8">

          <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
            Cadastro
          </h1>

          <p className="text-gray-500 mt-2">
            Crie sua conta no sistema
          </p>

        </div>

        <div className="space-y-5">

          <div>

            <label className="block text-sm font-medium mb-2">
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              className="
                w-full
                border border-gray-300
                rounded-xl
                px-4 py-3
                outline-none
                focus:ring-2
                focus:ring-blue-500
              "
              required
            />

          </div>

          <div>

            <label className="block text-sm font-medium mb-2">
              Senha
            </label>

            <input
              type="password"
              value={senha}
              onChange={(e) =>
                setSenha(e.target.value)
              }
              className="
                w-full
                border border-gray-300
                rounded-xl
                px-4 py-3
                outline-none
                focus:ring-2
                focus:ring-blue-500
              "
              required
              minLength={6}
            />

          </div>

        </div>

        <button
          disabled={loading}
          className="
            w-full
            mt-6
            bg-blue-600
            text-white
            py-3
            rounded-xl
            font-medium
            hover:bg-blue-700
            transition
          "
        >
          {loading ? "Criando conta..." : "Criar Conta"}
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