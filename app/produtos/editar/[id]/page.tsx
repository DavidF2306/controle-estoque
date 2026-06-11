"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useParams, useRouter } from "next/navigation";
import {
  Package,
  Save,
  ArrowLeft,
} from "lucide-react";

export default function EditarProduto() {
  const params = useParams();
  const router = useRouter();

  const [nome, setNome] = useState("");
  const [tipo, setTipo] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [categoria, setCategoria] = useState("");
  const [loading, setLoading] = useState(true);

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
      setNome(data.nome || "");
      setTipo(data.tipo || "");
      setQuantidade(
        String(data.quantidade || 0)
      );
      setCategoria(data.categoria || "");
    }

    setLoading(false);
  }

  async function atualizarProduto(
    e: React.FormEvent
  ) {
    e.preventDefault();

    const { error } = await supabase
      .from("produtos")
      .update({
        nome,
        tipo: tipo || null,
        quantidade: Number(quantidade),
        categoria,
      })
      .eq("id", params.id);

    if (error) {
      alert(
        "Erro ao atualizar produto: " +
          error.message
      );
      return;
    }

    alert("Produto atualizado!");

    router.push("/produtos");
  }

  if (loading) {
    return (
      <div className="text-gray-600">
        Carregando...
      </div>
    );
  }

  return (
    <div className="text-gray-900 w-full overflow-x-hidden">

      <div className="pt-14 md:pt-0 mb-8 flex items-center gap-3">

        <div className="w-11 h-11 rounded-2xl bg-blue-600 text-white flex items-center justify-center">
          <Package size={22} />
        </div>

        <div>
          <h1 className="text-3xl md:text-4xl font-bold">
            Editar Produto
          </h1>

          <p className="text-gray-500 mt-1">
            Atualize os dados do produto
          </p>
        </div>

      </div>

      <form
        onSubmit={atualizarProduto}
        className="
          bg-white
          border border-gray-200
          rounded-3xl
          p-4 md:p-8
          shadow-sm
          space-y-6
          w-full
          max-w-2xl
        "
      >

        <div>

          <label className="block text-sm font-medium mb-2">
            Nome do produto
          </label>

          <input
            type="text"
            value={nome}
            onChange={(e) =>
              setNome(e.target.value)
            }
            placeholder="Ex: Toner HP 85A"
            className="
              w-full
              border border-gray-300
              rounded-2xl
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
            Tipo
          </label>

          <select
            value={tipo}
            onChange={(e) =>
              setTipo(e.target.value)
            }
            className="
              w-full
              border border-gray-300
              rounded-2xl
              px-4 py-3
              outline-none
              focus:ring-2
              focus:ring-blue-500
            "
          >

            <option value="">
              Selecione o tipo
            </option>

            <option value="Original">
              Original
            </option>

            <option value="Compatível">
              Compatível
            </option>

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
            min="0"
            className="
              w-full
              border border-gray-300
              rounded-2xl
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
            placeholder="Ex: Toner"
            className="
              w-full
              border border-gray-300
              rounded-2xl
              px-4 py-3
              outline-none
              focus:ring-2
              focus:ring-blue-500
            "
          />

        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">

          <button
            className="
              bg-blue-600
              hover:bg-blue-700
              text-white
              px-6 py-3
              rounded-2xl
              font-medium
              transition
              flex items-center
              justify-center
              gap-2
            "
          >
            <Save size={20} />
            Salvar Alterações
          </button>

          <button
            type="button"
            onClick={() =>
              router.push("/produtos")
            }
            className="
              bg-gray-900
              hover:bg-black
              text-white
              px-6 py-3
              rounded-2xl
              font-medium
              transition
              flex items-center
              justify-center
              gap-2
            "
          >
            <ArrowLeft size={20} />
            Voltar
          </button>

        </div>

      </form>

    </div>
  );
}