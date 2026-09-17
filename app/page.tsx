"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

import {
  Package,
  Archive,
  ArrowDownCircle,
  ArrowUpCircle,
  AlertTriangle,
  Clock,
  User,
  MapPin,
  FileText,
  Building,
  ArrowRight,
  CalendarDays,
  PlusCircle,
  MinusCircle,
} from "lucide-react";

export default function Home() {
  const [produtos, setProdutos] = useState<any[]>([]);
  const [entradas, setEntradas] = useState<any[]>([]);
  const [saidas, setSaidas] = useState<any[]>([]);
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    buscarDados();
  }, []);

  async function buscarDados() {
    setLoading(true);

    const { data: produtosData } = await supabase
      .from("produtos")
      .select("*")
      .order("quantidade", { ascending: true }); // Ordena os menores estoques primeiro

    const { data: entradasData } = await supabase
      .from("entradas")
      .select(`*, produtos (nome)`)
      .order("created_at", { ascending: false });

    const { data: saidasData } = await supabase
      .from("saidas")
      .select(`*, produtos (nome)`)
      .order("created_at", { ascending: false });

    const { data: usuariosData } = await supabase
      .from("usuarios_autorizados")
      .select("nome, email");

    setProdutos(produtosData || []);
    setEntradas(entradasData || []);
    setSaidas(saidasData || []);
    setUsuarios(usuariosData || []);
    setLoading(false);
  }

  function formatarDataHora(data: string) {
    const dataCorrigida = new Date(data);
    dataCorrigida.setHours(dataCorrigida.getHours() - 3);

    return dataCorrigida.toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function buscarNomeUsuario(email: string) {
    if (!email) return "-";
    const usuario = usuarios.find(
      (u) => u.email?.toLowerCase() === email.toLowerCase()
    );
    return usuario?.nome || email;
  }

  function estoqueEstaBaixo(produto: any) {
    return Number(produto.quantidade || 0) <= Number(produto.estoque_minimo || 5);
  }

  // Cálculos de Métricas
  const totalProdutos = produtos.length;
  const totalEstoque = produtos.reduce((total, p) => total + Number(p.quantidade || 0), 0);
  const produtosBaixoEstoque = produtos.filter(estoqueEstaBaixo);
  const estoqueBaixo = produtosBaixoEstoque.length;

  // Filtra as entradas e saídas apenas do MÊS ATUAL para métricas reais
  const dataAtual = new Date();
  const mesAtual = dataAtual.getMonth();
  const anoAtual = dataAtual.getFullYear();

  const entradasMes = entradas.filter((e) => {
    const d = new Date(e.created_at);
    return d.getMonth() === mesAtual && d.getFullYear() === anoAtual;
  }).length;

  const saidasMes = saidas.filter((s) => {
    const d = new Date(s.created_at);
    return d.getMonth() === mesAtual && d.getFullYear() === anoAtual;
  }).length;

  // Unifica e ordena as últimas 5 movimentações no geral
  const movimentacoesRecentes = [
    ...entradas.map((e) => ({
      tipo: "Entrada",
      produto: e.produtos?.nome || "-",
      quantidade: e.quantidade,
      local: e.origem || "-",
      observacoes: e.observacoes || "-",
      usuario: buscarNomeUsuario(e.usuario_email),
      data: e.created_at,
    })),
    ...saidas.map((s) => ({
      tipo: "Saída",
      produto: s.produtos?.nome || "-",
      quantidade: s.quantidade,
      local: s.local || s.destino || "-",
      observacoes: s.observacoes || "-",
      usuario: buscarNomeUsuario(s.usuario_email),
      data: s.created_at,
    })),
  ]
    .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())
    .slice(0, 5);

  const ultimosProdutos = produtos.slice(0, 5);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-slate-500 dark:text-slate-400">
          <div className="w-8 h-8 border-4 border-slate-200 dark:border-slate-700 border-t-blue-600 dark:border-t-blue-500 rounded-full animate-spin" />
          <p className="font-medium">Carregando painel de controle...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="text-slate-800 dark:text-slate-200 w-full overflow-x-hidden space-y-6">
      
      {/* Hero Section - Dashboard Ativo */}
      <section className="pt-14 md:pt-0">
        <div className="relative overflow-hidden rounded-2xl bg-slate-900 text-white shadow-md">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
          
          <div className="relative p-6 md:p-10 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-8">
            <div className="flex flex-col md:flex-row md:items-center gap-6">
              <div className="w-20 h-20 rounded-xl bg-white shadow-sm flex items-center justify-center p-2 shrink-0">
                <Image
                  src="/logo.png"
                  alt="Logo Copystar"
                  width={70}
                  height={70}
                  className="object-contain"
                  priority
                />
              </div>

              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-800 border border-slate-700 rounded-md text-xs font-semibold tracking-wide text-slate-300 uppercase mb-3">
                  <Building size={14} />
                  Painel de Comando
                </div>
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                  Estoque Copystar
                </h1>
                <p className="text-slate-400 mt-2 text-sm md:text-base max-w-2xl">
                  Acompanhe os alertas de reposição e realize ações rápidas no inventário.
                </p>
              </div>
            </div>

            {/* Ações Rápidas direto no Header */}
            <div className="flex flex-col sm:flex-row gap-3 min-w-[280px]">
              <Link
                href="/entradas"
                className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-3 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2 shadow-sm text-sm"
              >
                <PlusCircle size={18} />
                Nova Entrada
              </Link>
              <Link
                href="/saidas"
                className="flex-1 bg-rose-600 hover:bg-rose-500 text-white px-5 py-3 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2 shadow-sm text-sm"
              >
                <MinusCircle size={18} />
                Registrar Saída
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Métricas Inteligentes (Foco no Presente) */}
      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow duration-200">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Catálogo Ativo</p>
              <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mt-1">{totalProdutos}</h2>
              <p className="text-xs text-slate-400 mt-1">itens registrados</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center shrink-0">
              <Package size={20} />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow duration-200">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Volume Físico</p>
              <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mt-1">{totalEstoque}</h2>
              <p className="text-xs text-slate-400 mt-1">unidades disponíveis</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
              <Archive size={20} />
            </div>
          </div>
        </div>

        {/* Alerta de Estoque em Destaque */}
        <div className={`border rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow duration-200 ${estoqueBaixo > 0 ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800/50' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'}`}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className={`text-sm font-medium ${estoqueBaixo > 0 ? 'text-amber-700 dark:text-amber-400' : 'text-slate-500 dark:text-slate-400'}`}>Atenção Necessária</p>
              <h2 className={`text-3xl font-bold mt-1 ${estoqueBaixo > 0 ? 'text-amber-600 dark:text-amber-500' : 'text-slate-800 dark:text-slate-100'}`}>{estoqueBaixo}</h2>
              <p className={`text-xs mt-1 ${estoqueBaixo > 0 ? 'text-amber-600/80 dark:text-amber-500/80' : 'text-slate-400'}`}>itens abaixo do mínimo</p>
            </div>
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${estoqueBaixo > 0 ? 'bg-amber-100 dark:bg-amber-900/50 text-amber-600' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
              <AlertTriangle size={20} />
            </div>
          </div>
        </div>

        {/* Métricas do Mês Atual */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow duration-200">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Entradas no Mês</p>
              <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mt-1">{entradasMes}</h2>
              <p className="text-xs text-slate-400 mt-1">registros em {dataAtual.toLocaleString('pt-BR', { month: 'short' })}.</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <CalendarDays size={20} />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow duration-200">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Saídas no Mês</p>
              <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mt-1">{saidasMes}</h2>
              <p className="text-xs text-slate-400 mt-1">registros em {dataAtual.toLocaleString('pt-BR', { month: 'short' })}.</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
              <CalendarDays size={20} />
            </div>
          </div>
        </div>
      </section>

      {/* Alertas e Movimentações Lado a Lado */}
      <section className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        
        {/* Alertas de Estoque */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm flex flex-col">
          <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                Itens Críticos
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Produtos que exigem reposição imediata
              </p>
            </div>
            <Link href="/produtos" className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 flex items-center gap-1 transition-colors">
              Ver estoque <ArrowRight size={16} />
            </Link>
          </div>

          <div className="p-5 flex-1 bg-slate-50/50 dark:bg-slate-950/50 rounded-b-xl">
            {produtosBaixoEstoque.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-emerald-600 dark:text-emerald-500 py-8">
                <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mb-3">
                  <Archive size={20} />
                </div>
                <p className="font-semibold">Tudo abastecido!</p>
                <p className="text-sm text-emerald-600/70 dark:text-emerald-500/70 mt-1">Nenhum produto abaixo do estoque mínimo.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {produtosBaixoEstoque.slice(0, 5).map((produto) => (
                  <div
                    key={produto.id}
                    className="flex items-center justify-between bg-white dark:bg-slate-900 border border-amber-200/60 dark:border-amber-800/50 rounded-lg p-4 shadow-sm"
                  >
                    <div>
                      <h3 className="font-semibold text-slate-800 dark:text-slate-200">
                        {produto.nome}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        Estoque ideal: acima de {produto.estoque_minimo || 5} un.
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded-md font-bold text-sm">
                        {produto.quantidade} un.
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Movimentações Recentes */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm flex flex-col">
          <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                Últimas Atividades
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Registro recente de fluxo do inventário
              </p>
            </div>
            <Link href="/historico" className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 flex items-center gap-1 transition-colors">
              Ver histórico <ArrowRight size={16} />
            </Link>
          </div>

          <div className="p-5 flex-1">
            {movimentacoesRecentes.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 py-8">
                <Clock size={40} className="mb-3 opacity-20" />
                <p className="text-sm">Nenhuma movimentação registrada.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {movimentacoesRecentes.map((mov, index) => {
                  const entrada = mov.tipo === "Entrada";

                  return (
                    <div
                      key={index}
                      className="group flex items-start justify-between gap-3 p-3 -mx-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                    >
                      <div className="flex gap-3">
                        <div
                          className={`mt-0.5 w-8 h-8 rounded-md flex items-center justify-center shrink-0 ${
                            entrada
                              ? "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400"
                              : "bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400"
                          }`}
                        >
                          {entrada ? <ArrowDownCircle size={18} /> : <ArrowUpCircle size={18} />}
                        </div>

                        <div>
                          <h3 className="font-semibold text-slate-700 dark:text-slate-200">
                            {mov.produto}
                          </h3>
                          <div className="mt-1 flex flex-col gap-0.5">
                            <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                              <MapPin size={12} className="text-slate-400" />
                              {mov.local}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                              <User size={12} className="text-slate-400" />
                              {mov.usuario}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <p
                          className={`font-bold ${
                            entrada ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
                          }`}
                        >
                          {entrada ? "+" : "-"}{mov.quantidade} un.
                        </p>
                        <p className="text-[11px] text-slate-400 mt-1 font-medium">
                          {formatarDataHora(mov.data)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Tabela de Produtos (Resumo) */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden flex flex-col">
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">
              Visão Geral do Catálogo
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Resumo dos produtos registrados (ordenados por menor estoque)
            </p>
          </div>
          <div className="w-8 h-8 rounded-md bg-slate-50 dark:bg-slate-800 text-slate-400 flex items-center justify-center border border-slate-100 dark:border-slate-700">
            <Package size={16} />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 font-medium border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="px-6 py-4">Nome do Produto</th>
                <th className="px-6 py-4">Categoria</th>
                <th className="px-6 py-4">Em Estoque</th>
                <th className="px-6 py-4">Estoque Mínimo</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {ultimosProdutos.map((produto) => {
                const baixo = estoqueEstaBaixo(produto);

                return (
                  <tr
                    key={produto.id}
                    className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <td className="px-6 py-4 font-medium text-slate-800 dark:text-slate-200">
                      {produto.nome}
                    </td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-400">
                      {produto.tipo || "-"}
                    </td>
                    <td
                      className={`px-6 py-4 font-bold ${
                        baixo ? "text-amber-600 dark:text-amber-500" : "text-slate-700 dark:text-slate-300"
                      }`}
                    >
                      {produto.quantidade} un.
                    </td>
                    <td className="px-6 py-4 text-slate-500 dark:text-slate-400">
                      {produto.estoque_minimo || 5} un.
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold ${
                          baixo
                            ? "bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/50"
                            : "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50"
                        }`}
                      >
                        {baixo ? "Abaixo do Mínimo" : "Normal"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

    </div>
  );
}