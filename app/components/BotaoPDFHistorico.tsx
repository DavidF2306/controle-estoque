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

    // Orientação "landscape" (deitado) para A4
    const doc = new jsPDF("landscape", "mm", "a4");

    // Cores corporativas
    const corPrimaria = [30, 58, 138];
    const corTextoCinza = [100, 116, 139];
    const corLinhaBorda = [226, 232, 240];

    // --- CABEÇALHO DO DOCUMENTO ---
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.setTextColor(corPrimaria[0], corPrimaria[1], corPrimaria[2]);
    doc.text("COPYSTAR", 14, 16);

    doc.setFontSize(12);
    doc.setTextColor(51, 65, 85);
    doc.text("Relatório de Auditoria - Histórico de Movimentações", 14, 23);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(corTextoCinza[0], corTextoCinza[1], corTextoCinza[2]);

    let periodoTexto = "Período: Todo o histórico cadastrado";
    if (mesFiltro) {
      const [ano, mes] = mesFiltro.split("-");
      periodoTexto = `Período Filtrado: Mês ${mes}/${ano}`;
    }

    const dataEmissao = `Emitido em: ${new Date().toLocaleDateString("pt-BR")} às ${new Date().toLocaleTimeString("pt-BR", { hour: '2-digit', minute: '2-digit' })}`;

    doc.text(periodoTexto, 14, 29);
    doc.text(dataEmissao, 283 - 14, 29, { align: "right" });

    // Linha divisória
    doc.setDrawColor(corLinhaBorda[0], corLinhaBorda[1], corLinhaBorda[2]);
    doc.setLineWidth(0.5);
    doc.line(14, 33, 283 - 14, 33);

    // --- PREPARAÇÃO DOS DADOS DA TABELA ---
    const colunas = [
      "Tipo",
      "Produto",
      "Classificação",
      "Qtd",
      "Local / Origem",
      "Solicitante", // <--- Nova coluna adicionada
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

      // 1. Tenta extrair a classificação de qualquer propriedade possível
      let classificacaoBruta = 
        mov.classificacao || 
        mov.tipoProduto || 
        mov.tipo_produto || 
        mov.tipoItem || 
        mov.categoria || 
        (mov.produtos && (mov.produtos.tipo || mov.produtos.classificacao)) ||
        "";

      let classificacaoFinal = "-";

      // 2. Se encontrou um valor válido e diferente de "-", padroniza
      if (classificacaoBruta && classificacaoBruta !== "-") {
        classificacaoFinal = String(classificacaoBruta).toUpperCase();
      } else {
        // 3. Fallback inteligente: verifica se o nome do produto especifica "Compatível"
        const nomeProduto = String(mov.produto || "").toLowerCase();
        if (nomeProduto.includes("compativel") || nomeProduto.includes("compatível")) {
          classificacaoFinal = "COMPATÍVEL";
        } else if (nomeProduto) {
          classificacaoFinal = "ORIGINAL";
        }
      }

      return [
        mov.tipo ? String(mov.tipo).toUpperCase() : "-",
        mov.produto || "-",
        classificacaoFinal,
        mov.quantidade || 0,
        mov.local || "-",
        mov.solicitante || "-", // <--- Novo dado puxado do objeto
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
        cellPadding: 3.5,
        textColor: [51, 65, 85],
        overflow: "linebreak",
      },
      headStyles: {
        fillColor: [30, 58, 138],
        textColor: [255, 255, 255],
        fontStyle: "bold",
        halign: "left",
      },
      alternateRowStyles: {
        fillColor: [248, 250, 252],
      },
      // Larguras reajustadas para comportar a nova coluna "Solicitante" (Total mantido: 269mm)
      columnStyles: {
        0: { cellWidth: 20, fontStyle: "bold" }, // Tipo 
        1: { cellWidth: 40 },                    // Produto
        2: { cellWidth: 26, fontStyle: "bold" }, // Classificação 
        3: { cellWidth: 12, halign: "center" },  // Qtd
        4: { cellWidth: 28 },                    // Local / Origem
        5: { cellWidth: 25 },                    // Solicitante <-- Adicionado aqui
        6: { cellWidth: 18 },                    // NF
        7: { cellWidth: 18 },                    // Contador
        8: { cellWidth: 34 },                    // Observações
        9: { cellWidth: 24 },                    // Realizado por
        10: { cellWidth: 24 },                   // Data / Hora
      },
      didDrawPage: () => {
        const paginasTotais = (doc as any).internal.getNumberOfPages();
        const paginaAtual = doc.getCurrentPageInfo().pageNumber;

        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.setTextColor(148, 163, 184);

        doc.text("Copystar Gestão de Estoque - Relatório Confidencial", 14, doc.internal.pageSize.height - 10);

        doc.text(
          `Página ${paginaAtual} de ${paginasTotais}`,
          doc.internal.pageSize.width - 14,
          doc.internal.pageSize.height - 10,
          { align: "right" }
        );
      },
    });

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