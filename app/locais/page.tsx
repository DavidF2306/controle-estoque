"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Locais() {
  const [nome, setNome] = useState("");
  const [cliente, setCliente] = useState("");
  const [locais, setLocais] = useState<any[]>([]);

  const [editandoId, setEditandoId] = useState<number | null>(null);

  useEffect(() => {
    buscarLocais();
  }, []);

  async function buscarLocais() {
    const { data } = await supabase
      .from("locais")
      .select("*")
      .order("id", { ascending: false });

    if (data) {
      setLocais(data);
    }
  }

  async function salvarLocal(e: React.FormEvent) {
    e.preventDefault();

    if (editandoId) {
      await supabase
        .from("locais")
        .update({
          nome,
          cliente,
        })
        .eq("id", editandoId);

      alert("Local atualizado!");
    } else {
      await supabase
        .from("locais")
        .insert([
          {
            nome,
            cliente,
          },
        ]);

      alert("Local cadastrado!");
    }

    setNome("");
    setCliente("");
    setEditandoId(null);
    buscarLocais();
  }

  function editarLocal(local: any) {
    setNome(local.nome);
    setCliente(local.cliente || "");
    setEditandoId(local.id);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function cancelarEdicao() {
    setNome("");
    setCliente("");
    setEditandoId(null);
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
          Cadastro de destinos, locais e clientes
        </p>
      </div>

      <form
        onSubmit={salvarLocal}
        className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-gray-200 mb-8 space-y-4"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <div>
            <label className="block text-sm font-medium mb-2">
              Nome do local
            </label>

            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Ex: Sala TI, Hospital, Filial"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Cliente
            </label>

            <input
              type="text"
              value={cliente}
              onChange={(e) => setCliente(e.target.value)}
              placeholder="Ex: Hospital São Domingos"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition">
            {editandoId ? "Salvar Alterações" : "Salvar"}
          </button>

          {editandoId && (
            <button
              type="button"
              onClick={cancelarEdicao}
              className="bg-gray-800 text-white px-6 py-3 rounded-xl hover:bg-black transition"
            >
              Cancelar
            </button>
          )}
        </div>
      </form>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-x-auto">

        <table className="w-full min-w-[700px]">

          <thead className="bg-gray-100">
            <tr className="text-left">
              <th className="p-4 text-gray-800">
                Local
              </th>

              <th className="p-4 text-gray-800">
                Cliente
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

                <td className="p-4 text-gray-800">
                  {local.cliente || "-"}
                </td>

                <td className="p-4">
                  <div className="flex gap-2 whitespace-nowrap">

                    <button
                      onClick={() => editarLocal(local)}
                      className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition"
                    >
                      Editar
                    </button>

                    <button
                      onClick={() => excluirLocal(local.id)}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
                    >
                      Excluir
                    </button>

                  </div>
                </td>
              </tr>
            ))}
          </tbody>

        </table>

      </div>

    </div>
  );
}