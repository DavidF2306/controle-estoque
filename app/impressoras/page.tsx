"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useRouter } from "next/navigation";

import {
  Printer,
  Plus,
  Search,
  Pencil,
  Trash2,
  Hash,
  MapPin,
  FileText,
  Download,
  Building2,
  BarChart3,
  Eye,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function Impressoras() {
  const [impressoras, setImpressoras] = useState<any[]>([]);
  const [locais, setLocais] = useState<any[]>([]);
  const router = useRouter();

  const [busca, setBusca] = useState("");
  const [localSelecionado, setLocalSelecionado] = useState("Todos");
  const [loading, setLoading] = useState(true);

  // Estados da Paginação
  const [paginaAtual, setPaginaAtual] = useState(1);
  const itensPorPagina = 10; // Exibe 10 impressoras por vez

  // Estados para o Dropdown Customizado de Locais
  const [dropdownAberto, setDropdownAberto] = useState(false);
  const [buscaLocal, setBuscaLocal] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    carregarDados();
  }, []);

  // Sempre que o usuário digitar uma busca ou mudar o local, volta para a página 1
  useEffect(() => {
    setPaginaAtual(1);
  }, [busca, localSelecionado]);

  // Fechar o dropdown de locais ao clicar fora dele
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownAberto(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function carregarDados() {
    setLoading(true);

    const { data: impressorasData } = await supabase
      .from("impressoras")
      .select("*")
      .order("local")
      .order("nome");

    const { data: locaisData } = await supabase
      .from("locais")
      .select("*")
      .order("nome");

    if (impressorasData) {
      setImpressoras(impressorasData);
    }

    if (locaisData) {
      setLocais(locaisData);
    }

    setLoading(false);
  }

  async function excluirImpressora(id: number) {
    const confirmar = confirm("Deseja realmente excluir esta impressora?");

    if (!confirmar) return;

    const { error } = await supabase.from("impressoras").delete().eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    carregarDados();
  }

  function exportarPDF() {
    const pdf = new jsPDF();

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(18);
    pdf.text("COPYSTAR", 14, 18);

    pdf.setFontSize(13);
    pdf.text("Relatório de Impressoras", 14, 28);

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(11);
    pdf.text(`Local: ${localSelecionado}`, 14, 38);
    pdf.text(`Total: ${impressorasFiltradas.length} impressoras`, 14, 45);
    pdf.text(`Data: ${new Date().toLocaleDateString("pt-BR")}`, 14, 52);

    autoTable(pdf, {
      startY: 60,
      head: [["Nome", "Modelo", "Local", "Série", "Contador"]],
      body: impressorasFiltradas.map((item) => [
        item.nome,
        item.modelo,
        item.local,
        item.numero_serie || "-",
        item.contador ?? 0,
      ]),
      styles: {
        fontSize: 9,
        cellPadding: 3,
      },
      headStyles: {
        fillColor: [30, 58, 138], // Azul escuro
      },
    });

    const nomeArquivo =
      localSelecionado === "Todos"
        ? "Relatorio_Impressoras.pdf"
        : `Relatorio_${localSelecionado}.pdf`;

    pdf.save(nomeArquivo);
  }

  function exportarExcel() {
    const dados = impressorasFiltradas.map((item) => ({
      Nome: item.nome,
      Modelo: item.modelo,
      Local: item.local,
      "Número de Série": item.numero_serie || "",
      Contador: item.contador ?? 0,
      Observações: item.observacoes || "",
    }));

    const worksheet = XLSX.utils.json_to_sheet(dados);

    worksheet["!cols"] = [
      { wch: 30 },
      { wch: 25 },
      { wch: 25 },
      { wch: 25 },
      { wch: 15 },
      { wch: 40 },
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Impressoras");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const nomeArquivo =
      localSelecionado === "Todos"
        ? "Impressoras.xlsx"
        : `Impressoras_${localSelecionado}.xlsx`;

    saveAs(blob, nomeArquivo);
  }

  // Lógica da Busca Principal
  const impressorasFiltradas = useMemo(() => {
    return impressoras.filter((item) => {
      const pesquisa =
        item.nome?.toLowerCase().includes(busca.toLowerCase()) ||
        item.modelo?.toLowerCase().includes(busca.toLowerCase()) ||
        item.numero_serie?.toLowerCase().includes(busca.toLowerCase()) ||
        item.local?.toLowerCase().includes(busca.toLowerCase());

      const filtroLocal =
        localSelecionado === "Todos" ? true : item.local === localSelecionado;

      return pesquisa && filtroLocal;
    });
  }, [impressoras, busca, localSelecionado]);

  // Lógica de Paginação na Lista Filtrada
  const totalPaginas = Math.ceil(impressorasFiltradas.length / itensPorPagina);
  const indexUltimoItem = paginaAtual * itensPorPagina;
  const indexPrimeiroItem = indexUltimoItem - itensPorPagina;
  const impressorasPaginadas = impressorasFiltradas.slice(indexPrimeiroItem, indexUltimoItem);

  // Lógica do Filtro Interno do Dropdown de Locais
  const locaisFiltradosParaDropdown = useMemo(() => {
    if (!buscaLocal) return locais;
    return locais.filter(l => l.nome.toLowerCase().includes(buscaLocal.toLowerCase()));
  }, [locais, buscaLocal]);

  const totalImpressoras = impressoras.length;
  const totalLocais = locais.length;
  const impressorasSemSerie = impressoras.filter((item) => !item.numero_serie).length;
  const impressorasSemContador = impressoras.filter((item) => !item.contador).length;

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-slate-500 dark:text-slate-400">
          <div className="w-8 h-8 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin" />
          <p className="font-medium">Carregando impressoras...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="text-slate-800 dark:text-slate-200 w-full overflow-x-hidden space-y-6">
      
      {/* Hero Section */}
      <section className="pt-14 md:pt-0">
        <div className="relative overflow-hidden rounded-2xl bg-slate-900 text-white shadow-md">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
          
          <div className="relative p-6 md:p-10 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-8">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-xl bg-white/10 border border-white/10 backdrop-blur-sm flex items-center justify-center shrink-0">
                <Printer size={32} className="text-blue-400" />
              </div>

              <div>
                <p className="text-slate-400 text-sm font-medium mb-1 tracking-wide uppercase">
                  Parque de Impressão
                </p>

                <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                  Impressoras
                </h1>

                <p className="text-slate-400 mt-2 text-sm md:text-base max-w-2xl">
                  Gerencie todas as impressoras cadastradas da empresa e seus respectivos locais.
                </p>
              </div>
            </div>

            <Link
              href="/impressoras/novo"
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 shadow-sm text-sm whitespace-nowrap"
            >
              <Plus size={18} />
              Nova Impressora
            </Link>
          </div>
        </div>
      </section>

      {/* Cards de Métricas */}
      <section className="grid xl:grid-cols-4 md:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total de Impressoras</p>
              <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mt-1">{totalImpressoras}</h2>
            </div>
            <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <Printer size={20} />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Locais Atendidos</p>
              <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mt-1">{totalLocais}</h2>
            </div>
            <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <Building2 size={20} />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Sem Nº de Série</p>
              <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mt-1">{impressorasSemSerie}</h2>
            </div>
            <div className="w-10 h-10 rounded-lg bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <Hash size={20} />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Sem Contador</p>
              <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mt-1">{impressorasSemContador}</h2>
            </div>
            <div className="w-10 h-10 rounded-lg bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
              <BarChart3 size={20} />
            </div>
          </div>
        </div>
      </section>

      {/* Filtros e Exportação */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
        <div className="grid lg:grid-cols-4 gap-4 items-end">
          
          <div className="lg:col-span-2">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Pesquisar Impressora ou Local
            </label>
            <div className="relative">
              <Search
                size={18}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                placeholder="Nome, modelo, série ou local..."
                className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg pl-10 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow text-slate-800 dark:text-slate-100"
              />
            </div>
          </div>

          {/* Dropdown Inteligente de Locais */}
          <div className="relative" ref={dropdownRef}>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Filtrar por Local Específico
            </label>
            <div
              onClick={() => setDropdownAberto(!dropdownAberto)}
              className={`w-full bg-white dark:bg-slate-950 border ${dropdownAberto ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-slate-200 dark:border-slate-700'} rounded-lg pl-10 pr-4 py-2.5 text-sm cursor-pointer flex items-center justify-between transition-all hover:border-blue-400`}
            >
              <MapPin size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <span className="truncate text-slate-700 dark:text-slate-200 ml-1">
                {localSelecionado === "Todos" ? "Todos os locais" : localSelecionado}
              </span>
              <ChevronDown size={16} className={`text-slate-400 transition-transform ${dropdownAberto ? 'rotate-180' : ''}`} />
            </div>

            {dropdownAberto && (
              <div className="absolute z-50 top-full mt-1.5 left-0 w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg shadow-xl overflow-hidden flex flex-col">
                <div className="p-2 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/80">
                  <div className="relative">
                    <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Procurar local na lista..."
                      value={buscaLocal}
                      onChange={(e) => setBuscaLocal(e.target.value)}
                      onClick={(e) => e.stopPropagation()} 
                      className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-md pl-8 pr-3 py-1.5 text-sm outline-none focus:border-blue-500 text-slate-800 dark:text-slate-100 placeholder-slate-400"
                    />
                  </div>
                </div>
                
                <div className="max-h-60 overflow-y-auto custom-scrollbar">
                  <button
                    type="button"
                    onClick={() => { setLocalSelecionado("Todos"); setDropdownAberto(false); setBuscaLocal(""); }}
                    className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${localSelecionado === "Todos" ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 font-semibold" : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50"}`}
                  >
                    Todos os locais
                  </button>
                  {locaisFiltradosParaDropdown.length === 0 ? (
                    <div className="px-4 py-3 text-sm text-slate-500 text-center">Nenhum local encontrado</div>
                  ) : (
                    locaisFiltradosParaDropdown.map(local => (
                      <button
                        key={local.id}
                        type="button"
                        onClick={() => { setLocalSelecionado(local.nome); setDropdownAberto(false); setBuscaLocal(""); }}
                        className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${localSelecionado === local.nome ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 font-semibold" : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50"}`}
                      >
                        {local.nome}
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Exportar Relatório
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={exportarPDF}
                className="flex-1 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-rose-50 dark:hover:bg-rose-900/20 hover:text-rose-600 dark:hover:text-rose-400 hover:border-rose-200 dark:hover:border-rose-800/50 rounded-lg py-2.5 text-sm font-semibold transition-colors flex items-center justify-center gap-2"
              >
                <FileText size={16} />
                PDF
              </button>
              <button
                type="button"
                onClick={exportarExcel}
                className="flex-1 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:text-emerald-600 dark:hover:text-emerald-400 hover:border-emerald-200 dark:hover:border-emerald-800/50 rounded-lg py-2.5 text-sm font-semibold transition-colors flex items-center justify-center gap-2"
              >
                <Download size={16} />
                Excel
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Lista de Impressoras Paginada */}
      <section className="space-y-4">
        {impressorasPaginadas.map((item) => (
          <div
            key={item.id}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex flex-col xl:flex-row xl:justify-between gap-6">
              <div className="space-y-4 flex-1">
                <div>
                  <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
                    {item.nome}
                  </h2>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-0.5">
                    Modelo: {item.modelo}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <div className="bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border border-blue-100 dark:border-blue-800/50 px-3 py-1.5 rounded-md flex items-center gap-1.5 text-xs font-semibold">
                    <MapPin size={14} />
                    {item.local}
                  </div>
                  <div className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded-md flex items-center gap-1.5 text-xs font-semibold">
                    <Hash size={14} />
                    {item.numero_serie || "Sem número de série"}
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div>
                    <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                      Contador
                    </p>
                    <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                      {item.contador || 0}
                    </h3>
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                      Observações
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                      {item.observacoes || "Nenhuma observação registrada."}
                    </p>
                  </div>
                </div>
              </div>

              {/* Botões de Ação do Card */}
              <div className="flex flex-col sm:flex-row xl:flex-col gap-2 min-w-[140px] shrink-0 border-t xl:border-t-0 xl:border-l border-slate-100 dark:border-slate-800 pt-4 xl:pt-0 xl:pl-6 justify-center">
                <button
                  onClick={() => router.push(`/impressoras/${item.id}`)}
                  className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900 px-4 py-2 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-colors"
                >
                  <Eye size={16} />
                  Ver Detalhes
                </button>

                <Link
                  href={`/impressoras/editar/${item.id}`}
                  className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-200 dark:hover:border-blue-800/50 px-4 py-2 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-colors"
                >
                  <Pencil size={16} />
                  Editar
                </Link>

                <button
                  onClick={() => excluirImpressora(item.id)}
                  className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-rose-50 dark:hover:bg-rose-900/30 hover:text-rose-600 dark:hover:text-rose-400 hover:border-rose-200 dark:hover:border-rose-800/50 px-4 py-2 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-colors"
                >
                  <Trash2 size={16} />
                  Excluir
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* Empty State */}
        {impressorasFiltradas.length === 0 && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-12 text-center shadow-sm">
            <Printer size={48} className="mx-auto text-slate-300 dark:text-slate-600 mb-4" />
            <h2 className="text-xl font-bold text-slate-700 dark:text-slate-200">
              Nenhuma impressora encontrada
            </h2>
            <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm">
              Não existem registros que correspondam aos filtros informados.
            </p>
            <Link
              href="/impressoras/novo"
              className="inline-flex mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg text-sm font-semibold items-center gap-2 transition-colors"
            >
              <Plus size={18} />
              Cadastrar Impressora
            </Link>
          </div>
        )}

        {/* Controles de Paginação */}
        {totalPaginas > 1 && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm mt-4">
            <p className="text-sm text-slate-500 dark:text-slate-400 text-center sm:text-left">
              Mostrando <span className="font-bold text-slate-800 dark:text-slate-200">{indexPrimeiroItem + 1}</span> a <span className="font-bold text-slate-800 dark:text-slate-200">{Math.min(indexUltimoItem, impressorasFiltradas.length)}</span> de <span className="font-bold text-slate-800 dark:text-slate-200">{impressorasFiltradas.length}</span> resultados
            </p>
            
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => setPaginaAtual(prev => Math.max(prev - 1, 1))}
                disabled={paginaAtual === 1}
                className="p-2 rounded-md border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={18} />
              </button>
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300 px-3">
                Página {paginaAtual} de {totalPaginas}
              </span>
              <button
                onClick={() => setPaginaAtual(prev => Math.min(prev + 1, totalPaginas))}
                disabled={paginaAtual === totalPaginas}
                className="p-2 rounded-md border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}