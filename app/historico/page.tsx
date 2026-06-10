"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import BotaoPDFHistorico from "../components/BotaoPDFHistorico";

export default function Historico() {
  const [movimentacoes, setMovimentacoes] = useState<any[]>([]);
  const [mesFiltro, setMesFiltro] = useState("");

  useEffect(() => {
    buscarMovimentacoes();
  }, []);

  async function buscarMovimentacoes() {
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
        produto: entrada.produtos?.nome,
        quantidade: entrada.quantidade,
        cliente: "-",
        local: entrada.origem || "-",
        notaFiscal: entrada.nota_fiscal || "-",
        contador: entrada.contador || "-",
        data: entrada.created_at,
      })),

      ...(saidas || []).map((saida) => ({
        tipo: "Saída",
        produto: saida.produtos?.nome,
        quantidade: saida.quantidade,
        cliente: saida.cliente || "-",
        local: saida.local || saida.destino || "-",
        notaFiscal: "-",
        contador: "-",
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

  const movimentacoesFiltradas =
    mesFiltro === ""
      ? movimentacoes
      : movimentacoes.filter(
          (movimentacao) =>
            movimentacao.data.slice(0, 7) === mesFiltro
        );

  return (
    <div className="text-gray-800 w-full overflow-x-hidden">

      <div className="pt-14 md:pt-0 mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
            Histórico
          </h1>

          <p className="text-gray-500 mt-2">
            Histórico completo de entradas e saídas
          </p>
        </div>

        <div className="w-full md:w-auto">
          <BotaoPDFHistorico
            movimentacoes={movimentacoesFiltradas}
            mesFiltro={mesFiltro}
          />
        </div>
      </div>

      <div className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-gray-200 mb-6">
        <div className="flex flex-col md:flex-row md:items-end gap-4">
          <div className="w-full md:w-auto">
            <label className="block text-sm font-medium mb-2">
              Filtrar por mês
            </label>

            <input
              type="month"
              value={mesFiltro}
              onChange={(e) => setMesFiltro(e.target.value)}
              className="w-full md:w-auto border border-gray-300 rounded-xl px-4 py-3"
            />
          </div>

          <button
            onClick={() => setMesFiltro("")}
            className="bg-gray-800 text-white px-5 py-3 rounded-xl hover:bg-black transition"
          >
            Limpar
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-x-auto">
        <table className="w-full min-w-[1200px]">

          <thead className="bg-gray-100">
            <tr className="text-left">
              <th className="p-4 text-gray-800">Tipo</th>
              <th className="p-4 text-gray-800">Produto</th>
              <th className="p-4 text-gray-800">Quantidade</th>
              <th className="p-4 text-gray-800">Cliente</th>
              <th className="p-4 text-gray-800">Local / Origem</th>
              <th className="p-4 text-gray-800">Nota Fiscal</th>
              <th className="p-4 text-gray-800">Contador</th>
              <th className="p-4 text-gray-800">Data</th>
            </tr>
          </thead>

          <tbody>
            {movimentacoesFiltradas.map((movimentacao, index) => (
              <tr
                key={index}
                className="border-t border-gray-200 hover:bg-gray-50"
              >
                <td className="p-4">
                  <span
                    className={
                      movimentacao.tipo === "Entrada"
                        ? "text-green-600 font-medium"
                        : "text-red-600 font-medium"
                    }
                  >
                    {movimentacao.tipo}
                  </span>
                </td>

                <td className="p-4 text-gray-800">
                  {movimentacao.produto}
                </td>

                <td className="p-4 text-gray-800">
                  {movimentacao.quantidade}
                </td>

                <td className="p-4 text-gray-800 whitespace-nowrap">
                  {movimentacao.cliente}
                </td>

                <td className="p-4 text-gray-800 whitespace-nowrap">
                  {movimentacao.local}
                </td>

                <td className="p-4 text-gray-800 whitespace-nowrap">
                  {movimentacao.notaFiscal}
                </td>

                <td className="p-4 text-gray-800 whitespace-nowrap">
                  {movimentacao.contador}
                </td>

                <td className="p-4 text-gray-800 whitespace-nowrap">
                  {new Date(
                    movimentacao.data
                  ).toLocaleDateString("pt-BR")}
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>

    </div>
  );
}