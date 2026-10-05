"use client";

import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import {
  ArrowDownCircle,
  Save,
  ArrowLeft,
  Package,
  Boxes,
  FileText,
  ClipboardList,
  Truck,
  CheckCircle,
  Search,
  ChevronDown,
} from "lucide-react";

export default function Entradas() {
  const router = useRouter();

  const [produtos, setProdutos] = useState<any[]>([]);
  const [entradas, setEntradas] = useState<any[]>([]);

  const [produtoId, setProdutoId] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [origem, setOrigem] = useState("");
  const [notaFiscal, setNotaFiscal] = useState("");
  const [contador, setContador] = useState("");
  const [observacoes, setObservacoes] = useState("");

  const [buscaProduto, setBuscaProduto] = useState("");
  const [produtoDropdownOpen, setProdutoDropdownOpen] = useState(false);
  const produtoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    buscarDados();

    function handleClickOutside(event: MouseEvent) {
      if (
        produtoRef.current &&
        !produtoRef.current.contains(event.target as Node)
      ) {
        setProdutoDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  async function buscarDados() {
    const { data: produtosData } = await supabase
      .from("produtos")
      .select("*")
      .order("nome");

    const { data: entradasData } = await supabase
      .from("entradas")
      .select("*")
      .order("created_at", { ascending: false });

    if (produtosData) setProdutos(produtosData);
    if (entradasData) setEntradas(entradasData);
  }

  async function registrarEntrada(e: React.FormEvent) {
    e.preventDefault();

    if (!produtoId) {
      alert("Por favor, pesquise e selecione um produto.");
      return;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const emailUsuario = user?.email || "Usuário não identificado";

    const produtoSelecionado = produtos.find(
      (produto) => produto.id === Number(produtoId)
    );

    if (!produtoSelecionado) {
      alert("Produto não encontrado no sistema.");
      return;
    }

    const novaQuantidade =
      Number(produtoSelecionado.quantidade) + Number(quantidade);

    const { error: erroEntrada } = await supabase.from("entradas").insert([
      {
        produto_id: Number(produtoId),
        quantidade: Number(quantidade),
        origem,
        nota_fiscal: notaFiscal || null,
        contador: contador || null,
        observacoes: observacoes || null,
        usuario_email: emailUsuario,
      },
    ]);

    if (erroEntrada) {
      alert("Erro ao registrar entrada: " + erroEntrada.message);
      return;
    }

    const { error: erroProduto } = await supabase
      .from("produtos")
      .update({
        quantidade: novaQuantidade,
      })
      .eq("id", produtoId);

    if (erroProduto) {
      alert("Erro ao atualizar estoque: " + erroProduto.message);
      return;
    }

    alert("Entrada registrada com sucesso!");
    router.push("/produtos");
  }

  const totalProdutos = produtos.length;

  const totalEstoque = produtos.reduce(
    (total, produto) => total + Number(produto.quantidade || 0),
    0
  );

  const ultimaEntrada = entradas[0];

  const produtoSelecionado = produtos.find(
    (produto) => produto.id === Number(produtoId)
  );

  const produtosFiltrados = produtos.filter((produto) => {
    const termo = buscaProduto.toLowerCase();
    const nome = produto.nome ? produto.nome.toLowerCase() : "";
    const tipo = produto.tipo ? produto.tipo.toLowerCase() : "";
    const categoria = produto.categoria ? produto.categoria.toLowerCase() : "";

    return (
      nome.includes(termo) ||
      tipo.includes(termo) ||
      categoria.includes(termo)
    );
  });

  return (
    <div className="text-slate-800 w-full overflow-x-hidden space-y-6 pb-10">
      {/* Hero Section */}
      <section className="pt-2 md:pt-0">
        <div className="relative overflow-hidden rounded-2xl bg-slate-900 border border-slate-800 text-white shadow-sm">
          <div className="pointer-events-none absolute -top-12 -right-12 w-80 h-80 bg-emerald-500/10 rounded-full blur-2xl" />

          <div className="relative p-6 md:p-8 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 rounded-xl bg-slate-800 border border-slate-700/80 flex items-center justify-center shrink-0">
                <ArrowDownCircle size={28} className="text-emerald-400" />
              </div>

              <div>
                <p className="text-slate-400 text-xs font-semibold mb-1 tracking-wider uppercase">
                  Movimentação
                </p>

                <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
                  Entrada de Estoque
                </h1>

                <p className="text-slate-400 mt-1 text-sm max-w-2xl">
                  Registre novos suprimentos recebidos, atualize quantidades e mantenha o catálogo sincronizado.
                </p>
              </div>
            </div>

            <div className="bg-slate-800/60 border border-slate-700/80 rounded-xl p-4 min-w-[220px]">
              <p className="text-slate-400 text-xs font-medium">
                Total de entradas
              </p>

              <div className="flex items-end gap-2 mt-1">
                <p className="text-2xl font-bold text-white">
                  {entradas.length}
                </p>
                <p className="text-slate-400 text-xs mb-0.5">registros</p>
              </div>

              <div className="mt-3 pt-3 border-t border-slate-700/80">
                <p className="text-xs font-medium text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle size={14} />
                  {ultimaEntrada
                    ? "Sistema operacional e sincronizado."
                    : "Nenhuma entrada registrada ainda."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cards de Métricas */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-sm flex items-start justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Produtos</p>
            <h2 className="text-2xl font-bold text-slate-900 mt-1">
              {totalProdutos}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              disponíveis no catálogo
            </p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center">
            <Package size={20} />
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-sm flex items-start justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Estoque Geral</p>
            <h2 className="text-2xl font-bold text-slate-900 mt-1">
              {totalEstoque}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">unidades totais</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center">
            <Boxes size={20} />
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-sm flex items-start justify-between relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Status do Módulo
            </p>
            <h2 className="text-2xl font-bold text-emerald-600 mt-1">
              Operante
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              pronto para registros
            </p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center">
            <CheckCircle size={20} />
          </div>
        </div>
      </section>

      {/* Formulário */}
      <form
        onSubmit={registrarEntrada}
        className="bg-white border border-slate-200/80 rounded-xl p-5 md:p-6 shadow-sm space-y-6 w-full relative"
      >
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
            <ClipboardList size={20} />
          </div>

          <div>
            <h2 className="text-base font-bold text-slate-900">
              Dados da Entrada
            </h2>
            <p className="text-xs text-slate-500">
              Preencha os dados do suprimento recebido para adicionar ao estoque.
            </p>
          </div>
        </div>

        {/* Dropdown com Busca */}
        <div className="bg-slate-50/70 border border-slate-200/80 rounded-lg p-4">
          <div className="relative" ref={produtoRef}>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Selecione o Produto <span className="text-rose-500">*</span>
            </label>

            <div
              onClick={() => setProdutoDropdownOpen(!produtoDropdownOpen)}
              className={`w-full bg-white border ${
                produtoDropdownOpen
                  ? "border-emerald-500 ring-2 ring-emerald-500/20"
                  : "border-slate-300"
              } rounded-lg px-4 py-2.5 text-sm flex justify-between items-center cursor-pointer transition-all shadow-sm`}
            >
              <span
                className={
                  produtoSelecionado
                    ? "text-slate-900 font-medium flex items-center gap-2 flex-wrap"
                    : "text-slate-400"
                }
              >
                {produtoSelecionado ? (
                  <>
                    <span>{produtoSelecionado.nome}</span>
                    {(produtoSelecionado.tipo || produtoSelecionado.categoria) && (
                      <span
                        className={`text-xs px-2 py-0.5 rounded font-medium border ${
                          (
                            produtoSelecionado.tipo ||
                            produtoSelecionado.categoria
                          )
                            ?.toString()
                            .toLowerCase()
                            .includes("original")
                            ? "bg-blue-50 text-blue-700 border-blue-200"
                            : "bg-purple-50 text-purple-700 border-purple-200"
                        }`}
                      >
                        {produtoSelecionado.tipo ||
                          produtoSelecionado.categoria}
                      </span>
                    )}
                    <span className="text-slate-500 text-xs font-normal">
                      — (Estoque Atual: {produtoSelecionado.quantidade})
                    </span>
                  </>
                ) : (
                  "Selecione um produto cadastrado..."
                )}
              </span>
              <ChevronDown
                size={16}
                className={`text-slate-400 transition-transform ${
                  produtoDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </div>

            {produtoDropdownOpen && (
              <div className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg overflow-hidden">
                <div className="p-2 border-b border-slate-100 bg-slate-50">
                  <div className="relative">
                    <Search
                      size={14}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                      type="text"
                      autoFocus
                      value={buscaProduto}
                      onChange={(e) => setBuscaProduto(e.target.value)}
                      placeholder="Pesquisar produto..."
                      className="w-full bg-white border border-slate-300 text-slate-800 placeholder-slate-400 rounded-md pl-8 pr-3 py-1.5 text-sm outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
                <ul className="max-h-60 overflow-y-auto p-1">
                  {produtosFiltrados.length > 0 ? (
                    produtosFiltrados.map((produto) => {
                      const rotuloTipo = produto.tipo || produto.categoria;
                      const isOriginal = rotuloTipo
                        ?.toString()
                        .toLowerCase()
                        .includes("original");

                      return (
                        <li
                          key={produto.id}
                          onClick={() => {
                            setProdutoId(String(produto.id));
                            setProdutoDropdownOpen(false);
                            setBuscaProduto("");
                          }}
                          className="px-3 py-2 text-sm hover:bg-slate-100 cursor-pointer rounded-md flex justify-between items-center transition-colors gap-2"
                        >
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-medium text-slate-800">
                              {produto.nome}
                            </span>

                            {rotuloTipo && (
                              <span
                                className={`text-xs px-2 py-0.5 rounded font-medium border ${
                                  isOriginal
                                    ? "bg-blue-50 text-blue-700 border-blue-200"
                                    : "bg-purple-50 text-purple-700 border-purple-200"
                                }`}
                              >
                                {rotuloTipo}
                              </span>
                            )}
                          </div>

                          <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-medium border border-slate-200 shrink-0">
                            Estoque: {produto.quantidade}
                          </span>
                        </li>
                      );
                    })
                  ) : (
                    <li className="px-3 py-4 text-sm text-center text-slate-500">
                      Nenhum produto encontrado.
                    </li>
                  )}
                </ul>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="bg-slate-50/70 border border-slate-200/80 rounded-lg p-4">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Quantidade Recebida <span className="text-rose-500">*</span>
            </label>
            <input
              type="number"
              value={quantidade}
              onChange={(e) => setQuantidade(e.target.value)}
              min="1"
              placeholder="Ex: 10"
              className="w-full bg-white border border-slate-300 text-slate-900 placeholder-slate-400 rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-sm"
              required
            />
          </div>

          <div className="bg-slate-50/70 border border-slate-200/80 rounded-lg p-4">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              Origem da Entrada <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Truck
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                value={origem}
                onChange={(e) => setOrigem(e.target.value)}
                placeholder="Fornecedor, devolução..."
                className="w-full bg-white border border-slate-300 text-slate-900 placeholder-slate-400 rounded-lg pl-9 pr-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-sm"
                required
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Nota Fiscal (Opcional)
            </label>
            <input
              type="text"
              value={notaFiscal}
              onChange={(e) => setNotaFiscal(e.target.value)}
              placeholder="Número da NFe"
              className="w-full bg-white border border-slate-300 text-slate-900 placeholder-slate-400 rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Contador / Lote (Opcional)
            </label>
            <input
              type="text"
              value={contador}
              onChange={(e) => setContador(e.target.value)}
              placeholder="Referência extra"
              className="w-full bg-white border border-slate-300 text-slate-900 placeholder-slate-400 rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-sm"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <FileText size={15} className="text-slate-400" />
            Observações Gerais
          </label>
          <textarea
            value={observacoes}
            onChange={(e) => setObservacoes(e.target.value)}
            placeholder="Algum detalhe importante sobre essa entrada? (Opcional)"
            rows={3}
            className="w-full bg-white border border-slate-300 text-slate-900 placeholder-slate-400 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-sm resize-none"
          />
        </div>

        <div className="bg-emerald-50 border border-emerald-200/80 rounded-lg p-3.5 flex items-start gap-3">
          <CheckCircle className="text-emerald-600 shrink-0 mt-0.5" size={18} />
          <div>
            <p className="font-bold text-emerald-900 text-xs uppercase tracking-wider">
              Atualização Automática
            </p>
            <p className="text-xs text-emerald-700 mt-0.5 leading-relaxed">
              Ao confirmar a entrada, o estoque do produto será somado automaticamente e a ação será gravada no histórico com seu usuário.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-3 border-t border-slate-100">
          <button
            type="submit"
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 text-sm shadow-sm"
          >
            <Save size={18} />
            Confirmar Entrada
          </button>

          <button
            type="button"
            onClick={() => router.push("/produtos")}
            className="bg-slate-100 border border-slate-200 text-slate-700 hover:bg-slate-200 px-6 py-2.5 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 text-sm"
          >
            <ArrowLeft size={18} />
            Cancelar e Voltar
          </button>
        </div>
      </form>
    </div>
  );
}