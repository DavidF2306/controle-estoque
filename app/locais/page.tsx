"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  MapPin,
  Save,
  X,
  Pencil,
  Trash2,
} from "lucide-react";

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
      .order("cliente");

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
    const confirmar = confirm("Deseja realmente excluir este local?");

    if (!confirmar) return;

    await supabase
      .from("locais")
      .delete()
      .eq("id", id);

    buscarLocais();
  }

  return (
    <div className="text-gray-900 w-full overflow-x-hidden">

      <div className="pt-14 md:pt-0 mb-8 flex items-center gap-3">
        <div className="w-11 h-11 rounded-2xl bg-blue-600 text-white flex items-center justify-center">
          <MapPin size={22} />
        </div>

        <div>
          <h1 className="text-3xl md:text-4xl font-bold">
            Locais
          </h1>

          <p className="text-gray-500 mt-1">
            Clientes e locais de instalação
          </p>
        </div>
      </div>

      <form
        onSubmit={salvarLocal}
        className="bg-white border border-gray-200 rounded-3xl p-4 md:p-8 shadow-sm mb-8 space-y-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <div>
            <label className="block text-sm font-medium mb-2">
              Cliente
            </label>

            <input
              type="text"
              value={cliente}
              onChange={(e) => setCliente(e.target.value)}
              placeholder="Ex: Hospital São Domingos"
              className="w-full border border-gray-300 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Local
            </label>

            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Ex: Recepção, RH, Almoxarifado"
              className="w-full border border-gray-300 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-medium transition flex items-center justify-center gap-2">
            <Save size={20} />
            {editandoId ? "Salvar Alterações" : "Salvar Local"}
          </button>

          {editandoId && (
            <button
              type="button"
              onClick={cancelarEdicao}
              className="bg-gray-900 hover:bg-black text-white px-6 py-3 rounded-2xl font-medium transition flex items-center justify-center gap-2"
            >
              <X size={20} />
              Cancelar
            </button>
          )}
        </div>
      </form>

      <div className="bg-white border border-gray-200 rounded-3xl shadow-sm overflow-x-auto">

        <table className="w-full min-w-[750px]">

          <thead>
            <tr className="text-left bg-gray-50">
              <th className="p-4 text-sm text-gray-600 font-semibold">
                Cliente
              </th>

              <th className="p-4 text-sm text-gray-600 font-semibold">
                Local
              </th>

              <th className="p-4 text-sm text-gray-600 font-semibold">
                Ações
              </th>
            </tr>
          </thead>

          <tbody>
            {locais.map((local) => (
              <tr
                key={local.id}
                className="border-t border-gray-100 hover:bg-gray-50 transition"
              >
                <td className="p-4 font-medium text-gray-900">
                  {local.cliente || "-"}
                </td>

                <td className="p-4 text-gray-600">
                  {local.nome}
                </td>

                <td className="p-4">
                  <div className="flex gap-2 whitespace-nowrap">

                    <button
                      onClick={() => editarLocal(local)}
                      className="bg-yellow-50 text-yellow-700 px-4 py-2 rounded-xl hover:bg-yellow-100 transition flex items-center gap-2"
                    >
                      <Pencil size={16} />
                      Editar
                    </button>

                    <button
                      onClick={() => excluirLocal(local.id)}
                      className="bg-red-50 text-red-600 px-4 py-2 rounded-xl hover:bg-red-100 transition flex items-center gap-2"
                    >
                      <Trash2 size={16} />
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