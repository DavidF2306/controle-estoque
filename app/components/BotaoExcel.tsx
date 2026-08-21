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

    // Prepara os dados formatados para a planilha
    const dadosPlanilha = movimentacoes.map((mov) => {
      // Ajusta o fuso horário da data para exibição correta
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
        "Tipo": mov.tipo,
        "Produto": mov.produto,
        "Quantidade": mov.quantidade,
        "Cliente": mov.cliente,
        "Local / Origem": mov.local,
        "Nota Fiscal": mov.notaFiscal,
        "Contador": mov.contador,
        "Observações": mov.observacoes,
        "Realizado por": mov.usuario,
        "Data / Hora": dataFormatada,
      };
    });

    // Cria a planilha e adiciona os dados
    const worksheet = XLSX.utils.json_to_sheet(dadosPlanilha);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Histórico");

    // Define o nome do arquivo dinamicamente com base no filtro
    const nomeArquivo = mesFiltro
      ? `Historico_Estoque_${mesFiltro}.xlsx`
      : `Historico_Estoque_Completo.xlsx`;

    // Dispara o download
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