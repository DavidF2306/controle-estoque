"use client";

import { FileText } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface BotaoPDFProps {
  movimentacoes: any[];
  mesFiltro: string;
}

export default function BotaoPDFHistorico({ movimentacoes, mesFiltro }: BotaoPDFProps) {
  function exportarParaPDF() {
    if (movimentacoes.length === 0) {
      alert("Não há dados para exportar.");
      return;
    }

    const doc = new jsPDF("landscape"); // "landscape" para caber todas as colunas deitado

    // Título do PDF
    doc.setFontSize(16);
    doc.text("Histórico de Movimentações - Estoque Copystar", 14, 15);
    
    // Subtítulo com o filtro de mês, se houver
    doc.setFontSize(10);
    doc.setTextColor(100);
    if (mesFiltro) {
      const [ano, mes] = mesFiltro.split("-");
      doc.text(`Filtrado por: ${mes}/${ano}`, 14, 22);
    } else {
      doc.text("Filtro: Todo o período", 14, 22);
    }

    // Preparando os dados para a tabela do PDF (sem a coluna Cliente)
    const colunas = [
      "Tipo",
      "Produto",
      "Qtd",
      "Local / Origem",
      "NF",
      "Contador",
      "Observações",
      "Realizado por",
      "Data / Hora",
    ];

    const linhas = movimentacoes.map((mov) => {
      // Formatando a data no formato legível
      const dataCorrigida = new Date(mov.data);
      dataCorrigida.setHours(dataCorrigida.getHours() - 3);
      const dataFormatada = dataCorrigida.toLocaleString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });

      return [
        mov.tipo,
        mov.produto,
        mov.quantidade,
        mov.local,
        mov.notaFiscal,
        mov.contador,
        mov.observacoes,
        mov.usuario,
        dataFormatada,
      ];
    });

    // Gerando a tabela no documento
    autoTable(doc, {
      head: [colunas],
      body: linhas,
      startY: 28,
      styles: {
        fontSize: 8,
        cellPadding: 3,
      },
      headStyles: {
        fillColor: [30, 58, 138], // Azul escuro
        textColor: [255, 255, 255],
        fontStyle: "bold",
      },
      alternateRowStyles: {
        fillColor: [245, 247, 250],
      },
    });

    // Definindo o nome do arquivo dinamicamente
    const nomeArquivo = mesFiltro
      ? `Historico_Estoque_${mesFiltro}.pdf`
      : `Historico_Estoque_Completo.pdf`;

    // Baixando o arquivo
    doc.save(nomeArquivo);
  }

  return (
    <button
      onClick={exportarParaPDF}
      className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-2xl font-bold transition flex items-center justify-center gap-2 w-full"
    >
      <FileText size={20} />
      Exportar PDF
    </button>
  );
}