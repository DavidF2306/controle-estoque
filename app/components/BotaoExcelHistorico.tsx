"use client";

import * as XLSX from "xlsx";
import { FileSpreadsheet } from "lucide-react";

interface Movimentacao {
  id?: number;
  tipo?: string;
  created_at?: string;
  quantidade?: number;
  local_origem?: string;
  nota_fiscal?: string;
  contador?: string;
  observacao?: string;
  usuario?: string;
  // Se o teu join trouxer os dados do produto num objeto ou direto:
  produto?: { nome: string };
  produto_nome?: string; 
}

interface BotaoExcelHistoricoProps {
  historico: Movimentacao[];
}

export default function BotaoExcelHistorico({ historico }: BotaoExcelHistoricoProps) {
  const exportarExcel = () => {
    // 1. Mapear e formatar os dados para ficarem bonitos no Excel
    const dadosFormatados = historico.map((item) => {
      
      // Formatar a Data e Hora para o padrão PT/BR (DD/MM/AAAA HH:MM)
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

      // Descobrir o nome do produto dependendo de como a tua query do Supabase retorna
      const nomeDoProduto = item.produto?.nome || item.produto_nome || "Produto não encontrado";

      return {
        "Data e Hora": dataFormatada,
        "Tipo": item.tipo === "entrada" ? "ENTRADA" : "SAÍDA",
        "Produto": nomeDoProduto,
        "Qtd": item.quantidade || 0,
        "Local / Origem": item.local_origem || "-",
        "NF": item.nota_fiscal || "-",
        "Contador": item.contador || "-",
        "Observações": item.observacao || "-",
        "Realizado por": item.usuario || "-",
      };
    });

    // 2. Criar a folha de cálculo (Worksheet)
    const worksheet = XLSX.utils.json_to_sheet(dadosFormatados);

    // 3. DEFINIR A LARGURA DAS COLUNAS (Isto resolve o problema de estar tudo junto)
    worksheet["!cols"] = [
      { wch: 18 }, // Data e Hora
      { wch: 12 }, // Tipo
      { wch: 35 }, // Produto (mais largo para caber os nomes)
      { wch: 8 },  // Qtd
      { wch: 25 }, // Local / Origem
      { wch: 12 }, // NF
      { wch: 12 }, // Contador
      { wch: 45 }, // Observações (bem largo)
      { wch: 18 }, // Realizado por
    ];

    // 4. Criar o ficheiro final e descarregar
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Histórico");
    
    // Nome do ficheiro Excel
    XLSX.writeFile(workbook, "Historico_Movimentacoes.xlsx");
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