"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function Saidas() {
  const router = useRouter();

  const [produtos, setProdutos] = useState<any[]>([]);
  const [produtoId, setProdutoId] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [destino, setDestino] = useState("");

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

  async function registrarSaida(e: React.FormEvent) {
    e.preventDefault();

    const produtoSelecionado = produtos.find(
      (produto) => produto.id === Number(produtoId)
    );

    if (!produtoSelecionado) {
      alert("Selecione um produto.");
      return;
    }

    if (
      Number(quantidade) >
      produtoSelecionado.quantidade
    ) {
      alert("Quantidade maior que o estoque.");
      return;
    }

    const novaQuantidade =
      produtoSelecionado.quantidade -
      Number(quantidade);

    await supabase
      .from("saidas")
      .insert([
        {
          produto_id: Number(produtoId),
          quantidade: Number(quantidade),
          destino,
        },
      ]);

    await supabase
      .from("produtos")
      .update({
        quantidade: novaQuantidade,
      })
      .eq("id", produtoId);

    alert("Saída registrada com sucesso!");

    router.push("/produtos");
  }

  return (
    <div className="text-gray-800 w-full overflow-x-hidden">

      <div className="pt-14 md:pt-0 mb-8">

        <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
          Saída de Estoque
        </h1>

        <p className="text-gray-500 mt-2">
          Registre uma saída de produto
        </p>

      </div>

      <form
        onSubmit={registrarSaida}
        className="
          bg-white
          p-4 md:p-8
          rounded-2xl
          shadow-sm
          border border-gray-200
          space-y-6
          w-full
          max-w-2xl
        "
      >

        <div>

          <label className="block text-sm font-medium mb-2">
            Produto
          </label>

          <select
            value={produtoId}
            onChange={(e) =>
              setProdutoId(e.target.value)
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
            required
          >

            <option value="">
              Selecione um produto
            </option>

            {produtos.map((produto) => (

              <option
                key={produto.id}
                value={produto.id}
              >
                {produto.nome}
              </option>

            ))}

          </select>

        </div>

        <div>

          <label className="block text-sm font-medium mb-2">
            Quantidade
          </label>

          <input
            type="number"
            value={quantidade}
            onChange={(e) =>
              setQuantidade(e.target.value)
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
            placeholder="0"
            min="1"
            required
          />

        </div>

        <div>

          <label className="block text-sm font-medium mb-2">
            Destino
          </label>

          <input
            type="text"
            value={destino}
            onChange={(e) =>
              setDestino(e.target.value)
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
            placeholder="Ex: Hospital Municipal"
            required
          />

        </div>

        <div className="flex flex-col sm:flex-row gap-3">

          <button
            className="
              bg-red-600
              text-white
              px-6 py-3
              rounded-xl
              font-medium
              hover:bg-red-700
              transition
            "
          >
            Registrar Saída
          </button>

          <button
            type="button"
            onClick={() =>
              router.push("/produtos")
            }
            className="
              bg-gray-800
              text-white
              px-6 py-3
              rounded-xl
              font-medium
              hover:bg-black
              transition
            "
          >
            Voltar
          </button>

        </div>

      </form>

    </div>
  );
}