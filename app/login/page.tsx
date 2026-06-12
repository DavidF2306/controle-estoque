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

    const { error } =
      await supabase.auth.signInWithPassword({
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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">

      <form
        onSubmit={fazerLogin}
        className="
          w-full
          max-w-md
          bg-white
          p-6 md:p-8
          rounded-3xl
          shadow-sm
          border border-gray-200
        "
      >
        <div className="mb-8 text-center">

          <div className="mx-auto mb-4 w-24 h-24 rounded-3xl bg-white border border-gray-200 shadow-sm flex items-center justify-center overflow-hidden">
            <Image
              src="/logo.png"
              alt="Logo"
              width={86}
              height={86}
              className="object-contain"
              priority
            />
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            Controle de Estoque
          </h1>

          <p className="text-gray-500 mt-2">
            Acesse o sistema de impressoras e suprimentos
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
              onChange={(e) =>
                setEmail(e.target.value)
              }
              placeholder="seuemail@empresa.com"
              className="
                w-full
                border border-gray-300
                rounded-2xl
                px-4 py-3
                outline-none
                focus:ring-2
                focus:ring-blue-500
              "
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
                onChange={(e) =>
                  setSenha(e.target.value)
                }
                placeholder="Digite sua senha"
                className="
                  w-full
                  border border-gray-300
                  rounded-2xl
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
                  setMostrarSenha(!mostrarSenha)
                }
                className="
                  absolute
                  right-4
                  top-1/2
                  -translate-y-1/2
                  text-gray-500
                  hover:text-gray-800
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
            hover:bg-blue-700
            text-white
            py-3
            rounded-2xl
            font-medium
            transition
            disabled:opacity-70
            flex items-center
            justify-center
            gap-2
          "
        >
          <LogIn size={20} />

          {loading ? "Entrando..." : "Entrar"}
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
            className="text-gray-500 hover:text-gray-800 hover:underline"
          >
            Esqueci a senha
          </Link>

        </div>

      </form>

    </div>
  );
}