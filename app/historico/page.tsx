"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import BotaoPDFHistorico from "../components/BotaoPDFHistorico";
import BotaoExcelHistorico from "../components/BotaoExcel";
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
  Package,
  Archive,
} from "lucide-react";

export default function Historico() {
  const [movimentacoes, setMovimentacoes] = useState<any[]>([]);
  const [mesFiltro, setMesFiltro] = useState("");
  const [busca, setBusca] = useState("");
  const [loading, setLoading] = useState(true);

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
    setLoading(true);
    const { data: usuarios } = await supabase
      .from("usuarios_autorizados")
      .select("nome, email");

    function buscarNomeUsuario(email: string) {
      if (!email) return "-";

      const usuario = usuarios?.find(
        (item) => item.email?.toLowerCase() === email.toLowerCase()
      );

      return usuario?.nome || email;
    }

    const { data: entradas } = await supabase.from("entradas").select(`
        *,
        produtos (
          nome
        )
      `);

    const { data: saidas } = await supabase.from("saidas").select(`
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
        local: saida.local || saida.destino || "-",
        notaFiscal: "-",
        contador: saida.contador || "-",
        observacoes: saida.observacoes || "-",
        usuario: buscarNomeUsuario(saida.usuario_email),
        data: saida.created_at,
      })),
    ];

    todasMovimentacoes.sort(
      (a, b) => new Date(b.data).getTime() - new Date(a.data).getTime()
    );

    setMovimentacoes(todasMovimentacoes);
    setLoading(false);
  }

  const movimentacoesFiltradas = movimentacoes.filter((mov) => {
    const filtroMes =
      mesFiltro === "" || mov.data.slice(0, 7) === mesFiltro;

    const textoBusca = `
      ${mov.tipo}
      ${mov.produto}
      ${mov.local}
      ${mov.notaFiscal}
      ${mov.contador}
      ${mov.observacoes}
      ${mov.usuario}
    `.toLowerCase();

    const filtroBusca =
      busca === "" || textoBusca.includes(busca.toLowerCase());

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
    ...new Set(movimentacoesFiltradas.map((mov) => mov.usuario).filter(Boolean)),
  ];

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-slate-500 dark:text-slate-400">
          <div className="w-8 h-8 border-4 border-slate-200 dark:border-slate-700 border-t-blue-600 dark:border-t-blue-500 rounded-full animate-spin" />
          <p className="font-medium">Carregando histórico...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="text-slate-800 dark:text-slate-200 w-full overflow-x-hidden space-y-6">
      
      {/* Hero Section */}
      <section className="pt-14 md:pt-0">
        <div className="relative overflow-hidden rounded-2xl bg-slate-900 text-white shadow-md">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
          
          <div className="relative p-6 md:p-10 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-8">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-xl bg-white/10 border border-white/10 backdrop-blur-sm flex items-center justify-center shrink-0">
                <History size={32} className="text-blue-400" />
              </div>

              <div>
                <p className="text-slate-400 text-sm font-medium mb-1 tracking-wide uppercase">
                  Auditoria e Registros
                </p>

                <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                  Histórico de Estoque
                </h1>

                <p className="text-slate-400 mt-2 text-sm md:text-base max-w-2xl">
                  Acompanhe todas as movimentações, entradas, saídas e ações de usuários no sistema.
                </p>
              </div>
            </div>

            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5 min-w-[260px]">
              <p className="text-slate-400 text-sm font-medium">
                Registros encontrados
              </p>

              <div className="flex items-end gap-2 mt-2 mb-4">
                <p className="text-3xl font-bold text-white">
                  {movimentacoesFiltradas.length}
                </p>
                <p className="text-slate-400 text-sm mb-1">movimentações</p>
              </div>

              <div className="flex flex-col gap-2 border-t border-slate-700 pt-4">
                <BotaoPDFHistorico
                  movimentacoes={movimentacoesFiltradas}
                  mesFiltro={mesFiltro}
                />
                
                <BotaoExcelHistorico
                  movimentacoes={movimentacoesFiltradas}
                  mesFiltro={mesFiltro}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cards de Métricas */}
      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total de Entradas</p>
              <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mt-1">{totalEntradas}</h2>
              <p className="text-xs text-slate-400 mt-1">registros listados</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <ArrowDownCircle size={20} />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total de Saídas</p>
              <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mt-1">{totalSaidas}</h2>
              <p className="text-xs text-slate-400 mt-1">registros listados</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <ArrowUpCircle size={20} />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Volume Movimentado</p>
              <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mt-1">{totalItensMovimentados}</h2>
              <p className="text-xs text-slate-400 mt-1">unidades no total</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Package size={20} />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Usuários Ativos</p>
              <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mt-1">{usuariosUnicos.length}</h2>
              <p className="text-xs text-slate-400 mt-1">com ações registradas</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-violet-50 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 flex items-center justify-center">
              <User size={20} />
            </div>
          </div>
        </div>
      </section>

      {/* Área de Filtros */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
        <div className="flex items-center gap-3 mb-5 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="w-10 h-10 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center shrink-0">
            <Search size={20} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">
              Filtros Avançados
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Refine a busca por produto, local, usuário, ou período.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Busca em Texto
            </label>
            <div className="relative">
              <Search
                size={18}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                placeholder="Ex: Toner, Recepção, João, NF-123..."
                className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg pl-10 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow text-slate-800 dark:text-slate-100"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Filtrar por Mês
            </label>
            <div className="relative">
              <Calendar
                size={18}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
              />
              <input
                type="month"
                value={mesFiltro}
                onChange={(e) => setMesFiltro(e.target.value)}
                className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg pl-10 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow text-slate-800 dark:text-slate-100"
              />
            </div>
          </div>
        </div>

        <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            Mostrando <span className="text-slate-800 dark:text-slate-200 font-bold">{movimentacoesFiltradas.length}</span> resultado(s)
          </p>

          <button
            onClick={() => {
              setMesFiltro("");
              setBusca("");
            }}
            className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-slate-100 px-5 py-2 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm font-semibold shadow-sm"
          >
            <RotateCcw size={16} />
            Limpar Filtros
          </button>
        </div>
      </section>

      {/* Empty State */}
      {movimentacoesFiltradas.length === 0 && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-12 text-center shadow-sm">
          <Archive size={48} className="mx-auto text-slate-300 dark:text-slate-600 mb-4" />
          <h2 className="text-xl font-bold text-slate-700 dark:text-slate-200">
            Nenhuma movimentação encontrada
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm">
            Tente ajustar os filtros ou limpar a pesquisa para ver mais resultados.
          </p>
        </div>
      )}

      {/* Lista Mobile */}
      {movimentacoesFiltradas.length > 0 && (
        <section className="xl:hidden space-y-4">
          {movimentacoesFiltradas.map((mov, index) => {
            const entrada = mov.tipo === "Entrada";

            return (
              <div
                key={index}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3 mb-4 border-b border-slate-100 dark:border-slate-800 pb-4">
                  <div className="flex gap-3">
                    <div
                      className={`mt-1 w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                        entrada
                          ? "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400"
                          : "bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400"
                      }`}
                    >
                      {entrada ? <ArrowDownCircle size={20} /> : <ArrowUpCircle size={20} />}
                    </div>

                    <div>
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider mb-1 border ${
                          entrada
                            ? "bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800"
                            : "bg-rose-100 dark:bg-rose-900/50 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800"
                        }`}
                      >
                        {mov.tipo}
                      </span>
                      <h3 className="font-bold text-slate-800 dark:text-slate-100 leading-tight">
                        {mov.produto}
                      </h3>
                    </div>
                  </div>

                  <div className="text-right">
                    <p
                      className={`font-bold text-lg ${
                        entrada ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
                      }`}
                    >
                      {entrada ? "+" : "-"}
                      {mov.quantidade} <span className="text-sm font-medium text-slate-500 dark:text-slate-400">un.</span>
                    </p>
                    <p className="text-[11px] font-medium text-slate-400 dark:text-slate-500 mt-0.5">
                      {formatarDataHora(mov.data)}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50 rounded-lg p-3">
                    <p className="text-[11px] uppercase tracking-wider font-semibold text-slate-400 dark:text-slate-500 mb-0.5">Local / Origem</p>
                    <p className="font-semibold text-slate-700 dark:text-slate-300">{mov.local}</p>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50 rounded-lg p-3">
                    <p className="text-[11px] uppercase tracking-wider font-semibold text-slate-400 dark:text-slate-500 mb-0.5">Nota Fiscal</p>
                    <p className="font-semibold text-slate-700 dark:text-slate-300">{mov.notaFiscal}</p>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50 rounded-lg p-3">
                    <p className="text-[11px] uppercase tracking-wider font-semibold text-slate-400 dark:text-slate-500 mb-0.5">Contador</p>
                    <p className="font-semibold text-slate-700 dark:text-slate-300">{mov.contador}</p>
                  </div>

                  <div className="sm:col-span-2 bg-blue-50/50 dark:bg-blue-900/20 border border-blue-100/50 dark:border-blue-800/30 rounded-lg p-3">
                    <p className="text-blue-600 dark:text-blue-400 flex items-center gap-1.5 text-[11px] uppercase tracking-wider font-semibold mb-0.5">
                      <User size={13} />
                      Responsável
                    </p>
                    <p className="font-semibold text-blue-900 dark:text-blue-300 break-all">
                      {mov.usuario}
                    </p>
                  </div>

                  {mov.observacoes !== "-" && (
                    <div className="sm:col-span-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50 rounded-lg p-3">
                      <p className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5 text-[11px] uppercase tracking-wider font-semibold mb-0.5">
                        <FileText size={13} />
                        Observações
                      </p>
                      <p className="font-medium text-slate-700 dark:text-slate-300 whitespace-pre-wrap mt-1">
                        {mov.observacoes}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </section>
      )}

      {/* Tabela Desktop */}
      {movimentacoesFiltradas.length > 0 && (
        <section className="hidden xl:block bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-x-auto">
          <table className="w-full min-w-[1200px] text-sm text-left">
            <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 font-medium border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="px-6 py-4">Tipo</th>
                <th className="px-6 py-4">Produto</th>
                <th className="px-6 py-4">Qtd</th>
                <th className="px-6 py-4">Local / Origem</th>
                <th className="px-6 py-4">NF</th>
                <th className="px-6 py-4">Contador</th>
                <th className="px-6 py-4">Observações</th>
                <th className="px-6 py-4">Realizado por</th>
                <th className="px-6 py-4">Data / Hora</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {movimentacoesFiltradas.map((mov, index) => {
                const entrada = mov.tipo === "Entrada";

                return (
                  <tr
                    key={index}
                    className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider ${
                          entrada
                            ? "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800/50"
                            : "bg-rose-50 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400 border border-rose-100 dark:border-rose-800/50"
                        }`}
                      >
                        {mov.tipo}
                      </span>
                    </td>

                    <td className="px-6 py-4 font-semibold text-slate-800 dark:text-slate-200">
                      {mov.produto}
                    </td>

                    <td
                      className={`px-6 py-4 font-bold ${
                        entrada ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
                      }`}
                    >
                      {entrada ? "+" : "-"}
                      {mov.quantidade}
                    </td>

                    <td className="px-6 py-4 text-slate-600 dark:text-slate-400 whitespace-nowrap">
                      {mov.local}
                    </td>

                    <td className="px-6 py-4 text-slate-600 dark:text-slate-400 whitespace-nowrap">
                      {mov.notaFiscal}
                    </td>

                    <td className="px-6 py-4 text-slate-600 dark:text-slate-400 whitespace-nowrap">
                      {mov.contador}
                    </td>

                    <td className="px-6 py-4 text-slate-500 dark:text-slate-500 max-w-[260px]">
                      <span className="line-clamp-2" title={mov.observacoes}>
                        {mov.observacoes}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-slate-600 dark:text-slate-400 max-w-[200px] truncate" title={mov.usuario}>
                      {mov.usuario}
                    </td>

                    <td className="px-6 py-4 text-slate-500 dark:text-slate-500 font-medium whitespace-nowrap">
                      {formatarDataHora(mov.data)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </section>
      )}
    </div>
  );
}