"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import BotaoPDFHistorico from "../components/BotaoPDFHistorico";
import {
  History,
  Search,
  Calendar,
  RotateCcw,
  ArrowDownCircle,
  ArrowUpCircle,
  User,
  MapPin,
  FileText,
  Clock,
  Package,
  Activity,
} from "lucide-react";

export default function Historico() {
  const [movimentacoes, setMovimentacoes] = useState<any[]>([]);
  const [mesFiltro, setMesFiltro] = useState("");
  const [busca, setBusca] = useState("");

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

  useEffect(() => {
    buscarMovimentacoes();
  }, []);

  async function buscarMovimentacoes() {
    const { data: usuarios } = await supabase
      .from("usuarios_autorizados")
      .select("nome, email");

    function buscarNomeUsuario(email: string) {
      if (!email) return "-";

      const usuario = usuarios?.find(
        (item) =>
          item.email?.toLowerCase() === email.toLowerCase()
      );

      return usuario?.nome || email;
    }

    const { data: entradas } = await supabase
      .from("entradas")
      .select(`
        *,
        produtos (
          nome
        )
      `);

    const { data: saidas } = await supabase
      .from("saidas")
      .select(`
        *,
        produtos (
          nome
        )
      `);

    const todasMovimentacoes = [
      ...(entradas || []).map((entrada) => ({
        tipo: "Entrada",
        produto: entrada.produtos?.nome || "-",
        quantidade: entrada.quantidade,
        cliente: "-",
        local: entrada.origem || "-",
        notaFiscal: entrada.nota_fiscal || "-",
        contador: entrada.contador || "-",
        observacoes: entrada.observacoes || "-",
        usuario: buscarNomeUsuario(entrada.usuario_email),
        data: entrada.created_at,
      })),

      ...(saidas || []).map((saida) => ({
        tipo: "Saída",
        produto: saida.produtos?.nome || "-",
        quantidade: saida.quantidade,
        cliente: saida.cliente || "-",
        local: saida.local || saida.destino || "-",
        notaFiscal: "-",
        contador: saida.contador || "-",
        observacoes: saida.observacoes || "-",
        usuario: buscarNomeUsuario(saida.usuario_email),
        data: saida.created_at,
      })),
    ];

    todasMovimentacoes.sort(
      (a, b) =>
        new Date(b.data).getTime() -
        new Date(a.data).getTime()
    );

    setMovimentacoes(todasMovimentacoes);
  }

  const movimentacoesFiltradas = movimentacoes.filter((mov) => {
    const filtroMes =
      mesFiltro === "" ||
      mov.data.slice(0, 7) === mesFiltro;

    const textoBusca = `
      ${mov.tipo}
      ${mov.produto}
      ${mov.cliente}
      ${mov.local}
      ${mov.notaFiscal}
      ${mov.contador}
      ${mov.observacoes}
      ${mov.usuario}
    `.toLowerCase();

    const filtroBusca =
      busca === "" ||
      textoBusca.includes(busca.toLowerCase());

    return filtroMes && filtroBusca;
  });

  const totalEntradas = movimentacoesFiltradas.filter(
    (mov) => mov.tipo === "Entrada"
  ).length;

  const totalSaidas = movimentacoesFiltradas.filter(
    (mov) => mov.tipo === "Saída"
  ).length;

  const totalItensMovimentados = movimentacoesFiltradas.reduce(
    (total, mov) => total + Number(mov.quantidade || 0),
    0
  );

  const usuariosUnicos = [
    ...new Set(
      movimentacoesFiltradas
        .map((mov) => mov.usuario)
        .filter(Boolean)
    ),
  ];

  return (
    <div className="text-gray-900 w-full overflow-x-hidden space-y-8">

      <section className="pt-14 md:pt-0">
        <div className="relative overflow-hidden rounded-[2.2rem] bg-gradient-to-br from-indigo-600 via-blue-700 to-purple-800 text-white shadow-lg">
          <div className="absolute -top-24 -right-20 w-80 h-80 bg-white/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-cyan-300/20 rounded-full blur-3xl" />

          <div className="relative p-6 md:p-10 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-8">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-[2rem] bg-white/20 border border-white/30 flex items-center justify-center">
                <History size={40} />
              </div>

              <div>
                <p className="text-blue-50 text-sm font-medium mb-1">
                  Estoque Copystar
                </p>

                <h1 className="text-4xl md:text-6xl font-extrabold">
                  Histórico
                </h1>

                <p className="text-blue-50 mt-2 max-w-2xl">
                  Acompanhe todas as entradas, saídas, usuários e movimentações do estoque.
                </p>
              </div>
            </div>

            <div className="bg-white/15 border border-white/20 backdrop-blur rounded-[2rem] p-5 min-w-[240px]">
              <p className="text-blue-50 text-sm">
                Movimentações encontradas
              </p>

              <p className="text-4xl font-extrabold mt-2">
                {movimentacoesFiltradas.length}
              </p>

              <p className="text-blue-50 text-sm mt-1">
                registros no histórico
              </p>

              <div className="mt-4">
                <BotaoPDFHistorico
                  movimentacoes={movimentacoesFiltradas}
                  mesFiltro={mesFiltro}
                />
              </div>
            </div>
          </div>

          <div className="h-7 bg-white rounded-t-[100%] opacity-95" />
        </div>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-[1.8rem] p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Entradas</p>
              <h2 className="text-4xl font-extrabold mt-2">{totalEntradas}</h2>
              <p className="text-xs text-gray-400 mt-2">registros filtrados</p>
            </div>

            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <ArrowDownCircle size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-[1.8rem] p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Saídas</p>
              <h2 className="text-4xl font-extrabold mt-2">{totalSaidas}</h2>
              <p className="text-xs text-gray-400 mt-2">registros filtrados</p>
            </div>

            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-700 flex items-center justify-center">
              <ArrowUpCircle size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-[1.8rem] p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Itens</p>
              <h2 className="text-4xl font-extrabold mt-2">{totalItensMovimentados}</h2>
              <p className="text-xs text-gray-400 mt-2">unidades movimentadas</p>
            </div>

            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center">
              <Package size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-[1.8rem] p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Usuários</p>
              <h2 className="text-4xl font-extrabold mt-2">{usuariosUnicos.length}</h2>
              <p className="text-xs text-gray-400 mt-2">com movimentações</p>
            </div>

            <div className="w-12 h-12 rounded-2xl bg-violet-50 text-violet-700 flex items-center justify-center">
              <User size={24} />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white border border-gray-200 rounded-[2rem] p-4 md:p-6 shadow-sm">

        <div className="flex items-center gap-3 mb-6">
          <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center">
            <Search size={22} />
          </div>

          <div>
            <h2 className="text-xl md:text-2xl font-extrabold">
              Filtros do histórico
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Pesquise por produto, cliente, local, usuário ou observação
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">
              Buscar
            </label>

            <div className="relative">
              <Search
                size={20}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                placeholder="Buscar por produto, cliente, local, usuário, observação..."
                className="w-full border border-gray-300 rounded-2xl pl-12 pr-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Filtrar por mês
            </label>

            <div className="relative">
              <Calendar
                size={20}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              />

              <input
                type="month"
                value={mesFiltro}
                onChange={(e) => setMesFiltro(e.target.value)}
                className="w-full border border-gray-300 rounded-2xl pl-12 pr-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

        </div>

        <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <p className="text-sm text-gray-500">
            {movimentacoesFiltradas.length} movimentação(ões) encontrada(s)
          </p>

          <button
            onClick={() => {
              setMesFiltro("");
              setBusca("");
            }}
            className="bg-gray-900 hover:bg-black text-white px-5 py-3 rounded-2xl transition flex items-center justify-center gap-2 font-bold"
          >
            <RotateCcw size={18} />
            Limpar filtros
          </button>
        </div>

      </section>

      <section className="xl:hidden space-y-4">

        {movimentacoesFiltradas.map((mov, index) => {
          const entrada = mov.tipo === "Entrada";

          return (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-[2rem] p-4 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex gap-3">
                  <div
                    className={
                      entrada
                        ? "w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0"
                        : "w-11 h-11 rounded-2xl bg-rose-50 text-rose-700 flex items-center justify-center shrink-0"
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
                          ? "bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold"
                          : "bg-rose-50 text-rose-700 px-3 py-1 rounded-full text-xs font-bold"
                      }
                    >
                      {mov.tipo}
                    </span>

                    <h3 className="font-extrabold text-lg mt-2">
                      {mov.produto}
                    </h3>
                  </div>
                </div>

                <div className="text-right">
                  <p
                    className={
                      entrada
                        ? "font-extrabold text-emerald-700"
                        : "font-extrabold text-rose-700"
                    }
                  >
                    {entrada ? "+" : "-"}
                    {mov.quantidade} un.
                  </p>

                  <p className="text-xs text-gray-400 mt-1">
                    {formatarDataHora(mov.data)}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div className="bg-gray-50 rounded-2xl p-3">
                  <p className="text-gray-500">Cliente</p>
                  <p className="font-bold mt-1">{mov.cliente}</p>
                </div>

                <div className="bg-gray-50 rounded-2xl p-3">
                  <p className="text-gray-500">Local / Origem</p>
                  <p className="font-bold mt-1">{mov.local}</p>
                </div>

                <div className="bg-gray-50 rounded-2xl p-3">
                  <p className="text-gray-500">Nota Fiscal</p>
                  <p className="font-bold mt-1">{mov.notaFiscal}</p>
                </div>

                <div className="bg-gray-50 rounded-2xl p-3">
                  <p className="text-gray-500">Contador</p>
                  <p className="font-bold mt-1">{mov.contador}</p>
                </div>

                <div className="sm:col-span-2 bg-blue-50 rounded-2xl p-3">
                  <p className="text-blue-700 flex items-center gap-1">
                    <User size={15} />
                    Realizado por
                  </p>
                  <p className="font-bold text-blue-900 mt-1 break-all">
                    {mov.usuario}
                  </p>
                </div>

                {mov.observacoes !== "-" && (
                  <div className="sm:col-span-2 bg-violet-50 rounded-2xl p-3">
                    <p className="text-violet-700 flex items-center gap-1">
                      <FileText size={15} />
                      Observações
                    </p>
                    <p className="font-medium text-violet-900 mt-1 whitespace-pre-wrap">
                      {mov.observacoes}
                    </p>
                  </div>
                )}
              </div>
            </div>
          );
        })}

      </section>

      <section className="hidden xl:block bg-white border border-gray-200 rounded-[2rem] shadow-sm overflow-x-auto">

        <table className="w-full min-w-[1400px]">

          <thead>
            <tr className="text-left bg-gray-50">
              <th className="p-4 text-sm text-gray-600 font-semibold">
                Tipo
              </th>

              <th className="p-4 text-sm text-gray-600 font-semibold">
                Produto
              </th>

              <th className="p-4 text-sm text-gray-600 font-semibold">
                Qtd
              </th>

              <th className="p-4 text-sm text-gray-600 font-semibold">
                Cliente
              </th>

              <th className="p-4 text-sm text-gray-600 font-semibold">
                Local / Origem
              </th>

              <th className="p-4 text-sm text-gray-600 font-semibold">
                NF
              </th>

              <th className="p-4 text-sm text-gray-600 font-semibold">
                Contador
              </th>

              <th className="p-4 text-sm text-gray-600 font-semibold">
                Observações
              </th>

              <th className="p-4 text-sm text-gray-600 font-semibold">
                Realizado por
              </th>

              <th className="p-4 text-sm text-gray-600 font-semibold">
                Data / Hora
              </th>
            </tr>
          </thead>

          <tbody>
            {movimentacoesFiltradas.map((mov, index) => {
              const entrada = mov.tipo === "Entrada";

              return (
                <tr
                  key={index}
                  className="border-t border-gray-100 hover:bg-blue-50/40 transition"
                >
                  <td className="p-4">
                    <span
                      className={
                        entrada
                          ? "bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-sm font-bold"
                          : "bg-rose-50 text-rose-700 px-3 py-1 rounded-full text-sm font-bold"
                      }
                    >
                      {mov.tipo}
                    </span>
                  </td>

                  <td className="p-4 font-bold text-gray-900">
                    {mov.produto}
                  </td>

                  <td
                    className={
                      entrada
                        ? "p-4 font-extrabold text-emerald-700"
                        : "p-4 font-extrabold text-rose-700"
                    }
                  >
                    {entrada ? "+" : "-"}
                    {mov.quantidade}
                  </td>

                  <td className="p-4 text-gray-600 whitespace-nowrap">
                    {mov.cliente}
                  </td>

                  <td className="p-4 text-gray-600 whitespace-nowrap">
                    {mov.local}
                  </td>

                  <td className="p-4 text-gray-600 whitespace-nowrap">
                    {mov.notaFiscal}
                  </td>

                  <td className="p-4 text-gray-600 whitespace-nowrap">
                    {mov.contador}
                  </td>

                  <td className="p-4 text-gray-600 max-w-[260px]">
                    <span className="line-clamp-2">
                      {mov.observacoes}
                    </span>
                  </td>

                  <td className="p-4 text-gray-600 max-w-[220px] break-all">
                    {mov.usuario}
                  </td>

                  <td className="p-4 text-gray-600 whitespace-nowrap">
                    {formatarDataHora(mov.data)}
                  </td>
                </tr>
              );
            })}
          </tbody>

        </table>

      </section>

    </div>
  );
}