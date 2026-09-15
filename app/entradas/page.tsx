"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import {
  ArrowDownCircle,
  Save,
  ArrowLeft,
  Package,
  Boxes,
  FileText,
  ClipboardList,
  Truck,
  CheckCircle,
} from "lucide-react";

export default function Entradas() {
  const router = useRouter();

  const [produtos, setProdutos] = useState<any[]>([]);
  const [entradas, setEntradas] = useState<any[]>([]);

  const [produtoId, setProdutoId] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [origem, setOrigem] = useState("");
  const [notaFiscal, setNotaFiscal] = useState("");
  const [contador, setContador] = useState("");
  const [observacoes, setObservacoes] = useState("");

  useEffect(() => {
    buscarDados();
  }, []);

  async function buscarDados() {
    const { data: produtosData } = await supabase
      .from("produtos")
      .select("*")
      .order("nome");

    const { data: entradasData } = await supabase
      .from("entradas")
      .select("*")
      .order("created_at", { ascending: false });

    if (produtosData) setProdutos(produtosData);
    if (entradasData) setEntradas(entradasData);
  }

  async function registrarEntrada(e: React.FormEvent) {
    e.preventDefault();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const emailUsuario = user?.email || "Usuário não identificado";

    const produtoSelecionado = produtos.find(
      (produto) => produto.id === Number(produtoId)
    );

    if (!produtoSelecionado) {
      alert("Selecione um produto.");
      return;
    }

    const novaQuantidade =
      Number(produtoSelecionado.quantidade) + Number(quantidade);

    const { error: erroEntrada } = await supabase.from("entradas").insert([
      {
        produto_id: Number(produtoId),
        quantidade: Number(quantidade),
        origem,
        nota_fiscal: notaFiscal || null,
        contador: contador || null,
        observacoes: observacoes || null,
        usuario_email: emailUsuario,
      },
    ]);

    if (erroEntrada) {
      alert("Erro ao registrar entrada: " + erroEntrada.message);
      return;
    }

    const { error: erroProduto } = await supabase
      .from("produtos")
      .update({
        quantidade: novaQuantidade,
      })
      .eq("id", produtoId);

    if (erroProduto) {
      alert("Erro ao atualizar estoque: " + erroProduto.message);
      return;
    }

    alert("Entrada registrada com sucesso!");

    router.push("/produtos");
  }

  const totalProdutos = produtos.length;

  const totalEstoque = produtos.reduce(
    (total, produto) => total + Number(produto.quantidade || 0),
    0
  );

  const ultimaEntrada = entradas[0];

  return (
    <div className="text-slate-800 w-full overflow-x-hidden space-y-6">
      
      {/* Hero Section */}
      <section className="pt-14 md:pt-0">
        <div className="relative overflow-hidden rounded-2xl bg-slate-900 text-white shadow-md">
          {/* Elementos de fundo sutis */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
          
          <div className="relative p-6 md:p-10 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-8">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-xl bg-white/10 border border-white/10 backdrop-blur-sm flex items-center justify-center shrink-0">
                <ArrowDownCircle size={32} className="text-emerald-400" />
              </div>

              <div>
                <p className="text-slate-400 text-sm font-medium mb-1 tracking-wide uppercase">
                  Movimentação
                </p>

                <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                  Entrada de Estoque
                </h1>

                <p className="text-slate-400 mt-2 text-sm md:text-base max-w-2xl">
                  Registre novos suprimentos recebidos, atualize quantidades e mantenha o catálogo sempre atualizado.
                </p>
              </div>
            </div>

            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5 min-w-[240px]">
              <p className="text-slate-400 text-sm font-medium">
                Total de entradas
              </p>

              <div className="flex items-end gap-2 mt-2">
                <p className="text-3xl font-bold text-white">
                  {entradas.length}
                </p>
                <p className="text-slate-400 text-sm mb-1">registros</p>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-700">
                <p className="text-xs font-medium text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle size={14} />
                  {ultimaEntrada
                    ? "Sistema operacional e sincronizado."
                    : "Nenhuma entrada registrada ainda."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cards de Métricas */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex items-start justify-between hover:shadow-md transition-shadow">
          <div>
            <p className="text-sm font-medium text-slate-500">Produtos</p>
            <h2 className="text-3xl font-bold text-slate-800 mt-1">
              {totalProdutos}
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              disponíveis no catálogo
            </p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <Package size={20} />
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex items-start justify-between hover:shadow-md transition-shadow">
          <div>
            <p className="text-sm font-medium text-slate-500">Estoque Geral</p>
            <h2 className="text-3xl font-bold text-slate-800 mt-1">
              {totalEstoque}
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              unidades totais
            </p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-slate-50 text-slate-600 flex items-center justify-center">
            <Boxes size={20} />
          </div>
        </div>

        <div className="bg-emerald-50 border border-emerald-200/60 rounded-xl p-5 shadow-sm flex items-start justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10 text-emerald-600">
            <CheckCircle size={64} />
          </div>
          <div className="relative z-10">
            <p className="text-sm font-medium text-emerald-800/70">Status do Módulo</p>
            <h2 className="text-3xl font-bold text-emerald-700 mt-1">
              Operante
            </h2>
            <p className="text-xs text-emerald-600 font-medium mt-1">
              pronto para registros
            </p>
          </div>
        </div>
      </section>

      {/* Formulário */}
      <form
        onSubmit={registrarEntrada}
        className="bg-white border border-slate-200 rounded-xl p-5 md:p-6 shadow-sm space-y-6 w-full"
      >
        <div className="flex items-center gap-3 mb-4 border-b border-slate-100 pb-4">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <ClipboardList size={20} />
          </div>

          <div>
            <h2 className="text-lg font-bold text-slate-800">
              Dados da Entrada
            </h2>
            <p className="text-sm text-slate-500">
              Preencha os dados do suprimento recebido para adicionar ao estoque.
            </p>
          </div>
        </div>

        {/* Produto */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
            Selecione o Produto <span className="text-rose-500">*</span>
          </label>
          <select
            value={produtoId}
            onChange={(e) => setProdutoId(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-shadow appearance-none"
            required
          >
            <option value="">Selecione um produto cadastrado...</option>
            {produtos.map((produto) => (
              <option key={produto.id} value={produto.id}>
                {produto.nome} — (Estoque Atual: {produto.quantidade})
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Quantidade */}
          <div className="bg-slate-50/50 border border-slate-200 rounded-lg p-4">
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Quantidade Recebida <span className="text-rose-500">*</span>
            </label>
            <input
              type="number"
              value={quantidade}
              onChange={(e) => setQuantidade(e.target.value)}
              min="1"
              placeholder="0"
              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-shadow"
              required
            />
          </div>

          {/* Origem */}
          <div className="bg-slate-50/50 border border-slate-200 rounded-lg p-4">
            <label className="text-sm font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
              Origem da Entrada <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Truck size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={origem}
                onChange={(e) => setOrigem(e.target.value)}
                placeholder="Fornecedor, compra corporativa, devolução..."
                className="w-full bg-white border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-shadow"
                required
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Nota Fiscal */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Nota Fiscal (Opcional)
            </label>
            <input
              type="text"
              value={notaFiscal}
              onChange={(e) => setNotaFiscal(e.target.value)}
              placeholder="Número da NFe"
              className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-shadow"
            />
          </div>

          {/* Contador */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Contador / Lote (Opcional)
            </label>
            <input
              type="text"
              value={contador}
              onChange={(e) => setContador(e.target.value)}
              placeholder="Referência extra"
              className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-shadow"
            />
          </div>
        </div>

        {/* Observações */}
        <div>
          <label className="text-sm font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
            <FileText size={16} className="text-slate-500" />
            Observações Gerais
          </label>
          <textarea
            value={observacoes}
            onChange={(e) => setObservacoes(e.target.value)}
            placeholder="Algum detalhe importante sobre essa entrada? (Opcional)"
            rows={3}
            className="w-full bg-white border border-slate-200 rounded-lg px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-shadow resize-none"
          />
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200/60 rounded-lg p-4 flex items-start gap-3 mt-2">
          <CheckCircle className="text-blue-600 shrink-0 mt-0.5" size={18} />
          <div>
            <p className="font-semibold text-blue-800 text-sm">Atualização Automática</p>
            <p className="text-xs text-blue-700/80 mt-1 leading-relaxed">
              Ao confirmar a entrada, o estoque do produto será somado automaticamente e a ação será gravada no histórico com seu usuário.
            </p>
          </div>
        </div>

        {/* Botões */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-100">
          <button 
            type="submit"
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 text-sm shadow-sm"
          >
            <Save size={18} />
            Confirmar Entrada
          </button>

          <button
            type="button"
            onClick={() => router.push("/produtos")}
            className="bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900 px-6 py-2.5 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 text-sm shadow-sm"
          >
            <ArrowLeft size={18} />
            Cancelar e Voltar
          </button>
        </div>
      </form>
    </div>
  );
}