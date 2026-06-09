"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default function RecuperarSenha() {
  const [email, setEmail] = useState("");

  async function recuperarSenha(e: React.FormEvent) {
    e.preventDefault();

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "http://localhost:3000/login",
    });

    if (error) {
      alert("Erro: " + error.message);
      return;
    }

    alert("Email de recuperação enviado!");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={recuperarSenha}
        className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 w-full max-w-md space-y-6"
      >
        <div>
          <h1 className="text-4xl font-bold text-gray-800">
            Recuperar senha
          </h1>

          <p className="text-gray-500 mt-2">
            Informe seu email para receber o link
          </p>
        </div>

        <input
          type="email"
          placeholder="Seu email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-gray-300 rounded-xl px-4 py-3"
          required
        />

        <button className="w-full bg-blue-600 text-white py-3 rounded-xl font-medium">
          Enviar email
        </button>

        <Link href="/login" className="block text-center text-blue-600">
          Voltar para login
        </Link>
      </form>
    </div>
  );
}