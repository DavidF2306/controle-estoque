"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  MapPin,
  Save,
  X,
  Pencil,
  Trash2,
  Search,
  Building2,
  Navigation,
  CheckCircle,
  Users,
} from "lucide-react";

export default function Locais() {
  const [nome, setNome] = useState("");
  const [cliente, setCliente] = useState("");
  const [locais, setLocais] = useState<any[]>([]);
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [busca, setBusca] = useState("");

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
      const { error } = await supabase
        .from("locais")
        .update({
          nome,
          cliente,
        })
        .eq("id", editandoId);

      if (error) {
        alert("Erro ao atualizar local: " + error.message);
        return;
      }

      alert("Local atualizado!");
    } else {
      const { error } = await supabase
        .from("locais")
        .insert([
          {
            nome,
            cliente,
          },
        ]);

      if (error) {
        alert("Erro ao cadastrar local: " + error.message);
        return;
      }

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

    const { error } = await supabase
      .from("locais")
      .delete()
      .eq("id", id);

    if (error) {
      alert("Erro ao excluir local: " + error.message);
      return;
    }

    buscarLocais();
  }

  const locaisFiltrados = locais.filter(
    (local) =>
      local.cliente?.toLowerCase().includes(busca.toLowerCase()) ||
      local.nome?.toLowerCase().includes(busca.toLowerCase())
  );

  const clientesUnicos = [
    ...new Set(
      locais
        .map((local) => local.cliente)
        .filter(Boolean)
    ),
  ];

  return (
    <div className="text-gray-900 w-full overflow-x-hidden space-y-8">

      <section className="pt-14 md:pt-0">
        <div className="relative overflow-hidden rounded-[2.2rem] bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-700 text-white shadow-lg">

          <div className="absolute -top-24 -right-20 w-80 h-80 bg-white/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-sky-300/30 rounded-full blur-3xl" />

          <div className="relative p-6 md:p-10 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-8">

            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-[2rem] bg-white/20 border border-white/30 flex items-center justify-center">
                <MapPin size={38} />
              </div>

              <div>
                <p className="text-blue-50 text-sm font-medium mb-1">
                  Estoque Copystar
                </p>

                <h1 className="text-4xl md:text-6xl font-extrabold">
                  Locais
                </h1>

                <p className="text-blue-50 mt-2 max-w-2xl">
                  Organize clientes, setores e pontos de instalação usados nas saídas de estoque.
                </p>
              </div>
            </div>

            <div className="bg-white/15 border border-white/20 backdrop-blur rounded-[2rem] p-5 min-w-[240px]">
              <p className="text-blue-50 text-sm">
                Cadastro atual
              </p>

              <p className="text-4xl font-extrabold mt-2">
                {locais.length}
              </p>

              <p className="text-blue-50 text-sm mt-1">
                local(is) cadastrados
              </p>

              <p className="text-xs text-blue-50 mt-3">
                {clientesUnicos.length} cliente(s) registrados
              </p>
            </div>

          </div>

          <div className="h-7 bg-white rounded-t-[100%] opacity-95" />
        </div>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-[1.8rem] p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Locais</p>
              <h2 className="text-4xl font-extrabold mt-2">
                {locais.length}
              </h2>
              <p className="text-xs text-gray-400 mt-2">
                pontos cadastrados
              </p>
            </div>

            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center">
              <Navigation size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-[1.8rem] p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Clientes</p>
              <h2 className="text-4xl font-extrabold mt-2">
                {clientesUnicos.length}
              </h2>
              <p className="text-xs text-gray-400 mt-2">
                clientes únicos
              </p>
            </div>

            <div className="w-12 h-12 rounded-2xl bg-violet-50 text-violet-700 flex items-center justify-center">
              <Users size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-[1.8rem] p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Status</p>
              <h2 className="text-3xl font-extrabold mt-2">
                Ativo
              </h2>
              <p className="text-xs text-gray-400 mt-2">
                pronto para saídas
              </p>
            </div>

            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <CheckCircle size={24} />
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        <form
          onSubmit={salvarLocal}
          className="bg-white border border-gray-200 rounded-[2rem] p-4 md:p-6 shadow-sm h-fit"
        >
          <div className="flex items-center gap-3 mb-6">
            <div
              className={
                editandoId
                  ? "w-11 h-11 rounded-2xl bg-yellow-50 text-yellow-700 flex items-center justify-center"
                  : "w-11 h-11 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center"
              }
            >
              {editandoId ? (
                <Pencil size={22} />
              ) : (
                <Building2 size={22} />
              )}
            </div>

            <div>
              <h2 className="text-xl md:text-2xl font-extrabold">
                {editandoId ? "Editando local" : "Novo local"}
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                {editandoId
                  ? "Altere os dados do cliente e local selecionado"
                  : "Cadastre clientes e setores de instalação"}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">

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

          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-bold transition flex items-center justify-center gap-2">
              <Save size={20} />
              {editandoId ? "Salvar alterações" : "Salvar local"}
            </button>

            {editandoId && (
              <button
                type="button"
                onClick={cancelarEdicao}
                className="bg-gray-900 hover:bg-black text-white px-6 py-3 rounded-2xl font-bold transition flex items-center justify-center gap-2"
              >
                <X size={20} />
                Cancelar
              </button>
            )}
          </div>
        </form>

        <div className="bg-white border border-gray-200 rounded-[2rem] p-4 md:p-6 shadow-sm h-fit">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-11 h-11 rounded-2xl bg-cyan-50 text-cyan-700 flex items-center justify-center">
              <Search size={22} />
            </div>

            <div>
              <h2 className="text-xl md:text-2xl font-extrabold">
                Buscar locais
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Encontre rapidamente por cliente ou setor
              </p>
            </div>
          </div>

          <div className="relative">
            <Search
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              placeholder="Buscar por cliente ou local..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="w-full border border-gray-300 rounded-2xl pl-12 pr-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mt-4 bg-blue-50 border border-blue-100 rounded-2xl p-4">
            <p className="text-sm font-medium text-blue-700">
              {locaisFiltrados.length} resultado(s) encontrado(s)
            </p>

            <p className="text-xs text-blue-700/70 mt-1">
              Use esses locais ao registrar uma saída de estoque.
            </p>
          </div>
        </div>

      </section>

      <section className="xl:hidden space-y-4">

        {locaisFiltrados.map((local) => (
          <div
            key={local.id}
            className="bg-white border border-gray-200 rounded-[2rem] p-4 shadow-sm"
          >
            <div className="flex items-start gap-3 mb-4">
              <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
                <Building2 size={21} />
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  Cliente
                </p>

                <h2 className="font-extrabold text-lg text-gray-900">
                  {local.cliente || "-"}
                </h2>
              </div>
            </div>

            <div className="bg-gray-50 rounded-2xl p-3 mb-4">
              <p className="text-sm text-gray-500">
                Local
              </p>

              <p className="font-bold text-gray-900 mt-1">
                {local.nome}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <button
                onClick={() => editarLocal(local)}
                className="bg-yellow-50 text-yellow-700 px-4 py-3 rounded-2xl hover:bg-yellow-100 transition flex items-center justify-center gap-2 font-bold"
              >
                <Pencil size={16} />
                Editar
              </button>

              <button
                onClick={() => excluirLocal(local.id)}
                className="bg-red-50 text-red-600 px-4 py-3 rounded-2xl hover:bg-red-100 transition flex items-center justify-center gap-2 font-bold"
              >
                <Trash2 size={16} />
                Excluir
              </button>
            </div>
          </div>
        ))}

      </section>

      <section className="hidden xl:block bg-white border border-gray-200 rounded-[2rem] shadow-sm overflow-x-auto">

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
                Status
              </th>

              <th className="p-4 text-sm text-gray-600 font-semibold">
                Ações
              </th>
            </tr>
          </thead>

          <tbody>
            {locaisFiltrados.map((local) => (
              <tr
                key={local.id}
                className="border-t border-gray-100 hover:bg-blue-50/40 transition"
              >
                <td className="p-4 font-bold text-gray-900">
                  {local.cliente || "-"}
                </td>

                <td className="p-4 text-gray-600">
                  {local.nome}
                </td>

                <td className="p-4">
                  <span className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-sm font-bold">
                    Ativo
                  </span>
                </td>

                <td className="p-4">
                  <div className="flex gap-2 whitespace-nowrap">

                    <button
                      onClick={() => editarLocal(local)}
                      className="bg-yellow-50 text-yellow-700 px-4 py-2 rounded-xl hover:bg-yellow-100 transition flex items-center gap-2 font-medium"
                    >
                      <Pencil size={16} />
                      Editar
                    </button>

                    <button
                      onClick={() => excluirLocal(local.id)}
                      className="bg-red-50 text-red-600 px-4 py-2 rounded-xl hover:bg-red-100 transition flex items-center gap-2 font-medium"
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

      </section>

    </div>
  );
}