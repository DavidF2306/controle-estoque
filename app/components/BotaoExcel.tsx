"use client";

import { FileSpreadsheet } from "lucide-react";
import * as XLSX from "xlsx";

interface BotaoExcelProps {
  movimentacoes: any[];
  mesFiltro: string;
}

export default function BotaoExcelHistorico({ movimentacoes, mesFiltro }: BotaoExcelProps) {
  function exportarParaExcel() {
    if (movimentacoes.length === 0) {
      alert("Não há dados para exportar.");
      return;
    }

    const dadosPlanilha = movimentacoes.map((mov) => {
      const dataCorrigida = new Date(mov.data);
      dataCorrigida.setHours(dataCorrigida.getHours() - 3);
      const dataFormatada = dataCorrigida.toLocaleString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });

      return {
        "Tipo": mov.tipo || "-",
        "Produto": mov.produto || "-",
        "Quantidade": mov.quantidade || 0,
        "Cliente": mov.cliente || "-",
        "Local / Origem": mov.local || "-",
        "Nota Fiscal": mov.notaFiscal || "-",
        "Contador": mov.contador || "-",
        "Observações": mov.observacoes || "-",
        "Realizado por": mov.usuario || "-",
        "Data / Hora": dataFormatada,
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(dadosPlanilha);

    const chaves = Object.keys(dadosPlanilha[0]);
    const larguras = chaves.map((chave) => {
   
      const tamanhoMaximo = Math.max(
        chave.length,
        ...dadosPlanilha.map((d) => String(d[chave as keyof typeof d] || "").length)
      );
      
      return { wch: Math.min(65, tamanhoMaximo + 3) };
    });

    worksheet["!cols"] = larguras;

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Histórico");

    const nomeArquivo = mesFiltro
      ? `Historico_Estoque_${mesFiltro}.xlsx`
      : `Historico_Estoque_Completo.xlsx`;

    XLSX.writeFile(workbook, nomeArquivo);
  }

  return (
    <button
      onClick={exportarParaExcel}
      className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3 rounded-2xl font-bold transition flex items-center justify-center gap-2 w-full"
    >
      <FileSpreadsheet size={20} />
      Exportar Excel
    </button>
  );
}