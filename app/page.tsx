"use client";

import Image from "next/image";
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
  TrendingDown,
  TrendingUp,
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
      .order("id", { ascending: false });

    const { data: entradasData } = await supabase
      .from("entradas")
      .select(`
        *,
        produtos (
          nome
        )
      `)
      .order("created_at", { ascending: false });

    const { data: saidasData } = await supabase
      .from("saidas")
      .select(`
        *,
        produtos (
          nome
        )
      `)
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
      year: "numeric",
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
    return (
      Number(produto.quantidade || 0) <=
      Number(produto.estoque_minimo || 5)
    );
  }

  const totalProdutos = produtos.length;

  const totalEstoque = produtos.reduce(
    (total, produto) => total + Number(produto.quantidade || 0),
    0
  );

  const produtosBaixoEstoque = produtos.filter((produto) =>
    estoqueEstaBaixo(produto)
  );

  const estoqueBaixo = produtosBaixoEstoque.length;

  const movimentacoesRecentes = [
    ...entradas.map((entrada) => ({
      tipo: "Entrada",
      produto: entrada.produtos?.nome || "-",
      quantidade: entrada.quantidade,
      local: entrada.origem || "-",
      observacoes: entrada.observacoes || "-",
      usuario: buscarNomeUsuario(entrada.usuario_email),
      data: entrada.created_at,
    })),

    ...saidas.map((saida) => ({
      tipo: "Saída",
      produto: saida.produtos?.nome || "-",
      quantidade: saida.quantidade,
      local: saida.local || saida.destino || "-",
      observacoes: saida.observacoes || "-",
      usuario: buscarNomeUsuario(saida.usuario_email),
      data: saida.created_at,
    })),
  ]
    .sort(
      (a, b) =>
        new Date(b.data).getTime() - new Date(a.data).getTime()
    )
    .slice(0, 5);

  const ultimosProdutos = produtos.slice(0, 5);

  const cards = [
    {
      titulo: "Produtos Cadastrados",
      valor: totalProdutos,
      detalhe: "Total de itens no sistema",
      icon: Package,
      corIcone: "text-slate-600",
      fundoIcone: "bg-slate-100",
    },
    {
      titulo: "Estoque Total",
      valor: totalEstoque,
      detalhe: "Unidades físicas disponíveis",
      icon: Archive,
      corIcone: "text-blue-600",
      fundoIcone: "bg-blue-50",
    },
    {
      titulo: "Entradas",
      valor: entradas.length,
      detalhe: "Registros realizados",
      icon: TrendingDown,
      corIcone: "text-emerald-600",
      fundoIcone: "bg-emerald-50",
    },
    {
      titulo: "Saídas",
      valor: saidas.length,
      detalhe: "Registros realizados",
      icon: TrendingUp,
      corIcone: "text-rose-600",
      fundoIcone: "bg-rose-50",
    },
    {
      titulo: "Alertas de Estoque",
      valor: estoqueBaixo,
      detalhe: "Itens abaixo do mínimo",
      icon: AlertTriangle,
      corIcone: "text-amber-600",
      fundoIcone: "bg-amber-50",
    },
  ];

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-slate-500">
          <div className="w-8 h-8 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin" />
          <p className="font-medium">Carregando painel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="text-slate-800 w-full overflow-x-hidden space-y-6">
      
      {/* Hero Section - Corporativo */}
      <section className="pt-14 md:pt-0">
        <div className="relative overflow-hidden rounded-2xl bg-slate-900 text-white shadow-md">
          {/* Elemento de fundo sutil */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
          
          <div className="relative p-6 md:p-10">
            <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-8">
              
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
                    Painel de Gestão
                  </div>

                  <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                    Estoque Copystar
                  </h1>

                  <p className="text-slate-400 mt-2 text-sm md:text-base max-w-2xl">
                    Visão geral e monitoramento de produtos, movimentações, locais e alertas operacionais.
                  </p>
                </div>
              </div>

              <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5 min-w-[260px]">
                <p className="text-slate-400 text-sm font-medium">
                  Status Operacional
                </p>

                <div className="mt-3 flex items-end gap-3">
                  <p className="text-3xl font-bold text-white">
                    {totalEstoque}
                  </p>
                  <p className="text-slate-400 text-sm mb-1">itens em estoque</p>
                </div>

                <div className="mt-4 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${estoqueBaixo > 0 ? 'bg-amber-500 w-1/2' : 'bg-emerald-500 w-full'}`}
                  />
                </div>

                <p className={`text-xs mt-3 font-medium ${estoqueBaixo > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                  {estoqueBaixo > 0
                    ? `Atenção: ${estoqueBaixo} produto(s) requerem reposição.`
                    : "Operação normal. Estoque abastecido."}
                </p>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Métricas / KPIs */}
      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.titulo}
              className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    {card.titulo}
                  </p>
                  <h2 className="text-3xl font-bold text-slate-800 mt-1">
                    {card.valor}
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    {card.detalhe}
                  </p>
                </div>

                <div
                  className={`w-10 h-10 rounded-lg ${card.fundoIcone} ${card.corIcone} flex items-center justify-center shrink-0`}
                >
                  <Icon size={20} />
                </div>
              </div>
            </div>
          );
        })}
      </section>

      {/* Seção Principal: Movimentações e Alertas */}
      <section className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        
        {/* Movimentações Recentes */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-800">
                Movimentações Recentes
              </h2>
              <p className="text-sm text-slate-500">
                Últimos registros inseridos no sistema
              </p>
            </div>
            <div className="w-8 h-8 rounded-md bg-slate-50 text-slate-400 flex items-center justify-center border border-slate-100">
              <Clock size={16} />
            </div>
          </div>

          <div className="p-5 flex-1">
            {movimentacoesRecentes.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 py-8">
                <Archive size={40} className="mb-3 opacity-20" />
                <p className="text-sm">Nenhuma movimentação registrada.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {movimentacoesRecentes.map((mov, index) => {
                  const entrada = mov.tipo === "Entrada";

                  return (
                    <div
                      key={index}
                      className="group flex flex-col md:flex-row md:items-start md:justify-between gap-3 p-3 -mx-3 rounded-lg hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex gap-3">
                        <div
                          className={`mt-0.5 w-8 h-8 rounded-md flex items-center justify-center shrink-0 ${
                            entrada
                              ? "bg-emerald-50 text-emerald-600"
                              : "bg-rose-50 text-rose-600"
                          }`}
                        >
                          {entrada ? (
                            <ArrowDownCircle size={18} />
                          ) : (
                            <ArrowUpCircle size={18} />
                          )}
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-slate-700">
                              {mov.produto}
                            </h3>
                            <span
                              className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-sm ${
                                entrada
                                  ? "bg-emerald-100 text-emerald-700"
                                  : "bg-rose-100 text-rose-700"
                              }`}
                            >
                              {mov.tipo}
                            </span>
                          </div>

                          <div className="mt-1 flex flex-col gap-1">
                            <p className="text-xs text-slate-500 flex items-center gap-1.5">
                              <MapPin size={13} className="text-slate-400" />
                              Local / Origem: {mov.local}
                            </p>
                            <p className="text-xs text-slate-500 flex items-center gap-1.5">
                              <User size={13} className="text-slate-400" />
                              Usuário: {mov.usuario}
                            </p>
                            {mov.observacoes !== "-" && (
                              <p className="text-xs text-slate-500 flex items-start gap-1.5">
                                <FileText size={13} className="mt-0.5 text-slate-400 shrink-0" />
                                {mov.observacoes}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="md:text-right pl-11 md:pl-0">
                        <p
                          className={`font-bold ${
                            entrada ? "text-emerald-600" : "text-rose-600"
                          }`}
                        >
                          {entrada ? "+" : "-"}
                          {mov.quantidade} un.
                        </p>
                        <p className="text-xs text-slate-400 mt-1 font-medium">
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

        {/* Alertas de Estoque */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-800">
                Atenção no Estoque
              </h2>
              <p className="text-sm text-slate-500">
                Itens abaixo da quantidade mínima
              </p>
            </div>
            <div className="w-8 h-8 rounded-md bg-amber-50 text-amber-500 flex items-center justify-center border border-amber-100">
              <AlertTriangle size={16} />
            </div>
          </div>

          <div className="p-5 flex-1 bg-slate-50/50 rounded-b-xl">
            {produtosBaixoEstoque.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-emerald-600 py-8">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mb-3">
                  <Archive size={20} />
                </div>
                <p className="font-semibold">Tudo sob controle!</p>
                <p className="text-sm text-emerald-600/70 mt-1">Nenhum alerta de estoque no momento.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {produtosBaixoEstoque.map((produto) => (
                  <div
                    key={produto.id}
                    className="flex items-center justify-between bg-white border border-amber-200/60 rounded-lg p-4 shadow-sm"
                  >
                    <div>
                      <h3 className="font-semibold text-slate-800">
                        {produto.nome}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1">
                        Estoque ideal: acima de {produto.estoque_minimo || 5} un.
                      </p>
                    </div>

                    <div className="text-right">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 text-amber-700 rounded-md font-bold text-sm">
                        {produto.quantidade} un.
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Tabela: Últimos Produtos */}
      <section className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-800">
              Últimos Produtos Cadastrados
            </h2>
            <p className="text-sm text-slate-500">
              Recentes adições ao catálogo do sistema
            </p>
          </div>
          <div className="w-8 h-8 rounded-md bg-slate-50 text-slate-400 flex items-center justify-center border border-slate-100">
            <Package size={16} />
          </div>
        </div>

        {/* Versão Mobile */}
        <div className="xl:hidden p-5 space-y-4">
          {ultimosProdutos.map((produto) => {
            const baixo = estoqueEstaBaixo(produto);

            return (
              <div
                key={produto.id}
                className="border border-slate-100 rounded-lg p-4 bg-slate-50/50"
              >
                <div className="flex items-start justify-between gap-3 mb-4">
                  <h3 className="font-semibold text-slate-800">
                    {produto.nome}
                  </h3>
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold whitespace-nowrap ${
                      baixo
                        ? "bg-amber-100 text-amber-700"
                        : "bg-emerald-100 text-emerald-700"
                    }`}
                  >
                    {baixo ? "Alerta" : "Normal"}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-slate-500 text-xs mb-1">Categoria</p>
                    <p className="font-medium text-slate-700">
                      {produto.tipo || "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-500 text-xs mb-1">Em Estoque</p>
                    <p
                      className={`font-semibold ${
                        baixo ? "text-amber-600" : "text-slate-700"
                      }`}
                    >
                      {produto.quantidade} un.
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Versão Desktop (Tabela) */}
        <div className="hidden xl:block overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Nome do Produto</th>
                <th className="px-6 py-4">Categoria/Tipo</th>
                <th className="px-6 py-4">Quantidade Atual</th>
                <th className="px-6 py-4">Estoque Mínimo</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {ultimosProdutos.map((produto) => {
                const baixo = estoqueEstaBaixo(produto);

                return (
                  <tr
                    key={produto.id}
                    className="hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="px-6 py-4 font-medium text-slate-800">
                      {produto.nome}
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {produto.tipo || "-"}
                    </td>
                    <td
                      className={`px-6 py-4 font-semibold ${
                        baixo ? "text-amber-600" : "text-slate-700"
                      }`}
                    >
                      {produto.quantidade} un.
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      {produto.estoque_minimo || 5} un.
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold ${
                          baixo
                            ? "bg-amber-50 text-amber-700 border border-amber-200"
                            : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        }`}
                      >
                        {baixo ? "Atenção" : "Normal"}
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