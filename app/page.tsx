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
      (u) =>
        u.email?.toLowerCase() ===
        email.toLowerCase()
    );

    return usuario?.nome || email;
  }

  const totalProdutos = produtos.length;

  const totalEstoque = produtos.reduce(
    (total, produto) =>
      total + Number(produto.quantidade || 0),
    0
  );

  const produtosBaixoEstoque = produtos.filter(
    (produto) => Number(produto.quantidade || 0) <= 5
  );

  const estoqueBaixo = produtosBaixoEstoque.length;

  const movimentacoesRecentes = [
    ...entradas.map((entrada) => ({
      tipo: "Entrada",
      produto: entrada.produtos?.nome || "-",
      quantidade: entrada.quantidade,
      cliente: "-",
      local: entrada.origem || "-",
      observacoes: entrada.observacoes || "-",
      usuario: buscarNomeUsuario(entrada.usuario_email),
      data: entrada.created_at,
    })),

    ...saidas.map((saida) => ({
      tipo: "Saída",
      produto: saida.produtos?.nome || "-",
      quantidade: saida.quantidade,
      cliente: saida.cliente || "-",
      local: saida.local || saida.destino || "-",
      observacoes: saida.observacoes || "-",
      usuario: buscarNomeUsuario(saida.usuario_email),
      data: saida.created_at,
    })),
  ]
    .sort(
      (a, b) =>
        new Date(b.data).getTime() -
        new Date(a.data).getTime()
    )
    .slice(0, 5);

  const ultimosProdutos = produtos.slice(0, 5);

  const cards = [
    {
      titulo: "Produtos",
      subtitulo: "Cadastrados",
      valor: totalProdutos,
      icon: Package,
      cor: "bg-blue-600",
      fundo: "bg-blue-50",
      texto: "text-blue-700",
    },
    {
      titulo: "Itens em estoque",
      subtitulo: "Quantidade total",
      valor: totalEstoque,
      icon: Archive,
      cor: "bg-violet-600",
      fundo: "bg-violet-50",
      texto: "text-violet-700",
    },
    {
      titulo: "Entradas",
      subtitulo: "Movimentações",
      valor: entradas.length,
      icon: ArrowDownCircle,
      cor: "bg-emerald-600",
      fundo: "bg-emerald-50",
      texto: "text-emerald-700",
    },
    {
      titulo: "Saídas",
      subtitulo: "Movimentações",
      valor: saidas.length,
      icon: ArrowUpCircle,
      cor: "bg-rose-600",
      fundo: "bg-rose-50",
      texto: "text-rose-700",
    },
    {
      titulo: "Estoque baixo",
      subtitulo: "Atenção necessária",
      valor: estoqueBaixo,
      icon: AlertTriangle,
      cor: "bg-orange-500",
      fundo: "bg-orange-50",
      texto: "text-orange-700",
    },
  ];

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="bg-white border border-gray-200 rounded-3xl px-6 py-4 shadow-sm text-gray-500">
          Carregando informações do estoque...
        </div>
      </div>
    );
  }

  return (
    <div className="text-gray-900 w-full overflow-x-hidden">

      <div className="mb-8 pt-14 md:pt-0">
        <div className="bg-gradient-to-br from-slate-950 via-blue-950 to-blue-700 rounded-[2rem] p-6 md:p-8 text-white shadow-sm overflow-hidden relative">

          <div className="absolute right-0 top-0 w-72 h-72 bg-white/10 rounded-full blur-3xl translate-x-24 -translate-y-24" />

          <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-3xl bg-white flex items-center justify-center shadow-sm overflow-hidden shrink-0">
                <Image
                  src="/logo.png"
                  alt="Logo"
                  width={70}
                  height={70}
                  className="object-contain"
                  priority
                />
              </div>

              <div>
                <p className="text-blue-100 text-sm font-medium mb-1">
                  Bem-vindo ao sistema
                </p>

                <h1 className="text-3xl md:text-5xl font-bold">
                  Controle de Estoque
                </h1>

                <p className="text-blue-100 mt-2 max-w-2xl">
                  Acompanhe produtos, entradas, saídas e alertas importantes em tempo real.
                </p>
              </div>
            </div>

            <div className="bg-white/10 border border-white/20 rounded-3xl p-4 min-w-[220px]">
              <p className="text-sm text-blue-100">
                Resumo atual
              </p>

              <p className="text-3xl font-bold mt-1">
                {totalEstoque} itens
              </p>

              <p className="text-sm text-blue-100 mt-1">
                distribuídos em {totalProdutos} produto(s)
              </p>
            </div>

          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4 md:gap-5">
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.titulo}
              className="bg-white border border-gray-200 rounded-[1.7rem] p-5 shadow-sm hover:shadow-md hover:-translate-y-1 transition"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm text-gray-500">
                    {card.titulo}
                  </p>

                  <h2 className="text-4xl font-bold mt-2">
                    {card.valor}
                  </h2>

                  <p className="text-xs text-gray-400 mt-2">
                    {card.subtitulo}
                  </p>
                </div>

                <div className={`w-12 h-12 rounded-2xl ${card.fundo} ${card.texto} flex items-center justify-center`}>
                  <Icon size={24} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-8">

        <div className="bg-white border border-gray-200 rounded-[2rem] p-4 md:p-6 shadow-sm">
          <div className="flex items-center justify-between gap-3 mb-6">
            <div>
              <h2 className="text-xl md:text-2xl font-bold">
                Movimentações recentes
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Últimas atividades registradas no estoque
              </p>
            </div>

            <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Clock size={21} />
            </div>
          </div>

          {movimentacoesRecentes.length === 0 ? (
            <div className="border border-dashed border-gray-200 rounded-3xl p-6 text-center text-gray-500">
              Nenhuma movimentação registrada ainda.
            </div>
          ) : (
            <div className="space-y-3">
              {movimentacoesRecentes.map((mov, index) => {
                const entrada = mov.tipo === "Entrada";

                return (
                  <div
                    key={index}
                    className="border border-gray-100 rounded-3xl p-4 hover:bg-gray-50 transition"
                  >
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">

                      <div className="flex gap-3">
                        <div
                          className={
                            entrada
                              ? "w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0"
                              : "w-11 h-11 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0"
                          }
                        >
                          {entrada ? (
                            <ArrowDownCircle size={21} />
                          ) : (
                            <ArrowUpCircle size={21} />
                          )}
                        </div>

                        <div>
                          <span
                            className={
                              entrada
                                ? "bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-xs font-semibold"
                                : "bg-rose-50 text-rose-700 px-3 py-1 rounded-full text-xs font-semibold"
                            }
                          >
                            {mov.tipo}
                          </span>

                          <h3 className="font-bold mt-2">
                            {mov.produto}
                          </h3>

                          <p className="text-sm text-gray-500 mt-1 flex items-center gap-1 flex-wrap">
                            <MapPin size={15} />

                            {entrada
                              ? `Origem: ${mov.local}`
                              : `Cliente: ${mov.cliente} • Local: ${mov.local}`}
                          </p>

                          <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                            <User size={15} />
                            Realizado por: {mov.usuario}
                          </p>

                          {mov.observacoes !== "-" && (
                            <p className="text-sm text-gray-500 mt-1 flex items-start gap-1">
                              <FileText size={15} className="mt-0.5 shrink-0" />
                              {mov.observacoes}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="md:text-right">
                        <p
                          className={
                            entrada
                              ? "font-bold text-emerald-600"
                              : "font-bold text-rose-600"
                          }
                        >
                          {entrada ? "+" : "-"}
                          {mov.quantidade} un.
                        </p>

                        <p className="text-sm text-gray-400 mt-1">
                          {formatarDataHora(mov.data)}
                        </p>
                      </div>

                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="bg-white border border-gray-200 rounded-[2rem] p-4 md:p-6 shadow-sm">
          <div className="flex items-center justify-between gap-3 mb-6">
            <div>
              <h2 className="text-xl md:text-2xl font-bold">
                Atenção no estoque
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Produtos com 5 unidades ou menos
              </p>
            </div>

            <div className="w-11 h-11 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center">
              <AlertTriangle size={21} />
            </div>
          </div>

          {produtosBaixoEstoque.length === 0 ? (
            <div className="bg-emerald-50 border border-emerald-100 rounded-3xl p-6">
              <p className="font-bold text-emerald-700">
                Tudo certo por aqui!
              </p>

              <p className="text-sm text-emerald-700/80 mt-1">
                Nenhum produto está com estoque baixo no momento.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {produtosBaixoEstoque.map((produto) => (
                <div
                  key={produto.id}
                  className="flex items-center justify-between bg-orange-50 border border-orange-100 rounded-3xl p-4 gap-4"
                >
                  <div>
                    <h3 className="font-bold text-gray-900">
                      {produto.nome}
                    </h3>

                    <p className="text-sm text-gray-500 mt-1">
                      Tipo: {produto.tipo || "-"}
                    </p>
                  </div>

                  <div className="text-orange-700 font-bold text-lg whitespace-nowrap">
                    {produto.quantidade} un.
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      <div className="mt-8 bg-white border border-gray-200 rounded-[2rem] p-4 md:p-6 shadow-sm">

        <div className="flex items-center justify-between gap-3 mb-6">
          <div>
            <h2 className="text-xl md:text-2xl font-bold">
              Últimos produtos
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Produtos cadastrados recentemente
            </p>
          </div>

          <div className="w-11 h-11 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center">
            <Package size={21} />
          </div>
        </div>

        <div className="xl:hidden space-y-3">
          {ultimosProdutos.map((produto) => {
            const baixo = Number(produto.quantidade) <= 5;

            return (
              <div
                key={produto.id}
                className="border border-gray-100 rounded-3xl p-4"
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <h3 className="font-bold">
                      {produto.nome}
                    </h3>

                    <p className="text-sm text-gray-500 mt-1">
                      {produto.categoria || "Sem categoria"}
                    </p>
                  </div>

                  {baixo ? (
                    <span className="bg-orange-50 text-orange-700 px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap">
                      Baixo
                    </span>
                  ) : (
                    <span className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap">
                      Normal
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-gray-500">
                      Tipo
                    </p>

                    <p className="font-medium">
                      {produto.tipo || "-"}
                    </p>
                  </div>

                  <div>
                    <p className="text-gray-500">
                      Quantidade
                    </p>

                    <p
                      className={
                        baixo
                          ? "font-bold text-orange-700"
                          : "font-bold text-gray-900"
                      }
                    >
                      {produto.quantidade} un.
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="hidden xl:block overflow-x-auto">
          <table className="w-full min-w-[650px]">
            <thead>
              <tr className="text-left bg-gray-50">
                <th className="p-4 text-sm text-gray-600 font-semibold rounded-l-2xl">
                  Nome
                </th>

                <th className="p-4 text-sm text-gray-600 font-semibold">
                  Tipo
                </th>

                <th className="p-4 text-sm text-gray-600 font-semibold">
                  Quantidade
                </th>

                <th className="p-4 text-sm text-gray-600 font-semibold rounded-r-2xl">
                  Categoria
                </th>
              </tr>
            </thead>

            <tbody>
              {ultimosProdutos.map((produto) => {
                const baixo = Number(produto.quantidade) <= 5;

                return (
                  <tr
                    key={produto.id}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="p-4 font-medium">
                      {produto.nome}
                    </td>

                    <td className="p-4 text-gray-600">
                      {produto.tipo || "-"}
                    </td>

                    <td
                      className={
                        baixo
                          ? "p-4 font-semibold text-orange-700"
                          : "p-4 text-gray-600"
                      }
                    >
                      {produto.quantidade}
                    </td>

                    <td className="p-4 text-gray-600">
                      {produto.categoria || "-"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
}