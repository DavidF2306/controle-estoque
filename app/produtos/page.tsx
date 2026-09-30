"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import BotaoPDF from "../components/BotaoPDF";

import * as XLSX from "xlsx";
import {
  Package,
  Plus,
  Search,
  Pencil,
  Trash2,
  FileSpreadsheet,
  AlertTriangle,
  Archive,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function Produtos() {
  const [produtos, setProdutos] = useState<any[]>([]);
  const [busca, setBusca] = useState("");
  const [paginaAtual, setPaginaAtual] = useState(1);
  const ITENS_POR_PAGINA = 10;

  useEffect(() => {
    buscarProdutos();
  }, []);

  async function buscarProdutos() {
    const { data } = await supabase
      .from("produtos")
      .select("*")
      .order("nome");

    if (data) setProdutos(data);
  }

  async function excluirProduto(id: number) {
    const confirmar = confirm("Deseja realmente excluir este produto?");
    if (!confirmar) return;

    await supabase.from("entradas").delete().eq("produto_id", id);
    await supabase.from("saidas").delete().eq("produto_id", id);
    await supabase.from("produtos").delete().eq("id", id);

    buscarProdutos();
  }

  function estaBaixo(produto: any) {
    return Number(produto.quantidade || 0) <= Number(produto.estoque_minimo || 5);
  }

  function exportarExcel() {
    const dados = produtos.map((produto) => ({
      Produto: produto.nome,
      Tipo: produto.tipo || "-",
      Quantidade: produto.quantidade,
      "Estoque Mínimo": produto.estoque_minimo || 5,
      Status: estaBaixo(produto) ? "Estoque Baixo" : "Normal",
    }));

    const worksheet = XLSX.utils.json_to_sheet(dados);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Produtos");
    XLSX.writeFile(workbook, "Produtos.xlsx");
  }

  // Filtro
  const produtosFiltrados = produtos.filter(
    (produto) =>
      produto.nome?.toLowerCase().includes(busca.toLowerCase()) ||
      produto.tipo?.toLowerCase().includes(busca.toLowerCase())
  );

  // Lógica de Paginação
  const totalPaginas = Math.ceil(produtosFiltrados.length / ITENS_POR_PAGINA) || 1;
  const inicio = (paginaAtual - 1) * ITENS_POR_PAGINA;
  const fim = inicio + ITENS_POR_PAGINA;
  const produtosExibidos = produtosFiltrados.slice(inicio, fim);

  // Mudar de busca reseta a página para a 1
  const handleBusca = (valor: string) => {
    setBusca(valor);
    setPaginaAtual(1);
  };

  // Métricas gerais
  const totalProdutos = produtos.length;
  const totalEstoque = produtos.reduce(
    (total, produto) => total + Number(produto.quantidade || 0),
    0
  );
  const estoqueBaixo = produtos.filter((produto) => estaBaixo(produto)).length;
  const estoqueNormal = totalProdutos - estoqueBaixo;

  return (
    <div className="text-slate-800 dark:text-slate-100 w-full overflow-x-hidden space-y-6">
      
      {/* Hero Section */}
      <section className="pt-14 md:pt-0">
        <div className="relative overflow-hidden rounded-2xl bg-slate-900 text-white shadow-md border border-slate-800">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
          
          <div className="relative p-6 md:p-10 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-8">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-xl bg-white/10 border border-white/10 backdrop-blur-sm flex items-center justify-center shrink-0">
                <Package size={32} className="text-blue-400" />
              </div>

              <div>
                <p className="text-slate-400 text-sm font-medium mb-1 tracking-wide uppercase">
                  Catálogo
                </p>

                <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                  Gestão de Produtos
                </h1>

                <p className="text-slate-400 mt-2 text-sm md:text-base max-w-2xl">
                  Administre toners, cartuchos, cilindros e controle os níveis mínimos de suprimentos.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full xl:w-auto">
              <BotaoPDF produtos={produtos} />

              <button
                onClick={exportarExcel}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 shadow-sm text-sm"
              >
                <FileSpreadsheet size={18} />
                Exportar Excel
              </button>

              <Link
                href="/produtos/novo"
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-semibold transition-colors text-center flex items-center justify-center gap-2 shadow-sm text-sm"
              >
                <Plus size={18} />
                Novo Produto
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Cards de Métricas */}
      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Produtos Cadastrados</p>
          <h2 className="text-3xl font-bold text-slate-800 dark:text-white mt-1">{totalProdutos}</h2>
          <p className="text-xs text-slate-400 mt-1">itens no sistema</p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Estoque Físico</p>
          <h2 className="text-3xl font-bold text-slate-800 dark:text-white mt-1">{totalEstoque}</h2>
          <p className="text-xs text-slate-400 mt-1">unidades totais</p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Estoque Saudável</p>
          <h2 className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">{estoqueNormal}</h2>
          <p className="text-xs text-slate-400 mt-1">produtos acima do mínimo</p>
        </div>

        <div className="bg-white dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-500/40 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10 dark:opacity-20 text-amber-600 dark:text-amber-400">
            <AlertTriangle size={64} />
          </div>
          <p className="text-sm font-medium text-slate-500 dark:text-amber-300/80 relative z-10">Atenção Necessária</p>
          <h2 className="text-3xl font-bold text-amber-600 dark:text-amber-400 mt-1 relative z-10">
            {estoqueBaixo}
          </h2>
          <p className="text-xs text-amber-600/70 dark:text-amber-400/80 font-medium mt-1 relative z-10">produtos em baixa</p>
        </div>
      </section>

      {/* Barra de Busca */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm flex flex-col md:flex-row md:items-center gap-4">
        <div className="flex-1 w-full relative">
          <Search
            size={18}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            placeholder="Buscar por nome ou categoria..."
            value={busca}
            onChange={(e) => handleBusca(e.target.value)}
            className="w-full border border-slate-200 dark:border-slate-700 dark:bg-slate-800/80 dark:text-white rounded-lg pl-10 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
          />
        </div>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 whitespace-nowrap">
          {produtosFiltrados.length} resultados
        </p>
      </section>

      {/* Lista Mobile */}
      <section className="xl:hidden space-y-4">
        {produtosExibidos.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-8 text-center text-slate-500 dark:text-slate-400 shadow-sm">
            <Archive size={32} className="mx-auto mb-3 text-slate-300 dark:text-slate-600" />
            Nenhum produto encontrado.
          </div>
        ) : (
          produtosExibidos.map((produto) => {
            const baixo = estaBaixo(produto);

            return (
              <div
                key={produto.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm flex flex-col gap-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="font-bold text-slate-800 dark:text-white leading-tight">
                      {produto.nome}
                    </h2>
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">
                      Categoria: {produto.tipo || "-"}
                    </p>
                  </div>
                  <span
                    className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider whitespace-nowrap border ${
                      baixo
                        ? "bg-amber-100 text-amber-900 border-amber-300 dark:!bg-amber-500/25 dark:!text-amber-300 dark:!border-amber-400/60"
                        : "bg-emerald-100 text-emerald-900 border-emerald-300 dark:!bg-emerald-500/25 dark:!text-emerald-300 dark:!border-emerald-400/60"
                    }`}
                  >
                    {baixo ? "Atenção" : "Normal"}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-800">
                  <div>
                    <p className="text-[11px] font-semibold uppercase text-slate-500 dark:text-slate-400 mb-0.5">Em Estoque</p>
                    <p
                      className={`font-bold text-lg ${
                        baixo ? "text-amber-600 dark:!text-amber-400" : "text-slate-800 dark:text-slate-100"
                      }`}
                    >
                      {produto.quantidade} <span className="text-sm font-medium text-slate-500 dark:text-slate-400">un.</span>
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold uppercase text-slate-500 dark:text-slate-400 mb-0.5">Mínimo Ideal</p>
                    <p className="font-bold text-lg text-slate-800 dark:text-slate-100">
                      {produto.estoque_minimo || 5} <span className="text-sm font-medium text-slate-500 dark:text-slate-400">un.</span>
                    </p>
                  </div>
                </div>

                <div className="flex gap-2 pt-1">
                  <Link
                    href={`/produtos/editar/${produto.id}`}
                    className="flex-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 rounded-lg transition-colors flex items-center justify-center gap-2 font-semibold text-sm shadow-sm"
                  >
                    <Pencil size={15} />
                    Editar
                  </Link>

                  <button
                    onClick={() => excluirProduto(produto.id)}
                    className="flex-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-rose-50 dark:hover:bg-rose-950/30 hover:text-rose-600 dark:hover:text-rose-400 hover:border-rose-200 dark:hover:border-rose-800 px-3 py-2 rounded-lg transition-colors flex items-center justify-center gap-2 font-semibold text-sm shadow-sm"
                  >
                    <Trash2 size={15} />
                    Excluir
                  </button>
                </div>
              </div>
            );
          })
        )}
      </section>

      {/* Tabela Desktop */}
      <section className="hidden xl:block bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden">
        {produtosExibidos.length === 0 ? (
          <div className="p-12 text-center text-slate-500 dark:text-slate-400">
            <Archive size={40} className="mx-auto mb-3 text-slate-300 dark:text-slate-600" />
            Nenhum produto encontrado.
          </div>
        ) : (
          <table className="w-full text-sm text-left min-w-[850px]">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 font-medium border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-6 py-4">Produto</th>
                <th className="px-6 py-4">Categoria/Tipo</th>
                <th className="px-6 py-4">Quantidade Atual</th>
                <th className="px-6 py-4">Estoque Mínimo</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Ações</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {produtosExibidos.map((produto) => {
                const baixo = estaBaixo(produto);

                return (
                  <tr
                    key={produto.id}
                    className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="px-6 py-4 font-semibold text-slate-800 dark:text-slate-100">
                      {produto.nome}
                    </td>

                    <td className="px-6 py-4 text-slate-600 dark:text-slate-400">
                      {produto.tipo || "-"}
                    </td>

                    <td
                      className={`px-6 py-4 font-bold ${
                        baixo ? "text-amber-600 dark:!text-amber-400" : "text-slate-800 dark:text-slate-200"
                      }`}
                    >
                      {produto.quantidade} un.
                    </td>

                    <td className="px-6 py-4 text-slate-500 dark:text-slate-400 font-medium">
                      {produto.estoque_minimo || 5} un.
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider border ${
                          baixo
                            ? "bg-amber-100 text-amber-900 border-amber-300 dark:!bg-amber-500/30 dark:!text-amber-300 dark:!border-amber-400/60"
                            : "bg-emerald-100 text-emerald-900 border-emerald-300 dark:!bg-emerald-500/30 dark:!text-emerald-300 dark:!border-emerald-400/60"
                        }`}
                      >
                        {baixo ? "Atenção" : "Normal"}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/produtos/editar/${produto.id}`}
                          title="Editar"
                          className="p-2 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-lg transition-colors border border-transparent hover:border-blue-100 dark:hover:border-blue-900/50"
                        >
                          <Pencil size={16} />
                        </Link>

                        <button
                          onClick={() => excluirProduto(produto.id)}
                          title="Excluir"
                          className="p-2 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors border border-transparent hover:border-rose-100 dark:hover:border-rose-900/50"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </section>

      {/* Controle de Paginação */}
      {produtosFiltrados.length > 0 && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Mostrando <span className="font-semibold text-slate-800 dark:text-slate-200">{inicio + 1}</span> até{" "}
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              {Math.min(fim, produtosFiltrados.length)}
            </span>{" "}
            de <span className="font-semibold text-slate-800 dark:text-slate-200">{produtosFiltrados.length}</span> produtos
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPaginaAtual((prev) => Math.max(prev - 1, 1))}
              disabled={paginaAtual === 1}
              className="p-2 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-slate-600 dark:text-slate-300"
              title="Página Anterior"
            >
              <ChevronLeft size={18} />
            </button>

            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 px-3">
              Página {paginaAtual} de {totalPaginas}
            </span>

            <button
              onClick={() => setPaginaAtual((prev) => Math.min(prev + 1, totalPaginas))}
              disabled={paginaAtual === totalPaginas}
              className="p-2 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-slate-600 dark:text-slate-300"
              title="Próxima Página"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}

    </div>
  );
}