"use client";

import * as XLSX from "xlsx";
import { FileSpreadsheet } from "lucide-react";

interface BotaoExcelHistoricoProps {
  movimentacoes?: any[];
  historico?: any[];
  mesFiltro?: string;
}

export default function BotaoExcelHistorico({
  movimentacoes,
  historico,
  mesFiltro,
}: BotaoExcelHistoricoProps) {
  const exportarExcel = () => {
    // Garante que pega a lista correta
    const lista = movimentacoes || historico || [];

    if (lista.length === 0) {
      alert("Nenhuma movimentação para exportar.");
      return;
    }

    // 1. Mapear e formatar os dados com colunas limpas e datas legíveis
    const dadosFormatados = lista.map((item) => {
      // Formata a data e hora para o padrão brasileiro (DD/MM/AAAA HH:MM)
      let dataFormatada = "-";
      if (item.created_at) {
        const data = new Date(item.created_at);
        dataFormatada = data.toLocaleString("pt-BR", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });
      }

      // Descobre o nome do produto (seja via relacionamento ou campo direto)
      const nomeDoProduto =
        item.produtos?.nome ||
        item.produto?.nome ||
        item.produto_nome ||
        item.nome_produto ||
        "-";

      return {
        "Data e Hora": dataFormatada,
        "Tipo": item.tipo ? String(item.tipo).toUpperCase() : "-",
        "Produto": nomeDoProduto,
        "Qtd": item.quantidade || 0,
        "Local / Origem": item.local_origem || item.origem || "-",
        "NF": item.nota_fiscal || item.nf || "-",
        "Contador": item.contador || "-",
        "Observações": item.observacao || item.observacoes || "-",
        "Realizado por": item.usuario || item.realizado_por || "-",
      };
    });

    // 2. Criar a planilha
    const worksheet = XLSX.utils.json_to_sheet(dadosFormatados);

    // 3. LARGURA DAS COLUNAS (impede que o texto fique espremido)
    worksheet["!cols"] = [
      { wch: 18 }, // Data e Hora
      { wch: 12 }, // Tipo
      { wch: 35 }, // Produto (bem espaçoso)
      { wch: 10 }, // Qtd
      { wch: 25 }, // Local / Origem
      { wch: 14 }, // NF
      { wch: 14 }, // Contador
      { wch: 40 }, // Observações (bem espaçoso)
      { wch: 20 }, // Realizado por
    ];

    // 4. Salvar o arquivo Excel
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Histórico");

    const nomeArquivo = mesFiltro
      ? `Historico_Movimentacoes_${mesFiltro}.xlsx`
      : "Historico_Movimentacoes.xlsx";

    XLSX.writeFile(workbook, nomeArquivo);
  };

  return (
    <button
      onClick={exportarExcel}
      className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 shadow-sm text-sm"
    >
      <FileSpreadsheet size={18} />
      Exportar Excel
    </button>
  );
}