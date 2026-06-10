"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";

export default function Login() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [mostrarSenha, setMostrarSenha] = useState(false);

  async function fazerLogin(
    e: React.FormEvent
  ) {
    e.preventDefault();

    setLoading(true);

    const { error } =
      await supabase.auth.signInWithPassword({
        email,
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
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">

      <form
        onSubmit={fazerLogin}
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
            Login
          </h1>

          <p className="text-gray-500 mt-2">
            Acesse o sistema de estoque
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
                  px-4 py-3 pr-12
                  outline-none
                  focus:ring-2
                  focus:ring-blue-500
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
                {mostrarSenha ? (
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
          {loading
            ? "Entrando..."
            : "Entrar"}
        </button>

        <div className="flex flex-col gap-3 mt-6 text-center">

          <Link
            href="/cadastro"
            className="text-blue-600 hover:underline"
          >
            Criar nova conta
          </Link>

          <Link
            href="/recuperar-senha"
            className="text-gray-600 hover:underline"
          >
            Esqueci minha senha
          </Link>

        </div>

      </form>

    </div>
  );
}