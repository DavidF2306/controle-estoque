"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useParams, useRouter } from "next/navigation";

export default function EditarProduto() {

  const params = useParams();
  const router = useRouter();

  const [nome, setNome] = useState("");
  const [codigo, setCodigo] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [categoria, setCategoria] = useState("");

  useEffect(() => {
    buscarProduto();
  }, []);

  async function buscarProduto() {

    const { data } = await supabase
      .from("produtos")
      .select("*")
      .eq("id", params.id)
      .single();

    if (data) {
      setNome(data.nome);
      setCodigo(data.codigo);
      setQuantidade(data.quantidade);
      setCategoria(data.categoria);
    }
  }

  async function atualizarProduto(
    e: React.FormEvent
  ) {

    e.preventDefault();

    await supabase
      .from("produtos")
      .update({
        nome,
        codigo,
        quantidade: Number(quantidade),
        categoria,
      })
      .eq("id", params.id);

    alert("Produto atualizado!");

    router.push("/produtos");
  }

  return (
    <div className="max-w-2xl">

      <h1 className="text-4xl font-bold text-gray-800 mb-2">
        Editar Produto
      </h1>

      <p className="text-gray-500 mb-8">
        Atualize os dados do produto
      </p>

      <form
        onSubmit={atualizarProduto}
        className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 space-y-6"
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
            className="w-full border border-gray-300 rounded-xl px-4 py-3"
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
            className="w-full border border-gray-300 rounded-xl px-4 py-3"
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
            className="w-full border border-gray-300 rounded-xl px-4 py-3"
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
            className="w-full border border-gray-300 rounded-xl px-4 py-3"
          />
        </div>

        <button className="bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition">
          Salvar Alterações
        </button>

      </form>

    </div>
  );
}