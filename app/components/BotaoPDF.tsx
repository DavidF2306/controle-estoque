"use client";

import { FileText } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function BotaoPDF({ produtos }: any) {
  function gerarPDF() {
    if (!produtos || produtos.length === 0) {
      alert("Não há dados para exportar.");
      return;
    }

    const doc = new jsPDF("portrait", "mm", "a4");

    // Cores padrão corporativas (RGB)
    const corPrimaria = [30, 58, 138];     // Azul escuro corporativo
    const corTextoCinza = [100, 116, 139]; // Cinza elegante
    const corLinhaBorda = [226, 232, 240]; // Borda clara

    // --- CABEÇALHO DO DOCUMENTO ---
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.setTextColor(corPrimaria[0], corPrimaria[1], corPrimaria[2]);
    doc.text("COPYSTAR", 14, 16);

    doc.setFontSize(12);
    doc.setTextColor(51, 65, 85); // Slate 700
    doc.text("Relatório Geral de Estoque e Produtos", 14, 23);

    // Subtítulo com data de emissão
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(corTextoCinza[0], corTextoCinza[1], corTextoCinza[2]);
    
    const dataEmissao = `Emitido em: ${new Date().toLocaleDateString("pt-BR")} às ${new Date().toLocaleTimeString("pt-BR", { hour: '2-digit', minute: '2-digit' })}` ;
    doc.text(dataEmissao, 14, 29);

    // Linha divisória sutil abaixo do cabeçalho
    doc.setDrawColor(corLinhaBorda[0], corLinhaBorda[1], corLinhaBorda[2]);
    doc.setLineWidth(0.5);
    doc.line(14, 33, 210 - 14, 33);

    // --- PREPARAÇÃO DOS DADOS DA TABELA ---
    const colunas = [
      "Produto",
      "Tipo / Categoria",
      "Qtd Atual",
      "Estoque Mínimo",
    ];

    const linhas = produtos.map((produto: any) => [
      produto.nome || "-",
      produto.tipo || produto.categoria || "-",
      produto.quantidade ?? 0,
      produto.estoque_minimo ?? 5,
    ]);

    // --- GERAÇÃO DA TABELA COM AUTOTABLE ---
    autoTable(doc, {
      head: [colunas],
      body: linhas,
      startY: 37,
      margin: { left: 14, right: 14 },
      styles: {
        font: "helvetica",
        fontSize: 9,
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
        0: { cellWidth: 80, fontStyle: "bold" }, // Produto
        1: { cellWidth: 50 }, // Tipo
        2: { cellWidth: 30, halign: "center" }, // Quantidade
        3: { cellWidth: 22, halign: "center" }, // Estoque Mínimo
      },
      // --- RODAPÉ AUTOMÁTICO EM CADA PÁGINA ---
      didDrawPage: () => {
        const paginasTotales = (doc as any).internal.getNumberOfPages();
        const paginaAtual = doc.getCurrentPageInfo().pageNumber;

        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.setTextColor(148, 163, 184); // Slate 400

        // Texto à esquerda no rodapé
        doc.text("Copystar Gestão de Estoque - Relatório de Produtos", 14, doc.internal.pageSize.height - 10);

        // Numeração de página à direita
        doc.text(
          `Página ${paginaAtual} de ${paginasTotales}`,
          doc.internal.pageSize.width - 14,
          doc.internal.pageSize.height - 10,
          { align: "right" }
        );
      },
    });

    doc.save("relatorio-estoque-copystar.pdf");
  }

  return (
    <button
      onClick={gerarPDF}
      className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2 text-sm shadow-sm"
    >
      <FileText size={18} />
      Exportar PDF
    </button>
  );
}