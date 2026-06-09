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

    const confirmar = confirm(
      "Deseja realmente excluir?"
    );

    if (!confirmar) return;

    await supabase
      .from("entradas")
      .delete()
      .eq("produto_id", id);

    await supabase
      .from("saidas")
      .delete()
      .eq("produto_id", id);

    await supabase
      .from("produtos")
      .delete()
      .eq("id", id);

    buscarProdutos();
  }

  const produtosFiltrados =
    produtos.filter((produto) =>

      produto.nome
        ?.toLowerCase()
        .includes(
          busca.toLowerCase()
        )

      ||

      produto.codigo
        ?.toLowerCase()
        .includes(
          busca.toLowerCase()
        )
    );

  return (
    <div>

      <div className="flex items-center justify-between mb-8">

        <div>

          <h1 className="text-4xl font-bold text-gray-800">
            Produtos
          </h1>

          <p className="text-gray-500 mt-2">
            Produtos cadastrados no estoque
          </p>

        </div>

        <div className="flex gap-3">

          <BotaoPDF produtos={produtos} />

          <Link
            href="/produtos/novo"
            className="bg-blue-600 text-white px-5 py-3 rounded-xl font-medium hover:bg-blue-700 transition"
          >
            Novo Produto
          </Link>

        </div>

      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 mb-6">

        <input
          type="text"
          placeholder="Buscar por nome ou código..."
          value={busca}
          onChange={(e) =>
            setBusca(e.target.value)
          }
          className="
            w-full
            border border-gray-300
            rounded-xl
            px-4 py-3
            outline-none
            focus:ring-2
            focus:ring-blue-500
          "
        />

      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">

        <table className="w-full">

          <thead className="bg-gray-100">

            <tr className="text-left">

              <th className="p-4">
                Nome
              </th>

              <th className="p-4">
                Código
              </th>

              <th className="p-4">
                Quantidade
              </th>

              <th className="p-4">
                Categoria
              </th>

              <th className="p-4">
                Ações
              </th>

            </tr>

          </thead>

          <tbody>

            {produtosFiltrados.map((produto) => (

              <tr
                key={produto.id}
                className={`
                  border-t hover:bg-gray-50
                  ${
                    produto.quantidade <= 5
                      ? "bg-red-50"
                      : ""
                  }
                `}
              >

                <td className="p-4">
                  {produto.nome}
                </td>

                <td className="p-4">
                  {produto.codigo}
                </td>

                <td
                  className={`
                    p-4 font-medium
                    ${
                      produto.quantidade <= 5
                        ? "text-red-600"
                        : ""
                    }
                  `}
                >
                  {produto.quantidade}
                </td>

                <td className="p-4">
                  {produto.categoria}
                </td>

                <td className="p-4 flex gap-2">

                  <Link
                    href={`/produtos/editar/${produto.id}`}
                    className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition"
                  >
                    Editar
                  </Link>

                  <button
                    onClick={() =>
                      excluirProduto(produto.id)
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