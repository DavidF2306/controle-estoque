"use client";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function BotaoPDFHistorico({
  movimentacoes,
  mesFiltro,
}: any) {
  function formatarDataHora(data: string) {
    const dataCorrigida = new Date(data);
    dataCorrigida.setHours(dataCorrigida.getHours() - 3);

    return dataCorrigida.toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function gerarPDF() {
    const doc = new jsPDF({
      orientation: "landscape",
    });

    const tituloMes = mesFiltro
      ? mesFiltro.split("-").reverse().join("/")
      : "Todos os períodos";

    doc.setFontSize(18);

    doc.text(
      "Relatório Mensal de Movimentações",
      14,
      20
    );

    doc.setFontSize(10);

    doc.text(
      `Período: ${tituloMes}`,
      14,
      30
    );

    doc.text(
      `Gerado em: ${new Date().toLocaleDateString("pt-BR")}`,
      14,
      37
    );

    autoTable(doc, {
      startY: 46,

      head: [[
        "Tipo",
        "Produto",
        "Qtd",
        "Cliente",
        "Local/Origem",
        "NF",
        "Contador",
        "Observações",
        "Data/Hora",
      ]],

      body: movimentacoes.map((mov: any) => ([
        mov.tipo,
        mov.produto,
        mov.quantidade,
        mov.cliente,
        mov.local,
        mov.notaFiscal,
        mov.contador,
        mov.observacoes,
        formatarDataHora(mov.data),
      ])),

      styles: {
        fontSize: 7,
        cellPadding: 2,
        overflow: "linebreak",
      },

      headStyles: {
        fontSize: 7,
      },

      columnStyles: {
        1: { cellWidth: 42 },
        3: { cellWidth: 35 },
        4: { cellWidth: 35 },
        7: { cellWidth: 45 },
        8: { cellWidth: 28 },
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
        rounded-2xl
        transition
        w-full
        md:w-auto
        font-medium
      "
    >
      Exportar PDF Mensal
    </button>
  );
}