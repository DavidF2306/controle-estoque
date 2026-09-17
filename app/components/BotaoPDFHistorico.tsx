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

    // "landscape" para caber perfeitamente todas as colunas deitado
    const doc = new jsPDF("landscape", "mm", "a4");

    // Cores padrão corporativas (RGB)
    const corPrimaria = [30, 58, 138];   // Azul escuro (Slate/Blue)
    const corTextoCinza = [100, 116, 139]; // Cinza elegante
    const corLinhaBorda = [226, 232, 240]; // Borda clara

    // --- CABEÇALHO DO DOCUMENTO ---
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.setTextColor(corPrimaria[0], corPrimaria[1], corPrimaria[2]);
    doc.text("COPYSTAR", 14, 16);

    doc.setFontSize(12);
    doc.setTextColor(51, 65, 85); // Slate 700
    doc.text("Relatório de Auditoria - Histórico de Movimentações", 14, 23);

    // Subtítulo com informações de período e data de emissão
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(corTextoCinza[0], corTextoCinza[1], corTextoCinza[2]);

    let periodoTexto = "Período: Todo o histórico cadastrado";
    if (mesFiltro) {
      const [ano, mes] = mesFiltro.split("-");
      periodoTexto = `Período Filtrado: Mês ${mes}/${ano}`;
    }

    const dataEmissao = `Emitido em: ${new Date().toLocaleDateString("pt-BR")} às ${new Date().toLocaleTimeString("pt-BR", { hour: '2-digit', minute: '2-digit' })}` ;

    doc.text(periodoTexto, 14, 29);
    doc.text(dataEmissao, 283 - 14, 29, { align: "right" });

    // Linha divisória sutil abaixo do cabeçalho
    doc.setDrawColor(corLinhaBorda[0], corLinhaBorda[1], corLinhaBorda[2]);
    doc.setLineWidth(0.5);
    doc.line(14, 33, 283 - 14, 33);

    // --- PREPARAÇÃO DOS DADOS DA TABELA ---
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
        mov.tipo || "-",
        mov.produto || "-",
        mov.quantidade || 0,
        mov.local || "-",
        mov.notaFiscal || "-",
        mov.contador || "-",
        mov.observacoes || "-",
        mov.usuario || "-",
        dataFormatada,
      ];
    });

    // --- GERAÇÃO DA TABELA COM AUTOTABLE ---
    autoTable(doc, {
      head: [colunas],
      body: linhas,
      startY: 37,
      margin: { left: 14, right: 14 },
      styles: {
        font: "helvetica",
        fontSize: 8,
        cellPadding: 4,
        textColor: [51, 65, 85], // Texto cinza escuro legível
      },
      headStyles: {
        fillColor: [30, 58, 138], // Azul escuro corporativo
        textColor: [255, 255, 255],
        fontStyle: "bold",
        halign: "left",
      },
      alternateRowStyles: {
        fillColor: [248, 250, 252], // Fundo levemente zebrado (Slate 50)
      },
      columnStyles: {
        0: { cellWidth: 20, fontStyle: "bold" }, // Tipo
        1: { cellWidth: 40 }, // Produto
        2: { cellWidth: 15, halign: "center" }, // Qtd
        3: { cellWidth: 35 }, // Local
        4: { cellWidth: 20 }, // NF
        5: { cellWidth: 20 }, // Contador
        6: { cellWidth: 45 }, // Observações
        7: { cellWidth: 30 }, // Realizado por
        8: { cellWidth: 30 }, // Data / Hora
      },
      // --- RODAPÉ AUTOMÁTICO EM CADA PÁGINA ---
      didDrawPage: (data) => {
        const paginasTotales = (doc as any).internal.getNumberOfPages();
        const paginaAtual = doc.getCurrentPageInfo().pageNumber;

        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.setTextColor(148, 163, 184); // Slate 400

        // Texto à esquerda no rodapé
        doc.text("Copystar Gestão de Estoque - Relatório Confidencial", 14, doc.internal.pageSize.height - 10);

        // Numeração de página à direita
        doc.text(
          `Página ${paginaAtual} de ${paginasTotales}`,
          doc.internal.pageSize.width - 14,
          doc.internal.pageSize.height - 10,
          { align: "right" }
        );
      },
    });

    // Nome do arquivo dinâmico
    const nomeArquivo = mesFiltro
      ? `Relatorio_Historico_${mesFiltro}.pdf`
      : `Relatorio_Historico_Completo.pdf`;

    doc.save(nomeArquivo);
  }

  return (
    <button
      onClick={exportarParaPDF}
      className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-2xl font-bold transition flex items-center justify-center gap-2 w-full shadow-sm"
    >
      <FileText size={20} />
      Exportar PDF
    </button>
  );
}