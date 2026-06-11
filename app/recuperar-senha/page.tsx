"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default function RecuperarSenha() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  async function recuperarSenha(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);

    const { error } =
      await supabase.auth.resetPasswordForEmail(email, {
        redirectTo:
          "https://controle-estoque-three-olive.vercel.app/atualizar-senha",
      });

    setLoading(false);

    if (error) {
      alert("Erro: " + error.message);
      return;
    }

    alert("Email de recuperação enviado! Verifique sua caixa de entrada.");
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">

      <form
        onSubmit={recuperarSenha}
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
            Recuperar senha
          </h1>

          <p className="text-gray-500 mt-2">
            Informe seu email para receber o link de recuperação
          </p>

        </div>

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
          {loading ? "Enviando..." : "Enviar email"}
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