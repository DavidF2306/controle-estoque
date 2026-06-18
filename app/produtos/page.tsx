"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import BotaoPDF from "../components/BotaoPDF";
import {
  Package,
  Plus,
  Search,
  Pencil,
  Trash2,
  AlertTriangle,
  CheckCircle,
  Boxes,
} from "lucide-react";

export default function Produtos() {
  const [produtos, setProdutos] = useState<any[]>([]);
  const [busca, setBusca] = useState("");

  useEffect(() => {
    buscarProdutos();
  }, []);

  async function buscarProdutos() {
    const { data } = await supabase
      .from("produtos")
      .select("*")
      .order("nome");

    if (data) setProdutos(data);
  }

  async function excluirProduto(id: number) {
    const confirmar = confirm("Deseja realmente excluir este produto?");
    if (!confirmar) return;

    await supabase.from("entradas").delete().eq("produto_id", id);
    await supabase.from("saidas").delete().eq("produto_id", id);
    await supabase.from("produtos").delete().eq("id", id);

    buscarProdutos();
  }

  const produtosFiltrados = produtos.filter(
    (produto) =>
      produto.nome?.toLowerCase().includes(busca.toLowerCase()) ||
      produto.categoria?.toLowerCase().includes(busca.toLowerCase()) ||
      produto.tipo?.toLowerCase().includes(busca.toLowerCase())
  );

  const totalProdutos = produtos.length;

  const totalEstoque = produtos.reduce(
    (total, produto) => total + Number(produto.quantidade || 0),
    0
  );

  const estoqueBaixo = produtos.filter(
    (produto) => Number(produto.quantidade || 0) <= 5
  ).length;

  const estoqueNormal = totalProdutos - estoqueBaixo;

  return (
    <div className="text-gray-900 w-full overflow-x-hidden space-y-8">

      <section className="pt-14 md:pt-0">
        <div className="relative overflow-hidden rounded-[2.2rem] bg-gradient-to-br from-blue-500 via-sky-500 to-cyan-400 text-white shadow-lg">

          <div className="absolute -top-24 -right-20 w-80 h-80 bg-white/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-blue-900/20 rounded-full blur-3xl" />

          <div className="relative p-6 md:p-10 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-8">

            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-[2rem] bg-white/20 border border-white/30 flex items-center justify-center">
                <Package size={38} />
              </div>

              <div>
                <p className="text-blue-50 text-sm font-medium mb-1">
                  Estoque Copystar
                </p>

                <h1 className="text-4xl md:text-6xl font-extrabold">
                  Produtos
                </h1>

                <p className="text-blue-50 mt-2 max-w-2xl">
                  Gerencie toners, cartuchos, impressoras e suprimentos cadastrados no sistema.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full xl:w-auto">
              <BotaoPDF produtos={produtos} />

              <Link
                href="/produtos/novo"
                className="bg-white text-blue-700 hover:bg-blue-50 px-5 py-3 rounded-2xl font-bold transition text-center flex items-center justify-center gap-2 shadow-sm"
              >
                <Plus size={20} />
                Novo Produto
              </Link>
            </div>

          </div>

          <div className="h-7 bg-white rounded-t-[100%] opacity-95" />
        </div>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-[1.8rem] p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Produtos</p>
              <h2 className="text-4xl font-extrabold mt-2">{totalProdutos}</h2>
              <p className="text-xs text-gray-400 mt-2">cadastrados</p>
            </div>

            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center">
              <Package size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-[1.8rem] p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Estoque total</p>
              <h2 className="text-4xl font-extrabold mt-2">{totalEstoque}</h2>
              <p className="text-xs text-gray-400 mt-2">unidades</p>
            </div>

            <div className="w-12 h-12 rounded-2xl bg-violet-50 text-violet-700 flex items-center justify-center">
              <Boxes size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-[1.8rem] p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Estoque normal</p>
              <h2 className="text-4xl font-extrabold mt-2">{estoqueNormal}</h2>
              <p className="text-xs text-gray-400 mt-2">produtos ok</p>
            </div>

            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <CheckCircle size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-[1.8rem] p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Estoque baixo</p>
              <h2 className="text-4xl font-extrabold mt-2">{estoqueBaixo}</h2>
              <p className="text-xs text-gray-400 mt-2">atenção necessária</p>
            </div>

            <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-700 flex items-center justify-center">
              <AlertTriangle size={24} />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white border border-gray-200 rounded-[2rem] p-4 md:p-6 shadow-sm">
        <label className="block text-sm font-medium mb-2">
          Buscar produto
        </label>

        <div className="relative">
          <Search
            size={20}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            placeholder="Buscar por nome, categoria ou tipo..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="w-full border border-gray-300 rounded-2xl pl-12 pr-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <p className="text-sm text-gray-500 mt-3">
          {produtosFiltrados.length} produto(s) encontrado(s)
        </p>
      </section>

      <section className="xl:hidden space-y-4">
        {produtosFiltrados.map((produto) => {
          const baixo = Number(produto.quantidade) <= 5;

          return (
            <div
              key={produto.id}
              className="bg-white border border-gray-200 rounded-[2rem] p-4 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3 mb-4">
                <div>
                  <h2 className="font-extrabold text-lg text-gray-900">
                    {produto.nome}
                  </h2>

                  <p className="text-sm text-gray-500 mt-1">
                    {produto.categoria || "Sem categoria"}
                  </p>
                </div>

                {baixo ? (
                  <span className="bg-orange-50 text-orange-700 px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap">
                    Baixo
                  </span>
                ) : (
                  <span className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap">
                    Normal
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                <div className="bg-gray-50 rounded-2xl p-3">
                  <p className="text-gray-500">Tipo</p>
                  <p className="font-bold mt-1">{produto.tipo || "-"}</p>
                </div>

                <div className="bg-gray-50 rounded-2xl p-3">
                  <p className="text-gray-500">Quantidade</p>

                  <p
                    className={
                      baixo
                        ? "font-extrabold text-orange-700 mt-1"
                        : "font-extrabold text-gray-900 mt-1"
                    }
                  >
                    {produto.quantidade} un.
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <Link
                  href={`/produtos/editar/${produto.id}`}
                  className="bg-yellow-50 text-yellow-700 px-4 py-3 rounded-2xl hover:bg-yellow-100 transition flex items-center justify-center gap-2 font-bold"
                >
                  <Pencil size={16} />
                  Editar
                </Link>

                <button
                  onClick={() => excluirProduto(produto.id)}
                  className="bg-red-50 text-red-600 px-4 py-3 rounded-2xl hover:bg-red-100 transition flex items-center justify-center gap-2 font-bold"
                >
                  <Trash2 size={16} />
                  Excluir
                </button>
              </div>
            </div>
          );
        })}
      </section>

      <section className="hidden xl:block bg-white border border-gray-200 rounded-[2rem] shadow-sm overflow-x-auto">

        <table className="w-full min-w-[850px]">

          <thead>
            <tr className="text-left bg-gray-50">
              <th className="p-4 text-sm text-gray-600 font-semibold">
                Produto
              </th>

              <th className="p-4 text-sm text-gray-600 font-semibold">
                Tipo
              </th>

              <th className="p-4 text-sm text-gray-600 font-semibold">
                Quantidade
              </th>

              <th className="p-4 text-sm text-gray-600 font-semibold">
                Categoria
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
            {produtosFiltrados.map((produto) => {
              const baixo = Number(produto.quantidade) <= 5;

              return (
                <tr
                  key={produto.id}
                  className="border-t border-gray-100 hover:bg-blue-50/40 transition"
                >
                  <td className="p-4 font-bold text-gray-900">
                    {produto.nome}
                  </td>

                  <td className="p-4 text-gray-600">
                    {produto.tipo || "-"}
                  </td>

                  <td
                    className={
                      baixo
                        ? "p-4 font-extrabold text-orange-700"
                        : "p-4 font-bold text-gray-700"
                    }
                  >
                    {produto.quantidade} un.
                  </td>

                  <td className="p-4 text-gray-600">
                    {produto.categoria || "-"}
                  </td>

                  <td className="p-4">
                    {baixo ? (
                      <span className="bg-orange-50 text-orange-700 px-3 py-1 rounded-full text-sm font-bold">
                        Estoque baixo
                      </span>
                    ) : (
                      <span className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-sm font-bold">
                        Normal
                      </span>
                    )}
                  </td>

                  <td className="p-4">
                    <div className="flex gap-2 whitespace-nowrap">
                      <Link
                        href={`/produtos/editar/${produto.id}`}
                        className="bg-yellow-50 text-yellow-700 px-4 py-2 rounded-xl hover:bg-yellow-100 transition flex items-center gap-2 font-medium"
                      >
                        <Pencil size={16} />
                        Editar
                      </Link>

                      <button
                        onClick={() => excluirProduto(produto.id)}
                        className="bg-red-50 text-red-600 px-4 py-2 rounded-xl hover:bg-red-100 transition flex items-center gap-2 font-medium"
                      >
                        <Trash2 size={16} />
                        Excluir
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>

        </table>

      </section>

    </div>
  );
}