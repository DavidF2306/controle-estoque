"use client";

import * as XLSX from "xlsx";
import { FileSpreadsheet } from "lucide-react";

interface Movimentacao {
  id?: number;
  tipo?: string;
  quantidade?: number;
  produto_nome?: string;
  data?: string;
  [key: string]: any;
}

interface BotaoExcelHistoricoProps {
  movimentacoes: Movimentacao[];
  mesFiltro?: string;
}

export default function BotaoExcelHistorico({ movimentacoes, mesFiltro }: BotaoExcelHistoricoProps) {
  function exportarExcel() {
    if (!movimentacoes || movimentacoes.length === 0) {
      alert("Nenhuma movimentação disponível para exportar.");
      return;
    }

    const dados = movimentacoes.map((item, index) => ({
      "Nº": index + 1,
      "Tipo": item.tipo || "-",
      "Produto": item.produto_nome || "-",
      "Quantidade": Number(item.quantidade || 0),
      "Data": item.data || "-",
    }));

    const worksheet = XLSX.utils.json_to_sheet(dados);

    worksheet["!cols"] = [
      { wch: 6 },
      { wch: 20 },
      { wch: 35 },
      { wch: 15 },
      { wch: 20 },
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Histórico");

    const nomeArquivo = mesFiltro ? `Historico_Movimentacoes_${mesFiltro}.xlsx` : "Historico_Movimentacoes.xlsx";
    XLSX.writeFile(workbook, nomeArquivo);
  }

  return (
    <button
      onClick={exportarExcel}
      className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 shadow-sm text-sm"
    >
      <FileSpreadsheet size={18} />
      Exportar Excel
    </button>
  );
}