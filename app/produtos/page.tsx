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

    if (data) {
      setProdutos(data);
    }
  }

  async function excluirProduto(id: number) {
    const confirmar = confirm("Deseja realmente excluir?");

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

  return (
    <div className="text-gray-900 w-full overflow-x-hidden">

      <div className="pt-14 md:pt-0 mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">

        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-blue-600 text-white flex items-center justify-center">
            <Package size={22} />
          </div>

          <div>
            <h1 className="text-3xl md:text-4xl font-bold">
              Produtos
            </h1>

            <p className="text-gray-500 mt-1">
              Toners, cartuchos e suprimentos cadastrados
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <BotaoPDF produtos={produtos} />

          <Link
            href="/produtos/novo"
            className="
              bg-blue-600
              hover:bg-blue-700
              text-white
              px-5 py-3
              rounded-2xl
              font-medium
              transition
              text-center
              flex items-center justify-center gap-2
            "
          >
            <Plus size={20} />
            Novo Produto
          </Link>
        </div>

      </div>

      <div className="bg-white border border-gray-200 rounded-3xl p-4 md:p-6 shadow-sm mb-6">

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
            className="
              w-full
              border border-gray-300
              rounded-2xl
              pl-12 pr-4 py-3
              outline-none
              focus:ring-2
              focus:ring-blue-500
            "
          />
        </div>

      </div>

      <div className="bg-white border border-gray-200 rounded-3xl shadow-sm overflow-x-auto">

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
              const baixo = produto.quantidade <= 5;

              return (
                <tr
                  key={produto.id}
                  className="border-t border-gray-100 hover:bg-gray-50 transition"
                >
                  <td className="p-4 font-medium text-gray-900">
                    {produto.nome}
                  </td>

                  <td className="p-4 text-gray-600">
                    {produto.tipo || "-"}
                  </td>

                  <td
                    className={
                      baixo
                        ? "p-4 font-semibold text-red-600"
                        : "p-4 text-gray-600"
                    }
                  >
                    {produto.quantidade}
                  </td>

                  <td className="p-4 text-gray-600">
                    {produto.categoria || "-"}
                  </td>

                  <td className="p-4">
                    {baixo ? (
                      <span className="bg-red-50 text-red-600 px-3 py-1 rounded-full text-sm font-medium">
                        Estoque baixo
                      </span>
                    ) : (
                      <span className="bg-green-50 text-green-600 px-3 py-1 rounded-full text-sm font-medium">
                        Normal
                      </span>
                    )}
                  </td>

                  <td className="p-4">
                    <div className="flex gap-2 whitespace-nowrap">

                      <Link
                        href={`/produtos/editar/${produto.id}`}
                        className="
                          bg-yellow-50
                          text-yellow-700
                          px-4 py-2
                          rounded-xl
                          hover:bg-yellow-100
                          transition
                          flex items-center gap-2
                        "
                      >
                        <Pencil size={16} />
                        Editar
                      </Link>

                      <button
                        onClick={() => excluirProduto(produto.id)}
                        className="
                          bg-red-50
                          text-red-600
                          px-4 py-2
                          rounded-xl
                          hover:bg-red-100
                          transition
                          flex items-center gap-2
                        "
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

      </div>

    </div>
  );
}