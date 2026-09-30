"use client";

import * as XLSX from "xlsx";
import { FileSpreadsheet } from "lucide-react";

interface Produto {
  id: number;
  nome: string;
  tipo?: string;
  quantidade: number;
  estoque_minimo?: number;
}

interface BotaoExcelProps {
  produtos: Produto[];
}

export default function BotaoExcel({ produtos }: BotaoExcelProps) {
  function exportarExcel() {
    if (!produtos || produtos.length === 0) {
      alert("Nenhum produto disponível para exportar.");
      return;
    }

    // 1. Mapeia e organiza a estrutura dos dados
    const dados = produtos.map((produto, index) => {
      const baixo = Number(produto.quantidade || 0) <= Number(produto.estoque_minimo || 5);
      return {
        "Nº": index + 1,
        "Nome do Produto": produto.nome || "-",
        "Categoria / Tipo": produto.tipo || "-",
        "Qtd. Atual": Number(produto.quantidade || 0),
        "Estoque Mínimo": Number(produto.estoque_minimo || 5),
        "Status do Estoque": baixo ? "ATENÇÃO (Abaixo do Mínimo)" : "NORMAL",
      };
    });

    // 2. Cria a folha de dados (worksheet)
    const worksheet = XLSX.utils.json_to_sheet(dados);

    // 3. Define as larguras das colunas para evitar textos cortados ou "###"
    worksheet["!cols"] = [
      { wch: 6 },  // Nº
      { wch: 42 }, // Nome do Produto
      { wch: 22 }, // Categoria / Tipo
      { wch: 15 }, // Qtd. Atual
      { wch: 16 }, // Estoque Mínimo
      { wch: 30 }, // Status do Estoque
    ];

    // 4. Monta a pasta de trabalho (workbook) e faz o download
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Produtos");

    const dataAtual = new Date().toISOString().split("T")[0];
    XLSX.writeFile(workbook, `Relatorio_Produtos_${dataAtual}.xlsx`);
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