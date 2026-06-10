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

    await supabase
      .from("produtos")
      .insert([
        {
          nome,
          codigo,
          quantidade: Number(quantidade),
          categoria,
        },
      ]);

    alert("Produto cadastrado!");

    router.push("/produtos");
  }

  return (
    <div className="text-gray-800 w-full overflow-x-hidden">

      <div className="pt-14 md:pt-0 mb-8">

        <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
          Novo Produto
        </h1>

        <p className="text-gray-500 mt-2">
          Cadastre um novo produto no estoque
        </p>

      </div>

      <form
        onSubmit={salvarProduto}
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
            Nome
          </label>

          <input
            type="text"
            value={nome}
            onChange={(e) =>
              setNome(e.target.value)
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

        <div className="flex flex-col sm:flex-row gap-3">

          <button
            className="
              bg-blue-600
              text-white
              px-6 py-3
              rounded-xl
              font-medium
              hover:bg-blue-700
              transition
            "
          >
            Salvar Produto
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