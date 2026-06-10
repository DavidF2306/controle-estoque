"use client";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function BotaoPDF({
  produtos,
}: any) {

  function gerarPDF() {
    const doc = new jsPDF();

    doc.setFontSize(20);

    doc.text(
      "Relatório de Estoque",
      14,
      20
    );

    doc.setFontSize(11);

    doc.text(
      `Gerado em: ${new Date().toLocaleDateString("pt-BR")}`,
      14,
      30
    );

    autoTable(doc, {
      startY: 40,

      head: [[
        "Produto",
        "Tipo",
        "Quantidade",
        "Categoria",
      ]],

      body: produtos.map((produto: any) => ([
        produto.nome,
        produto.tipo || "-",
        produto.quantidade,
        produto.categoria || "-",
      ])),
    });

    doc.save("relatorio-estoque.pdf");
  }

  return (
    <button
      onClick={gerarPDF}
      className="
        bg-blue-600
        hover:bg-blue-700
        text-white
        px-5
        py-3
        rounded-xl
        transition
      "
    >
      Exportar PDF
    </button>
  );
}