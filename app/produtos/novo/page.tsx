"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Package,
  Save,
  CheckCircle,
  PlusCircle,
  AlertTriangle,
} from "lucide-react";

export default function NovoProduto() {
  const router = useRouter();

  const [nome, setNome] = useState("");
  const [tipo, setTipo] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [estoqueMinimo, setEstoqueMinimo] = useState("5");

  async function salvarProduto(e: React.FormEvent) {
    e.preventDefault();

    const { error } = await supabase.from("produtos").insert([
      {
        nome,
        tipo: tipo || null,
        quantidade: Number(quantidade),
        estoque_minimo: Number(estoqueMinimo || 5),
      },
    ]);

    if (error) {
      alert("Erro ao cadastrar produto: " + error.message);
      return;
    }

    alert("Produto cadastrado com sucesso!");
    router.push("/produtos");
  }

  return (
    <div className="text-slate-800 w-full overflow-x-hidden space-y-6">
      
      {/* Hero Section */}
      <section className="pt-14 md:pt-0">
        <div className="relative overflow-hidden rounded-2xl bg-slate-900 text-white shadow-md">
          {/* Elemento de fundo sutil */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
          
          <div className="relative p-6 md:p-10 flex items-center gap-5">
            <div className="w-16 h-16 rounded-xl bg-white/10 border border-white/10 backdrop-blur-sm flex items-center justify-center shrink-0">
              <PlusCircle size={32} className="text-blue-400" />
            </div>

            <div>
              <p className="text-slate-400 text-sm font-medium mb-1 tracking-wide uppercase">
                Estoque Copystar
              </p>

              <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                Novo Produto
              </h1>

              <p className="text-slate-400 mt-2 text-sm md:text-base max-w-2xl">
                Cadastre toners, cartuchos, cilindros e suprimentos no estoque.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Cards de Métricas (Resumo Rápido) */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Ação</p>
          <h2 className="text-3xl font-bold text-slate-800 mt-1">Cadastro</h2>
          <p className="text-xs text-slate-400 mt-1">novo item no sistema</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Quantidade Inicial</p>
          <h2 className="text-3xl font-bold text-slate-800 mt-1">
            {quantidade || 0}
          </h2>
          <p className="text-xs text-slate-400 mt-1">unidades físicas</p>
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

      {/* Formulário de Cadastro */}
      <form
        onSubmit={salvarProduto}
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
              Preencha as informações principais do cadastro
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
                <option value="">Selecione o tipo (opcional)</option>
                <option value="Original">Original</option>
                <option value="Compatível">Compatível</option>
              </select>
            </div>

            {/* Quantidade Inicial */}
            <div className="bg-slate-50/50 border border-slate-200 rounded-lg p-4">
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Quantidade Inicial <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                value={quantidade}
                onChange={(e) => setQuantidade(e.target.value)}
                placeholder="0"
                min="0"
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                required
              />
            </div>

            {/* Estoque Mínimo */}
            <div className="bg-slate-50/50 border border-slate-200 rounded-lg p-4">
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Estoque Mínimo <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                value={estoqueMinimo}
                onChange={(e) => setEstoqueMinimo(e.target.value)}
                placeholder="Ex: 10"
                min="0"
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                required
              />
            </div>
          </div>
        </div>

        {/* Alertas e Informações */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <div className="bg-amber-50 border border-amber-200/60 rounded-lg p-4 flex items-start gap-3">
            <AlertTriangle className="text-amber-600 shrink-0 mt-0.5" size={18} />
            <div>
              <p className="font-semibold text-amber-800 text-sm">Alerta Personalizado</p>
              <p className="text-xs text-amber-700/80 mt-1 leading-relaxed">
                Quando a quantidade ficar igual ou abaixo do estoque mínimo, o painel indicará que a reposição é necessária.
              </p>
            </div>
          </div>

          <div className="bg-emerald-50 border border-emerald-200/60 rounded-lg p-4 flex items-start gap-3">
            <CheckCircle className="text-emerald-600 shrink-0 mt-0.5" size={18} />
            <div>
              <p className="font-semibold text-emerald-800 text-sm">Cadastro Seguro</p>
              <p className="text-xs text-emerald-700/80 mt-1 leading-relaxed">
                Após salvar, o produto ficará imediatamente disponível para registros de entradas e saídas no sistema.
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
            Salvar Produto
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