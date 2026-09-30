"use client";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { FileText } from "lucide-react";

interface Produto {
  id: number;
  nome: string;
  tipo?: string;
  quantidade: number;
  estoque_minimo?: number;
}

interface BotaoPDFProps {
  produtos: Produto[];
}

export default function BotaoPDF({ produtos }: BotaoPDFProps) {
  function gerarPDF() {
    const doc = new jsPDF();
    const dataHora = new Date().toLocaleString("pt-BR");

    // Métricas para o relatório
    const totalProdutos = produtos.length;
    const totalEstoque = produtos.reduce((acc, p) => acc + Number(p.quantidade || 0), 0);
    const estoqueBaixo = produtos.filter(
      (p) => Number(p.quantidade || 0) <= Number(p.estoque_minimo || 5)
    ).length;

    // --- CABEÇALHO ---
    doc.setFillColor(15, 23, 42); // slate-900
    doc.rect(0, 0, 210, 32, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("RELATÓRIO DE ESTOQUE DE PRODUTOS", 14, 18);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(148, 163, 184); // slate-400
    doc.text(`Gerado em: ${dataHora}`, 14, 26);

    // --- RESUMO / CARD DE MÉTRICAS ---
    doc.setFillColor(248, 250, 252); // slate-50
    doc.setDrawColor(226, 232, 240); // slate-200
    doc.roundedRect(14, 38, 182, 18, 2, 2, "FD");

    doc.setFontSize(9);
    doc.setTextColor(71, 85, 105); // slate-600

    doc.setFont("helvetica", "bold");
    doc.text("Total de Produtos:", 20, 49);
    doc.setFont("helvetica", "normal");
    doc.text(`${totalProdutos}`, 52, 49);

    doc.setFont("helvetica", "bold");
    doc.text("Itens em Estoque:", 80, 49);
    doc.setFont("helvetica", "normal");
    doc.text(`${totalEstoque} un.`, 112, 49);

    doc.setFont("helvetica", "bold");
    doc.text("Em Alerta / Baixo:", 142, 49);
    doc.setTextColor(217, 119, 6); // amber-600
    doc.setFont("helvetica", "bold");
    doc.text(`${estoqueBaixo}`, 174, 49);

    // --- MONTAGEM DA TABELA ---
    const linhas = produtos.map((produto, index) => {
      const baixo = Number(produto.quantidade || 0) <= Number(produto.estoque_minimo || 5);
      return [
        (index + 1).toString().padStart(2, "0"),
        produto.nome || "-",
        produto.tipo || "-",
        `${produto.quantidade || 0} un.`,
        `${produto.estoque_minimo || 5} un.`,
        baixo ? "ATENÇÃO" : "NORMAL",
      ];
    });

    autoTable(doc, {
      startY: 62,
      head: [["#", "Produto", "Categoria", "Qtd. Atual", "Qtd. Mínima", "Status"]],
      body: linhas,
      theme: "striped",
      headStyles: {
        fillColor: [30, 41, 59], // slate-800
        textColor: [255, 255, 255],
        fontStyle: "bold",
        fontSize: 9,
        halign: "left",
      },
      bodyStyles: {
        fontSize: 8.5,
        textColor: [51, 65, 85],
      },
      columnStyles: {
        0: { cellWidth: 12, halign: "center" },
        1: { cellWidth: 70 },
        2: { cellWidth: 35 },
        3: { cellWidth: 25, halign: "center" },
        4: { cellWidth: 25, halign: "center" },
        5: { cellWidth: 23, halign: "center" },
      },
      didParseCell: (data) => {
        // Formatação visual da coluna Status
        if (data.section === "body" && data.column.index === 5) {
          if (data.cell.raw === "ATENÇÃO") {
            data.cell.styles.textColor = [180, 83, 9]; // amber-700
            data.cell.styles.fontStyle = "bold";
          } else {
            data.cell.styles.textColor = [4, 120, 87]; // emerald-700
            data.cell.styles.fontStyle = "bold";
          }
        }
      },
      margin: { left: 14, right: 14 },
    });

    // --- RODAPÉ COM PAGINAÇÃO ---
    const pageCount = doc.internal.pages.length - 1;
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184);
      doc.text(
        `Página ${i} de ${pageCount}`,
        196,
        doc.internal.pageSize.height - 10,
        { align: "right" }
      );
    }

    doc.save("Relatorio_Produtos.pdf");
  }

  return (
    <button
      onClick={gerarPDF}
      className="bg-rose-600 hover:bg-rose-700 text-white px-4 py-2.5 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 shadow-sm text-sm"
    >
      <FileText size={18} />
      Exportar PDF
    </button>
  );
}