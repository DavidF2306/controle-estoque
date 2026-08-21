"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useParams, useRouter } from "next/navigation";
import {
  Package,
  Save,
  ArrowLeft,
  Pencil,
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

    alert("Produto atualizado com sucesso!");
    router.push("/produtos");
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-slate-500">
          <div className="w-8 h-8 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin" />
          <p className="font-medium">Carregando dados do produto...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="text-slate-800 w-full overflow-x-hidden space-y-6">
      
      {/* Hero Section */}
      <section className="pt-14 md:pt-0">
        <div className="relative overflow-hidden rounded-2xl bg-slate-900 text-white shadow-md">
          {/* Elemento de fundo sutil */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
          
          <div className="relative p-6 md:p-10 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-8">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-xl bg-white/10 border border-white/10 backdrop-blur-sm flex items-center justify-center shrink-0">
                <Pencil size={32} className="text-blue-400" />
              </div>

              <div>
                <p className="text-slate-400 text-sm font-medium mb-1 tracking-wide uppercase">
                  Estoque Copystar
                </p>

                <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                  Editar Produto
                </h1>

                <p className="text-slate-400 mt-2 text-sm md:text-base max-w-2xl">
                  Atualize o cadastro do produto e defina o limite mínimo para o alerta de reposição.
                </p>
              </div>
            </div>

            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5 min-w-[260px]">
              <p className="text-slate-400 text-sm font-medium">Produto selecionado</p>

              <p className="text-xl font-bold text-white mt-1 line-clamp-2">
                {nome || "Carregando..."}
              </p>

              <div className="mt-4 flex items-center gap-4">
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Em Estoque</p>
                  <p className="text-lg font-semibold text-slate-200 mt-0.5">{quantidade || 0} un.</p>
                </div>
                <div className="w-px h-8 bg-slate-700" />
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Mínimo</p>
                  <p className="text-lg font-semibold text-slate-200 mt-0.5">{estoqueMinimo || 5} un.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cards de Métricas (Resumo Rápido) */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Quantidade Atual</p>
          <h2 className="text-3xl font-bold text-slate-800 mt-1">{quantidade || 0}</h2>
          <p className="text-xs text-slate-400 mt-1">unidades físicas</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Categoria</p>
          <h2 className="text-2xl font-bold text-slate-800 mt-1">{tipo || "-"}</h2>
          <p className="text-xs text-slate-400 mt-1">classificação do item</p>
        </div>

        <div className="bg-white border border-amber-200/60 rounded-xl p-5 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10 text-amber-600">
            <AlertTriangle size={64} />
          </div>
          <p className="text-sm font-medium text-slate-500 relative z-10">Estoque Mínimo</p>
          <h2 className="text-3xl font-bold text-amber-600 mt-1 relative z-10">
            {estoqueMinimo || 5}
          </h2>
          <p className="text-xs text-amber-600/70 font-medium mt-1 relative z-10">alerta de reposição</p>
        </div>
      </section>

      {/* Formulário de Edição */}
      <form
        onSubmit={atualizarProduto}
        className="bg-white border border-slate-200 rounded-xl p-5 md:p-6 shadow-sm space-y-6 w-full"
      >
        <div className="flex items-center gap-3 mb-4 border-b border-slate-100 pb-4">
          <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Package size={20} />
          </div>

          <div>
            <h2 className="text-lg font-bold text-slate-800">
              Dados do Produto
            </h2>
            <p className="text-sm text-slate-500">
              Modifique as informações necessárias abaixo
            </p>
          </div>
        </div>

        <div className="space-y-5">
          {/* Nome do Produto */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Nome do produto <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Ex: Toner HP 85A"
              className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Tipo */}
            <div className="bg-slate-50/50 border border-slate-200 rounded-lg p-4">
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Categoria / Tipo
              </label>
              <select
                value={tipo}
                onChange={(e) => setTipo(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
              >
                <option value="">Selecione o tipo</option>
                <option value="Original">Original</option>
                <option value="Compatível">Compatível</option>
              </select>
            </div>

            {/* Quantidade */}
            <div className="bg-slate-50/50 border border-slate-200 rounded-lg p-4">
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Quantidade em Estoque <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                value={quantidade}
                onChange={(e) => setQuantidade(e.target.value)}
                min="0"
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                required
              />
            </div>

            {/* Estoque Mínimo */}
            <div className="bg-slate-50/50 border border-slate-200 rounded-lg p-4">
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Estoque Mínimo
              </label>
              <input
                type="number"
                value={estoqueMinimo}
                onChange={(e) => setEstoqueMinimo(e.target.value)}
                min="0"
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
              />
            </div>
          </div>
        </div>

        {/* Alertas e Informações */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <div className="bg-amber-50 border border-amber-200/60 rounded-lg p-4 flex items-start gap-3">
            <AlertTriangle className="text-amber-600 shrink-0 mt-0.5" size={18} />
            <div>
              <p className="font-semibold text-amber-800 text-sm">Alerta de Reposição</p>
              <p className="text-xs text-amber-700/80 mt-1 leading-relaxed">
                O sistema considera "estoque baixo" quando a quantidade ficar igual ou abaixo do estoque mínimo definido aqui.
              </p>
            </div>
          </div>

          <div className="bg-emerald-50 border border-emerald-200/60 rounded-lg p-4 flex items-start gap-3">
            <CheckCircle className="text-emerald-600 shrink-0 mt-0.5" size={18} />
            <div>
              <p className="font-semibold text-emerald-800 text-sm">Alteração Imediata</p>
              <p className="text-xs text-emerald-700/80 mt-1 leading-relaxed">
                Ao salvar as alterações, as métricas do painel inicial serão atualizadas automaticamente em tempo real.
              </p>
            </div>
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-100">
          <button 
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 text-sm shadow-sm"
          >
            <Save size={18} />
            Salvar Alterações
          </button>

          <button
            type="button"
            onClick={() => router.push("/produtos")}
            className="bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900 px-6 py-2.5 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 text-sm shadow-sm"
          >
            <ArrowLeft size={18} />
            Voltar para Produtos
          </button>
        </div>
      </form>
    </div>
  );
}