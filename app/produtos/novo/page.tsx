"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function NovoProduto() {

  const router = useRouter();

  const [nome, setNome] = useState("");
  const [codigo, setCodigo] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [categoria, setCategoria] = useState("");

  async function salvarProduto(
    e: React.FormEvent
  ) {

    e.preventDefault();

    const { error } = await supabase
      .from("produtos")
      .insert([
        {
          nome,
          codigo,
          quantidade: Number(quantidade),
          categoria,
        },
      ]);

    if (!error) {
      router.push("/produtos");
      router.refresh();
    }
  }

  return (
    <div className="max-w-2xl">

      <h1 className="text-4xl font-bold text-gray-800 mb-2">
        Novo Produto
      </h1>

      <p className="text-gray-500 mb-8">
        Cadastre um novo produto no estoque
      </p>

      <form
        onSubmit={salvarProduto}
        className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 space-y-6"
      >

        <div>
          <label className="block text-sm font-medium mb-2">
            Nome do Produto
          </label>

          <input
            type="text"
            value={nome}
            onChange={(e) =>
              setNome(e.target.value)
            }
            className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Digite o nome"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Código
          </label>

          <input
            type="text"
            value={codigo}
            onChange={(e) =>
              setCodigo(e.target.value)
            }
            className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ex: NBK-001"
          />
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
            className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="0"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Categoria
          </label>

          <input
            type="text"
            value={categoria}
            onChange={(e) =>
              setCategoria(e.target.value)
            }
            className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ex: Energia"
          />
        </div>

        <button className="bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition">
          Salvar Produto
        </button>

      </form>

    </div>
  );
}