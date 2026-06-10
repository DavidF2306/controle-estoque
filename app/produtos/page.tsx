"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import BotaoPDF from "../components/BotaoPDF";

export default function Produtos() {
  const [produtos, setProdutos] = useState<any[]>([]);
  const [busca, setBusca] = useState("");

  useEffect(() => {
    buscarProdutos();
  }, []);

  async function buscarProdutos() {
    const { data } = await supabase
      .from("produtos")
      .select("*");

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
    <div className="text-gray-800 w-full overflow-x-hidden">

      <div className="pt-14 md:pt-0 mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">

        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
            Produtos
          </h1>

          <p className="text-gray-500 mt-2">
            Produtos cadastrados no estoque
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <BotaoPDF produtos={produtos} />

          <Link
            href="/produtos/novo"
            className="bg-blue-600 text-white px-5 py-3 rounded-xl font-medium hover:bg-blue-700 transition text-center"
          >
            Novo Produto
          </Link>
        </div>

      </div>

      <div className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-gray-200 mb-6">
        <input
          type="text"
          placeholder="Buscar por nome, categoria ou tipo..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-x-auto">

        <table className="w-full min-w-[850px]">

          <thead className="bg-gray-100">
            <tr className="text-left">
              <th className="p-4 text-gray-800">Nome</th>
              <th className="p-4 text-gray-800">Tipo</th>
              <th className="p-4 text-gray-800">Quantidade</th>
              <th className="p-4 text-gray-800">Categoria</th>
              <th className="p-4 text-gray-800">Ações</th>
            </tr>
          </thead>

          <tbody>
            {produtosFiltrados.map((produto) => (
              <tr
                key={produto.id}
                className={`
                  border-t border-gray-200 hover:bg-gray-50
                  ${produto.quantidade <= 5 ? "bg-red-50" : ""}
                `}
              >
                <td className="p-4 text-gray-800">
                  {produto.nome}
                </td>

                <td className="p-4 text-gray-800">
                  {produto.tipo || "-"}
                </td>

                <td
                  className={`
                    p-4 font-medium
                    ${produto.quantidade <= 5 ? "text-red-600" : "text-gray-800"}
                  `}
                >
                  {produto.quantidade}
                </td>

                <td className="p-4 text-gray-800">
                  {produto.categoria}
                </td>

                <td className="p-4">
                  <div className="flex gap-2 whitespace-nowrap">
                    <Link
                      href={`/produtos/editar/${produto.id}`}
                      className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition"
                    >
                      Editar
                    </Link>

                    <button
                      onClick={() => excluirProduto(produto.id)}
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