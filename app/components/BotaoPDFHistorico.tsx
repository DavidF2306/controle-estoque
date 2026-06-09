"use client";

import jsPDF from "jspdf";

import autoTable from "jspdf-autotable";

export default function BotaoPDFHistorico({
  movimentacoes,
}: any) {

  function gerarPDF() {

    const doc = new jsPDF();

    doc.setFontSize(20);

    doc.text(
      "Relatório de Movimentações",
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
        "Tipo",
        "Produto",
        "Quantidade",
        "Origem/Destino",
        "Data",
      ]],

      body: movimentacoes.map(
        (mov: any) => ([
          mov.tipo,
          mov.produto,
          mov.quantidade,
          mov.local,
          new Date(
            mov.data
          ).toLocaleDateString("pt-BR"),
        ])
      ),

    });

    doc.save(
      "historico-movimentacoes.pdf"
    );
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
      Exportar Histórico PDF
    </button>

  );
}