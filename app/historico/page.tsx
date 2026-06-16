"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import BotaoPDFHistorico from "../components/BotaoPDFHistorico";
import {
  History,
  Search,
  Calendar,
  RotateCcw,
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

  return (
    <div className="text-gray-900 w-full overflow-x-hidden">

      <div className="pt-14 md:pt-0 mb-8 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">

        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-blue-600 text-white flex items-center justify-center">
            <History size={22} />
          </div>

          <div>
            <h1 className="text-3xl md:text-4xl font-bold">
              Histórico
            </h1>

            <p className="text-gray-500 mt-1">
              Entradas, saídas e movimentações do estoque
            </p>
          </div>
        </div>

        <div className="w-full xl:w-auto">
          <BotaoPDFHistorico
            movimentacoes={movimentacoesFiltradas}
            mesFiltro={mesFiltro}
          />
        </div>

      </div>

      <div className="bg-white border border-gray-200 rounded-3xl p-4 md:p-6 shadow-sm mb-6">

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
            className="bg-gray-900 hover:bg-black text-white px-5 py-3 rounded-2xl transition flex items-center justify-center gap-2"
          >
            <RotateCcw size={18} />
            Limpar filtros
          </button>

        </div>

      </div>

      <div className="xl:hidden space-y-4">

        {movimentacoesFiltradas.map((mov, index) => (
          <div
            key={index}
            className="bg-white border border-gray-200 rounded-3xl p-4 shadow-sm"
          >
            <div className="flex items-center justify-between gap-3 mb-4">
              <span
                className={
                  mov.tipo === "Entrada"
                    ? "bg-green-50 text-green-600 px-3 py-1 rounded-full text-sm font-medium"
                    : "bg-red-50 text-red-600 px-3 py-1 rounded-full text-sm font-medium"
                }
              >
                {mov.tipo}
              </span>

              <span className="text-sm text-gray-500">
                {formatarDataHora(mov.data)}
              </span>
            </div>

            <h3 className="font-bold text-lg mb-3">
              {mov.produto}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-gray-500">Quantidade</p>
                <p className="font-medium">{mov.quantidade}</p>
              </div>

              <div>
                <p className="text-gray-500">Cliente</p>
                <p className="font-medium">{mov.cliente}</p>
              </div>

              <div>
                <p className="text-gray-500">Local / Origem</p>
                <p className="font-medium">{mov.local}</p>
              </div>

              <div>
                <p className="text-gray-500">Nota Fiscal</p>
                <p className="font-medium">{mov.notaFiscal}</p>
              </div>

              <div>
                <p className="text-gray-500">Contador</p>
                <p className="font-medium">{mov.contador}</p>
              </div>

              <div>
                <p className="text-gray-500">Realizado por</p>
                <p className="font-medium break-all">{mov.usuario}</p>
              </div>

              <div className="sm:col-span-2">
                <p className="text-gray-500">Observações</p>
                <p className="font-medium whitespace-pre-wrap">
                  {mov.observacoes}
                </p>
              </div>
            </div>
          </div>
        ))}

      </div>

      <div className="hidden xl:block bg-white border border-gray-200 rounded-3xl shadow-sm overflow-x-auto">

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
            {movimentacoesFiltradas.map((mov, index) => (
              <tr
                key={index}
                className="border-t border-gray-100 hover:bg-gray-50 transition"
              >
                <td className="p-4">
                  <span
                    className={
                      mov.tipo === "Entrada"
                        ? "bg-green-50 text-green-600 px-3 py-1 rounded-full text-sm font-medium"
                        : "bg-red-50 text-red-600 px-3 py-1 rounded-full text-sm font-medium"
                    }
                  >
                    {mov.tipo}
                  </span>
                </td>

                <td className="p-4 font-medium text-gray-900">
                  {mov.produto}
                </td>

                <td className="p-4 text-gray-600">
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
            ))}
          </tbody>

        </table>

      </div>

    </div>
  );
}