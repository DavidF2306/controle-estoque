"use client";

import * as XLSX from "xlsx";
import { FileSpreadsheet } from "lucide-react";

interface BotaoExcelHistoricoProps {
  movimentacoes?: any[];
  historico?: any[];
  mesFiltro?: string;
}

export default function BotaoExcelHistorico({
  movimentacoes,
  historico,
  mesFiltro,
}: BotaoExcelHistoricoProps) {
  const exportarExcel = () => {
    const lista = movimentacoes || historico || [];

    if (lista.length === 0) {
      alert("Nenhuma movimentação para exportar.");
      return;
    }

    // Mapear os dados verificando todas as variações de nomes vindos da BD
    const dadosFormatados = lista.map((item) => {
      // 1. Data e Hora
      const rawData =
        item.created_at ||
        item.data ||
        item.data_movimentacao ||
        item.data_criacao ||
        item.data_entrada ||
        item.data_saida ||
        item.createdAt ||
        item.date;

      let dataFormatada = "-";
      if (rawData) {
        if (typeof rawData === "string" && rawData.includes("/")) {
          dataFormatada = rawData;
        } else {
          const d = new Date(rawData);
          if (!isNaN(d.getTime())) {
            dataFormatada = d.toLocaleString("pt-BR", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            });
          } else {
            dataFormatada = String(rawData);
          }
        }
      }

      // 2. Nome do Produto
      let nomeDoProduto = "-";
      if (item.produtos) {
        nomeDoProduto = Array.isArray(item.produtos)
          ? item.produtos[0]?.nome
          : item.produtos?.nome;
      } else if (item.produto) {
        nomeDoProduto =
          typeof item.produto === "object"
            ? Array.isArray(item.produto)
              ? item.produto[0]?.nome
              : item.produto?.nome
            : item.produto;
      }

      if (!nomeDoProduto || nomeDoProduto === "-") {
        nomeDoProduto =
          item.produto_nome ||
          item.nome_produto ||
          item.nomeProduto ||
          item.produtoNome ||
          item.nome ||
          "-";
      }

      // 3. Classificação (Original / Compatível)
      let classificacaoBruta =
        item.classificacao ||
        item.tipoProduto ||
        item.tipo_produto ||
        item.tipoItem ||
        item.categoria ||
        (item.produtos && (item.produtos.tipo || item.produtos.classificacao)) ||
        "";

      let classificacaoFinal = "-";

      if (classificacaoBruta && classificacaoBruta !== "-") {
        classificacaoFinal = String(classificacaoBruta).toUpperCase();
      } else {
        // Fallback inteligente baseando-se no nome do produto
        const nomeProdLower = String(nomeDoProduto || "").toLowerCase();
        if (nomeProdLower.includes("compativel") || nomeProdLower.includes("compatível")) {
          classificacaoFinal = "COMPATÍVEL";
        } else if (nomeDoProduto && nomeDoProduto !== "-") {
          classificacaoFinal = "ORIGINAL";
        }
      }

      // 4. Local / Origem / Destino
      const localOrigem =
        item.local_origem ||
        item.origem ||
        item.destino ||
        item.local_destino ||
        item.local ||
        item.fornecedor ||
        item.setor ||
        item.cliente ||
        "-";

      // 5. Nota Fiscal
      const notaFiscal =
        item.nota_fiscal ||
        item.nf ||
        item.numero_nf ||
        item.num_nota ||
        item.notaFiscal ||
        "-";

      // 6. Contador
      const contador =
        item.contador ||
        item.contador_impressora ||
        item.contador_inicial ||
        "-";

      // 7. Observação
      const observacao =
        item.observacao ||
        item.observacoes ||
        item.obs ||
        "-";

      // 8. Realizado Por / Utilizador
      const realizadoPor =
        item.usuario ||
        item.realizado_por ||
        item.usuario_nome ||
        item.nome_usuario ||
        item.created_by ||
        item.user ||
        (typeof item.usuarios === "object" ? item.usuarios?.nome : item.usuarios) ||
        (typeof item.profiles === "object" ? item.profiles?.nome : item.profiles) ||
        "-";

      return {
        "Tipo": item.tipo ? String(item.tipo).toUpperCase() : "-",
        "Produto": nomeDoProduto,
        "Classificação": classificacaoFinal,
        "Qtd": item.quantidade ?? 0,
        "Local / Origem": localOrigem,
        "NF": notaFiscal,
        "Contador": contador,
        "Observações": observacao,
        "Realizado por": realizadoPor,
        "Data e Hora": dataFormatada,
      };
    });

    // Criar a folha do Excel
    const worksheet = XLSX.utils.json_to_sheet(dadosFormatados);

    // Definir a largura ideal das colunas
    worksheet["!cols"] = [
      { wch: 12 }, // Tipo
      { wch: 38 }, // Produto
      { wch: 16 }, // Classificação
      { wch: 10 }, // Qtd
      { wch: 32 }, // Local / Origem
      { wch: 14 }, // NF
      { wch: 14 }, // Contador
      { wch: 35 }, // Observações
      { wch: 20 }, // Realizado por
      { wch: 18 }, // Data e Hora
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Histórico");

    const nomeArquivo = mesFiltro
      ? `Historico_Movimentacoes_${mesFiltro}.xlsx`
      : "Historico_Movimentacoes.xlsx";

    XLSX.writeFile(workbook, nomeArquivo);
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