"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Locais() {

  const [nome, setNome] = useState("");

  const [locais, setLocais] = useState<any[]>([]);

  useEffect(() => {
    buscarLocais();
  }, []);

  async function buscarLocais() {

    const { data } = await supabase
      .from("locais")
      .select("*");

    if (data) {
      setLocais(data);
    }
  }

  async function salvarLocal(
    e: React.FormEvent
  ) {

    e.preventDefault();

    await supabase
      .from("locais")
      .insert([
        {
          nome,
        },
      ]);

    setNome("");

    buscarLocais();

    alert("Local cadastrado!");
  }

  async function excluirLocal(id: number) {

    const confirmar = confirm(
      "Deseja realmente excluir?"
    );

    if (!confirmar) return;

    await supabase
      .from("locais")
      .delete()
      .eq("id", id);

    buscarLocais();
  }

  return (
    <div>

      <div className="mb-8">

        <h1 className="text-4xl font-bold text-gray-800">
          Locais
        </h1>

        <p className="text-gray-500 mt-2">
          Cadastro de destinos e locais
        </p>

      </div>

      <form
        onSubmit={salvarLocal}
        className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 mb-8 flex gap-4"
      >

        <input
          type="text"
          value={nome}
          onChange={(e) =>
            setNome(e.target.value)
          }
          placeholder="Nome do local"
          className="flex-1 border border-gray-300 rounded-xl px-4 py-3"
        />

        <button className="bg-blue-600 text-white px-6 rounded-xl hover:bg-blue-700 transition">
          Salvar
        </button>

      </form>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">

        <table className="w-full">

          <thead className="bg-gray-100">

            <tr className="text-left">

              <th className="p-4">
                Nome
              </th>

              <th className="p-4">
                Ações
              </th>

            </tr>

          </thead>

          <tbody>

            {locais.map((local) => (

              <tr
                key={local.id}
                className="border-t hover:bg-gray-50"
              >

                <td className="p-4">
                  {local.nome}
                </td>

                <td className="p-4">

                  <button
                    onClick={() =>
                      excluirLocal(local.id)
                    }
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
                  >
                    Excluir
                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}