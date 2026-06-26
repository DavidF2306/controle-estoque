"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useParams, useRouter } from "next/navigation";
import {
  Package,
  Save,
  ArrowLeft,
  Pencil,
  Boxes,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";

export default function EditarProduto() {
  const params = useParams();
  const router = useRouter();

  const [nome, setNome] = useState("");
  const [tipo, setTipo] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [estoqueMinimo, setEstoqueMinimo] = useState("");
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
      setQuantidade(String(data.quantidade || 0));
      setEstoqueMinimo(String(data.estoque_minimo || 5));
    }

    setLoading(false);
  }

  async function atualizarProduto(e: React.FormEvent) {
    e.preventDefault();

    const { error } = await supabase
      .from("produtos")
      .update({
        nome,
        tipo: tipo || null,
        quantidade: Number(quantidade),
        estoque_minimo: Number(estoqueMinimo || 5),
      })
      .eq("id", params.id);

    if (error) {
      alert("Erro ao atualizar produto: " + error.message);
      return;
    }

    alert("Produto atualizado!");
    router.push("/produtos");
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="bg-white border border-gray-200 rounded-3xl px-6 py-4 shadow-sm text-gray-500">
          Carregando produto...
        </div>
      </div>
    );
  }

  return (
    <div className="text-gray-900 w-full overflow-x-hidden space-y-8">
      <section className="pt-14 md:pt-0">
        <div className="relative overflow-hidden rounded-[2.2rem] bg-gradient-to-br from-blue-500 via-indigo-600 to-violet-700 text-white shadow-lg">
          <div className="relative p-6 md:p-10 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-8">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-[2rem] bg-white/20 border border-white/30 flex items-center justify-center">
                <Pencil size={38} />
              </div>

              <div>
                <p className="text-blue-50 text-sm font-medium mb-1">
                  Estoque Copystar
                </p>

                <h1 className="text-4xl md:text-6xl font-extrabold">
                  Editar Produto
                </h1>

                <p className="text-blue-50 mt-2 max-w-2xl">
                  Atualize o produto e defina o limite mínimo para alerta de reposição.
                </p>
              </div>
            </div>

            <div className="bg-white/15 border border-white/20 backdrop-blur rounded-[2rem] p-5 min-w-[240px]">
              <p className="text-blue-50 text-sm">Produto selecionado</p>

              <p className="text-2xl font-extrabold mt-2 line-clamp-2">
                {nome || "Produto"}
              </p>

              <p className="text-blue-50 text-sm mt-2">
                {quantidade || 0} unidade(s) no estoque
              </p>

              <p className="text-blue-50 text-sm mt-1">
                Mínimo: {estoqueMinimo || 5}
              </p>
            </div>
          </div>

          <div className="h-7 bg-white rounded-t-[100%] opacity-95" />
        </div>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-[1.8rem] p-5 shadow-sm">
          <p className="text-sm text-gray-500">Quantidade</p>
          <h2 className="text-4xl font-extrabold mt-2">{quantidade || 0}</h2>
          <p className="text-xs text-gray-400 mt-2">unidades</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-[1.8rem] p-5 shadow-sm">
          <p className="text-sm text-gray-500">Tipo</p>
          <h2 className="text-2xl font-extrabold mt-2">{tipo || "-"}</h2>
          <p className="text-xs text-gray-400 mt-2">classificação</p>
        </div>

        <div className="bg-white border border-orange-200 rounded-[1.8rem] p-5 shadow-sm">
          <p className="text-sm text-gray-500">Estoque mínimo</p>
          <h2 className="text-4xl font-extrabold mt-2 text-orange-600">
            {estoqueMinimo || 5}
          </h2>
          <p className="text-xs text-gray-400 mt-2">alerta de reposição</p>
        </div>
      </section>

      <form
        onSubmit={atualizarProduto}
        className="bg-white border border-gray-200 rounded-[2rem] p-4 md:p-8 shadow-sm space-y-6 w-full max-w-4xl"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center">
            <Package size={22} />
          </div>

          <div>
            <h2 className="text-xl md:text-2xl font-extrabold">
              Dados do produto
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Edite as informações principais do cadastro
            </p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Nome do produto
          </label>

          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Ex: Toner HP 85A"
            className="w-full border border-gray-300 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50/50 border border-blue-100 rounded-3xl p-4">
            <label className="block text-sm font-medium mb-2">Tipo</label>

            <select
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
              className="w-full bg-white border border-blue-200 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Selecione o tipo</option>
              <option value="Original">Original</option>
              <option value="Compatível">Compatível</option>
            </select>
          </div>

          <div className="bg-violet-50/50 border border-violet-100 rounded-3xl p-4">
            <label className="block text-sm font-medium mb-2">Quantidade</label>

            <input
              type="number"
              value={quantidade}
              onChange={(e) => setQuantidade(e.target.value)}
              min="0"
              className="w-full bg-white border border-violet-200 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-violet-500"
              required
            />
          </div>

          <div className="bg-orange-50/50 border border-orange-100 rounded-3xl p-4">
            <label className="block text-sm font-medium mb-2">
              Estoque mínimo
            </label>

            <input
              type="number"
              value={estoqueMinimo}
              onChange={(e) => setEstoqueMinimo(e.target.value)}
              min="0"
              className="w-full bg-white border border-orange-200 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
        </div>

        <div className="bg-orange-50 border border-orange-100 rounded-3xl p-4 flex items-start gap-3">
          <AlertTriangle className="text-orange-700 shrink-0 mt-0.5" size={20} />

          <div>
            <p className="font-bold text-orange-800">Alerta de reposição</p>

            <p className="text-sm text-orange-700/80 mt-1">
              O sistema considera estoque baixo quando a quantidade ficar igual ou abaixo do estoque mínimo definido.
            </p>
          </div>
        </div>

        <div className="bg-emerald-50 border border-emerald-100 rounded-3xl p-4 flex items-start gap-3">
          <CheckCircle className="text-emerald-700 shrink-0 mt-0.5" size={20} />

          <div>
            <p className="font-bold text-emerald-800">Alteração segura</p>

            <p className="text-sm text-emerald-700/80 mt-1">
              Após salvar, o cadastro do produto será atualizado imediatamente.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-bold transition flex items-center justify-center gap-2">
            <Save size={20} />
            Salvar Alterações
          </button>

          <button
            type="button"
            onClick={() => router.push("/produtos")}
            className="bg-gray-900 hover:bg-black text-white px-6 py-3 rounded-2xl font-bold transition flex items-center justify-center gap-2"
          >
            <ArrowLeft size={20} />
            Voltar
          </button>
        </div>
      </form>
    </div>
  );
}