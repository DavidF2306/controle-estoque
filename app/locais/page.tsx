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

  async function salvarLocal(e: React.FormEvent) {
    e.preventDefault();

    await supabase
      .from("locais")
      .insert([{ nome }]);

    setNome("");
    buscarLocais();

    alert("Local cadastrado!");
  }

  async function excluirLocal(id: number) {
    const confirmar = confirm("Deseja realmente excluir?");

    if (!confirmar) return;

    await supabase
      .from("locais")
      .delete()
      .eq("id", id);

    buscarLocais();
  }

  return (
    <div className="text-gray-800 w-full overflow-x-hidden">

      <div className="pt-14 md:pt-0 mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
          Locais
        </h1>

        <p className="text-gray-500 mt-2">
          Cadastro de destinos e locais
        </p>
      </div>

      <form
        onSubmit={salvarLocal}
        className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-gray-200 mb-8 flex flex-col md:flex-row gap-4"
      >
        <input
          type="text"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder="Nome do local"
          className="flex-1 border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
          required
        />

        <button className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition">
          Salvar
        </button>
      </form>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-x-auto">

        <table className="w-full min-w-[500px]">

          <thead className="bg-gray-100">
            <tr className="text-left">
              <th className="p-4 text-gray-800">
                Nome
              </th>

              <th className="p-4 text-gray-800">
                Ações
              </th>
            </tr>
          </thead>

          <tbody>
            {locais.map((local) => (
              <tr
                key={local.id}
                className="border-t border-gray-200 hover:bg-gray-50"
              >
                <td className="p-4 text-gray-800">
                  {local.nome}
                </td>

                <td className="p-4">
                  <button
                    onClick={() => excluirLocal(local.id)}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition whitespace-nowrap"
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