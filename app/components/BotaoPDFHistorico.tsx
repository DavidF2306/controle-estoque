"use client";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function BotaoPDFHistorico({
  movimentacoes,
  mesFiltro,
}: any) {

  function gerarPDF() {
    const doc = new jsPDF({
      orientation: "landscape",
    });

    const tituloMes = mesFiltro
      ? mesFiltro.split("-").reverse().join("/")
      : "Todos os períodos";

    doc.setFontSize(20);

    doc.text(
      "Relatório Mensal de Movimentações",
      14,
      20
    );

    doc.setFontSize(11);

    doc.text(
      `Período: ${tituloMes}`,
      14,
      30
    );

    doc.text(
      `Gerado em: ${new Date().toLocaleDateString("pt-BR")}`,
      14,
      38
    );

    autoTable(doc, {
      startY: 48,

      head: [[
        "Tipo",
        "Produto",
        "Qtd",
        "Cliente",
        "Local/Origem",
        "Nota Fiscal",
        "Contador",
        "Data",
      ]],

      body: movimentacoes.map((mov: any) => ([
        mov.tipo,
        mov.produto,
        mov.quantidade,
        mov.cliente,
        mov.local,
        mov.notaFiscal,
        mov.contador,
        new Date(mov.data).toLocaleString("pt-BR", {
  timeZone: "America/Sao_Paulo",
  dateStyle: "short",
  timeStyle: "short",
}),
      ])),

      styles: {
        fontSize: 8,
      },

      headStyles: {
        fontSize: 8,
      },
    });

    const nomeArquivo = mesFiltro
      ? `historico-${mesFiltro}.pdf`
      : "historico-movimentacoes.pdf";

    doc.save(nomeArquivo);
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
        w-full
        md:w-auto
      "
    >
      Exportar PDF Mensal
    </button>
  );
}