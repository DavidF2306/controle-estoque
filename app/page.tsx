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
  Sparkles,
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
        new Date(b.data).getTime() - new Date(a.data).getTime()
    )
    .slice(0, 5);

  const ultimosProdutos = produtos.slice(0, 5);

  const cards = [
    {
      titulo: "Produtos",
      valor: totalProdutos,
      detalhe: "produtos cadastrados",
      icon: Package,
      cor: "from-blue-500 to-blue-700",
      fundo: "bg-blue-50",
      texto: "text-blue-700",
    },
    {
      titulo: "Estoque total",
      valor: totalEstoque,
      detalhe: "unidades disponíveis",
      icon: Archive,
      cor: "from-indigo-500 to-violet-700",
      fundo: "bg-violet-50",
      texto: "text-violet-700",
    },
    {
      titulo: "Entradas",
      valor: entradas.length,
      detalhe: "registros de entrada",
      icon: ArrowDownCircle,
      cor: "from-emerald-500 to-green-700",
      fundo: "bg-emerald-50",
      texto: "text-emerald-700",
    },
    {
      titulo: "Saídas",
      valor: saidas.length,
      detalhe: "registros de saída",
      icon: ArrowUpCircle,
      cor: "from-rose-500 to-red-700",
      fundo: "bg-rose-50",
      texto: "text-rose-700",
    },
    {
      titulo: "Estoque baixo",
      valor: estoqueBaixo,
      detalhe: "abaixo do mínimo",
      icon: AlertTriangle,
      cor: "from-orange-400 to-orange-600",
      fundo: "bg-orange-50",
      texto: "text-orange-700",
    },
  ];

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="bg-white border border-gray-200 rounded-3xl px-6 py-4 shadow-sm text-gray-500">
          Carregando Estoque Copystar...
        </div>
      </div>
    );
  }

  return (
    <div className="text-gray-900 w-full overflow-x-hidden space-y-8">
      <section className="pt-14 md:pt-0">
        <div className="relative overflow-hidden rounded-[2.2rem] bg-gradient-to-br from-sky-400 via-blue-600 to-indigo-800 text-white shadow-lg">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute -top-24 -right-20 w-80 h-80 bg-white rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-72 h-72 bg-cyan-300 rounded-full blur-3xl" />
          </div>

          <div className="relative p-6 md:p-10">
            <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-8">
              <div className="flex flex-col md:flex-row md:items-center gap-5">
                <div className="w-24 h-24 rounded-[2rem] bg-white shadow-md flex items-center justify-center overflow-hidden shrink-0">
                  <Image
                    src="/logo.png"
                    alt="Logo Copystar"
                    width={86}
                    height={86}
                    className="object-contain"
                    priority
                  />
                </div>

                <div>
                  <div className="inline-flex items-center gap-2 bg-white/15 border border-white/20 rounded-full px-4 py-2 text-sm font-medium mb-4">
                    <Sparkles size={16} />
                    Sistema interno de controle
                  </div>

                  <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
                    Estoque Copystar
                  </h1>

                  <p className="text-blue-50 mt-3 text-base md:text-lg max-w-2xl">
                    Controle produtos, entradas, saídas, locais e alertas do estoque em uma única tela.
                  </p>
                </div>
              </div>

              <div className="bg-white/15 border border-white/20 backdrop-blur rounded-[2rem] p-5 min-w-[240px]">
                <p className="text-blue-50 text-sm">
                  Resumo de hoje
                </p>

                <p className="text-4xl font-extrabold mt-2">
                  {totalEstoque}
                </p>

                <p className="text-blue-50 text-sm mt-1">
                  unidades em estoque
                </p>

                <div className="mt-4 h-2 bg-white/20 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-white rounded-full"
                    style={{
                      width: estoqueBaixo > 0 ? "55%" : "100%",
                    }}
                  />
                </div>

                <p className="text-xs text-blue-50 mt-3">
                  {estoqueBaixo > 0
                    ? `${estoqueBaixo} produto(s) abaixo do estoque mínimo`
                    : "Nenhum produto em estoque baixo"}
                </p>
              </div>
            </div>
          </div>

          <div className="h-7 bg-white rounded-t-[100%] opacity-95" />
        </div>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4 md:gap-5">
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.titulo}
              className="group relative overflow-hidden bg-white border border-gray-200 rounded-[1.8rem] p-5 shadow-sm hover:shadow-lg hover:-translate-y-1 transition"
            >
              <div
                className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${card.cor}`}
              />

              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm text-gray-500">
                    {card.titulo}
                  </p>

                  <h2 className="text-4xl font-extrabold mt-2">
                    {card.valor}
                  </h2>

                  <p className="text-xs text-gray-400 mt-2">
                    {card.detalhe}
                  </p>
                </div>

                <div
                  className={`w-12 h-12 rounded-2xl ${card.fundo} ${card.texto} flex items-center justify-center group-hover:scale-110 transition`}
                >
                  <Icon size={24} />
                </div>
              </div>
            </div>
          );
        })}
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-[2rem] p-4 md:p-6 shadow-sm">
          <div className="flex items-center justify-between gap-3 mb-6">
            <div>
              <h2 className="text-xl md:text-2xl font-extrabold">
                Movimentações recentes
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Últimas ações registradas no Estoque Copystar
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
                              ? "font-extrabold text-emerald-600"
                              : "font-extrabold text-rose-600"
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
              <h2 className="text-xl md:text-2xl font-extrabold">
                Atenção no estoque
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Produtos abaixo do estoque mínimo definido
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
                Nenhum produto está abaixo do estoque mínimo no momento.
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
                      Mínimo: {produto.estoque_minimo || 5} un.
                    </p>
                  </div>

                  <div className="text-orange-700 font-extrabold text-lg whitespace-nowrap">
                    {produto.quantidade} un.
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="bg-white border border-gray-200 rounded-[2rem] p-4 md:p-6 shadow-sm">
        <div className="flex items-center justify-between gap-3 mb-6">
          <div>
            <h2 className="text-xl md:text-2xl font-extrabold">
              Últimos produtos
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Produtos cadastrados recentemente no sistema
            </p>
          </div>

          <div className="w-11 h-11 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center">
            <Package size={21} />
          </div>
        </div>

        <div className="xl:hidden space-y-3">
          {ultimosProdutos.map((produto) => {
            const baixo = estoqueEstaBaixo(produto);

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
                      Estoque mínimo: {produto.estoque_minimo || 5}
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
                    <p className="text-gray-500">Tipo</p>

                    <p className="font-medium">
                      {produto.tipo || "-"}
                    </p>
                  </div>

                  <div>
                    <p className="text-gray-500">Quantidade</p>

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

                <th className="p-4 text-sm text-gray-600 font-semibold">
                  Estoque mínimo
                </th>

                <th className="p-4 text-sm text-gray-600 font-semibold rounded-r-2xl">
                  Status
                </th>
              </tr>
            </thead>

            <tbody>
              {ultimosProdutos.map((produto) => {
                const baixo = estoqueEstaBaixo(produto);

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
                      {produto.quantidade} un.
                    </td>

                    <td className="p-4 text-gray-600">
                      {produto.estoque_minimo || 5} un.
                    </td>

                    <td className="p-4">
                      {baixo ? (
                        <span className="bg-orange-50 text-orange-700 px-3 py-1 rounded-full text-sm font-bold">
                          Baixo
                        </span>
                      ) : (
                        <span className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-sm font-bold">
                          Normal
                        </span>
                      )}
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