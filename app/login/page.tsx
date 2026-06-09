"use client";

import { useState } from "react";

import { supabase } from "@/lib/supabase";

import { useRouter } from "next/navigation";

import Link from "next/link";

import {
  Eye,
  EyeOff,
} from "lucide-react";

export default function Login() {

  const router = useRouter();

  const [email, setEmail] =
    useState("");

  const [senha, setSenha] =
    useState("");

  const [mostrarSenha, setMostrarSenha] =
    useState(false);

  async function fazerLogin(
    e: React.FormEvent
  ) {

    e.preventDefault();

    const { error } =
      await supabase.auth.signInWithPassword({
        email,
        password: senha,
      });

    if (error) {

      alert(
        "Email ou senha inválidos"
      );

      return;
    }

    router.push("/");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <form
        onSubmit={fazerLogin}
        className="
          bg-white
          p-8
          rounded-2xl
          shadow-sm
          border border-gray-200
          w-full
          max-w-md
          space-y-6
        "
      >

        <div>

          <h1 className="text-4xl font-bold text-gray-800">
            Login
          </h1>

          <p className="text-gray-500 mt-2">
            Acesse o sistema
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
            "
            required
          />

        </div>

        <div>

          <label className="block text-sm font-medium mb-2">
            Senha
          </label>

          <div className="relative">

            <input
              type={
                mostrarSenha
                  ? "text"
                  : "password"
              }
              value={senha}
              onChange={(e) =>
                setSenha(e.target.value)
              }
              className="
                w-full
                border border-gray-300
                rounded-xl
                px-4 py-3
                pr-12
              "
              required
            />

            <button
              type="button"
              onClick={() =>
                setMostrarSenha(
                  !mostrarSenha
                )
              }
              className="
                absolute
                right-4
                top-1/2
                -translate-y-1/2
                text-gray-500
              "
            >

              {
                mostrarSenha
                  ? <EyeOff size={20} />
                  : <Eye size={20} />
              }

            </button>

          </div>

        </div>

        <button
          className="
            w-full
            bg-blue-600
            text-white
            py-3
            rounded-xl
            font-medium
            hover:bg-blue-700
            transition
          "
        >
          Entrar
        </button>

        <div className="text-center space-y-2">

          <Link
            href="/cadastro"
            className="block text-blue-600 hover:underline"
          >
            Criar conta
          </Link>

          <Link
            href="/recuperar-senha"
            className="block text-gray-500 hover:underline"
          >
            Esqueci minha senha
          </Link>

        </div>

      </form>

    </div>
  );
}