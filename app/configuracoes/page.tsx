"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Configuracoes() {
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [email, setEmail] = useState("");

  useEffect(() => {
    buscarUsuarios();
  }, []);

  async function buscarUsuarios() {
    const { data } = await supabase
      .from("usuarios_autorizados")
      .select("*")
      .order("email");

    if (data) {
      setUsuarios(data);
    }
  }

  async function adicionarUsuario(
    e: React.FormEvent
  ) {
    e.preventDefault();

    if (!email.trim()) {
      return;
    }

    const { error } = await supabase
      .from("usuarios_autorizados")
      .insert([
        {
          email: email.trim().toLowerCase(),
        },
      ]);

    if (error) {
      alert("Este email já existe.");
      return;
    }

    setEmail("");

    buscarUsuarios();

    alert("Usuário adicionado!");
  }

  async function removerUsuario(
    id: number,
    emailUsuario: string
  ) {
    const confirmar = confirm(
      `Remover ${emailUsuario}?`
    );

    if (!confirmar) return;

    await supabase
      .from("usuarios_autorizados")
      .delete()
      .eq("id", id);

    buscarUsuarios();
  }

  return (
    <div className="text-gray-800 w-full overflow-x-hidden">

      <div className="pt-14 md:pt-0 mb-8">

        <h1 className="text-3xl md:text-4xl font-bold">
          Configurações
        </h1>

        <p className="text-gray-500 mt-2">
          Gerencie os usuários autorizados
        </p>

      </div>

      <form
        onSubmit={adicionarUsuario}
        className="
          bg-white
          border border-gray-200
          rounded-2xl
          p-6
          mb-8
          shadow-sm
        "
      >

        <h2 className="text-xl font-semibold mb-4">
          Adicionar Usuário
        </h2>

        <div className="flex flex-col md:flex-row gap-3">

          <input
            type="email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            placeholder="email@empresa.com"
            className="
              flex-1
              border border-gray-300
              rounded-xl
              px-4 py-3
              outline-none
              focus:ring-2
              focus:ring-blue-500
            "
            required
          />

          <button
            className="
              bg-blue-600
              hover:bg-blue-700
              text-white
              px-6 py-3
              rounded-xl
              transition
            "
          >
            Adicionar
          </button>

        </div>

      </form>

      <div
        className="
          bg-white
          border border-gray-200
          rounded-2xl
          p-6
          shadow-sm
        "
      >

        <h2 className="text-xl font-semibold mb-6">
          Usuários Autorizados
        </h2>

        {usuarios.length === 0 ? (

          <p className="text-gray-500">
            Nenhum usuário cadastrado.
          </p>

        ) : (

          <div className="space-y-3">

            {usuarios.map((usuario) => (

              <div
                key={usuario.id}
                className="
                  flex
                  flex-col
                  md:flex-row
                  md:items-center
                  md:justify-between
                  gap-3
                  border
                  border-gray-200
                  rounded-xl
                  p-4
                "
              >

                <span className="font-medium">
                  {usuario.email}
                </span>

                <button
                  onClick={() =>
                    removerUsuario(
                      usuario.id,
                      usuario.email
                    )
                  }
                  className="
                    bg-red-600
                    hover:bg-red-700
                    text-white
                    px-4 py-2
                    rounded-lg
                    transition
                  "
                >
                  Remover
                </button>

              </div>

            ))}

          </div>

        )}

      </div>

    </div>
  );
}