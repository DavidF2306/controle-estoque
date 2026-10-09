"use client";

import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import {
  ArrowUpCircle,
  Save,
  ArrowLeft,
  Package,
  Boxes,
  FileText,
  ClipboardList,
  MapPin,
  CheckCircle,
  Search,
  ChevronDown,
  AlertTriangle,
  User,
  CalendarClock,
} from "lucide-react";

export default function Saidas() {
  const router = useRouter();

  const [produtos, setProdutos] = useState<any[]>([]);
  const [saidas, setSaidas] = useState<any[]>([]);
  const [locais, setLocais] = useState<any[]>([]);

  const [produtoId, setProdutoId] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [destino, setDestino] = useState("");
  const [solicitante, setSolicitante] = useState("");
  const [contador, setContador] = useState("");
  const [observacoes, setObservacoes] = useState("");
  const [dataSaida, setDataSaida] = useState("");

  // Estados e ref para o dropdown customizado de busca de produtos
  const [buscaProduto, setBuscaProduto] = useState("");
  const [produtoDropdownOpen, setProdutoDropdownOpen] = useState(false);
  const produtoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    buscarDados();

    // Define a data/hora inicial como o momento atual no fuso horário local
    const agora = new Date();
    agora.setMinutes(agora.getMinutes() - agora.getTimezoneOffset());
    setDataSaida(agora.toISOString().slice(0, 16));

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

    const { data: saidasData } = await supabase
      .from("saidas")
      .select("*")
      .order("created_at", { ascending: false });

    const { data: locaisData } = await supabase
      .from("locais")
      .select("*")
      .order("nome");

    if (produtosData) setProdutos(produtosData);
    if (saidasData) setSaidas(saidasData);
    if (locaisData) setLocais(locaisData);
  }

  async function registrarSaida(e: React.FormEvent) {
    e.preventDefault();

    if (!produtoId) {
      alert("Por favor, pesquise e selecione um produto.");
      return;
    }

    const produtoSelecionado = produtos.find(
      (produto) => produto.id === Number(produtoId)
    );

    if (!produtoSelecionado) {
      alert("Produto não encontrado no sistema.");
      return;
    }

    const qtdSaida = Number(quantidade);

    if (qtdSaida > Number(produtoSelecionado.quantidade)) {
      alert(
        `Quantidade insuficiente em estoque! Disponível: ${produtoSelecionado.quantidade}`
      );
      return;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const emailUsuario = user?.email || "Usuário não identificado";

    const novaQuantidade = Number(produtoSelecionado.quantidade) - qtdSaida;

    const { error: erroSaida } = await supabase.from("saidas").insert([
      {
        produto_id: Number(produtoId),
        quantidade: qtdSaida,
        destino,
        solicitante: solicitante || null,
        contador: contador || null,
        observacoes: observacoes || null,
        usuario_email: emailUsuario,
        created_at: dataSaida ? new Date(dataSaida).toISOString() : new Date().toISOString(),
      },
    ]);

    if (erroSaida) {
      alert("Erro ao registrar saída: " + erroSaida.message);
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

    alert("Saída registrada com sucesso!");
    router.push("/produtos");
  }

  const totalProdutos = produtos.length;

  const totalEstoque = produtos.reduce(
    (total, produto) => total + Number(produto.quantidade || 0),
    0
  );

  const ultimaSaida = saidas[0];

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
    <div className="text-slate-900 dark:text-slate-100 w-full overflow-x-hidden space-y-6 pb-10">
      {/* Hero Section */}
      <section className="pt-14 md:pt-0">
        <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white shadow-sm">
          <div className="pointer-events-none absolute -top-12 -right-12 w-80 h-80 bg-rose-500/10 rounded-full blur-2xl" />

          <div className="relative p-6 md:p-10 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-8">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-xl bg-rose-50 dark:bg-slate-800/80 border border-rose-100 dark:border-slate-700/80 flex items-center justify-center shrink-0">
                <ArrowUpCircle size={32} className="text-rose-600 dark:text-rose-400" />
              </div>

              <div>
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1 tracking-wide uppercase">
                  Movimentação
                </p>

                <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
                  Saída de Estoque
                </h1>

                <p className="text-slate-600 dark:text-slate-400 mt-2 text-sm md:text-base max-w-2xl">
                  Registre a baixa de suprimentos, envie materiais para setores ou impressoras e mantenha o histórico atualizado.
                </p>
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl p-5 min-w-[240px]">
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
                Total de saídas
              </p>

              <div className="flex items-end gap-2 mt-2">
                <p className="text-3xl font-bold text-slate-900 dark:text-white">
                  {saidas.length}
                </p>
                <p className="text-slate-500 dark:text-slate-400 text-sm mb-1">registros</p>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                <p className="text-xs font-medium text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
                  <CheckCircle size={14} />
                  {ultimaSaida
                    ? "Sistema operacional e sincronizado."
                    : "Nenhuma saída registrada ainda."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cards de Métricas */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Produtos</p>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-1">
              {totalProdutos}
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              disponíveis no catálogo
            </p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <Package size={20} />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Estoque Geral</p>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-1">
              {totalEstoque}
            </h2>
            <p className="text-xs text-slate-500 mt-1">unidades totais</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center">
            <Boxes size={20} />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm flex items-start justify-between relative overflow-hidden">
          <div className="pointer-events-none absolute top-0 right-0 p-4 opacity-10 text-rose-500">
            <CheckCircle size={64} />
          </div>
          <div className="relative z-10">
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Status do Módulo
            </p>
            <h2 className="text-3xl font-bold text-rose-600 dark:text-rose-400 mt-1">
              Operante
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-1">
              pronto para registros
            </p>
          </div>
        </div>
      </section>

      {/* Formulário */}
      <form
        onSubmit={registrarSaida}
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 md:p-6 shadow-sm space-y-6 w-full relative"
      >
        <div className="flex items-center gap-3 mb-4 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="w-10 h-10 rounded-lg bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
            <ClipboardList size={20} />
          </div>

          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              Dados da Saída
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Selecione o produto, informe o destino e confirme a data/hora para registrar a baixa.
            </p>
          </div>
        </div>

        {/* Produto (Dropdown com Pesquisa Integrada) */}
        <div className="bg-slate-50/80 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-lg p-4">
          <div className="relative" ref={produtoRef}>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Selecione o Produto <span className="text-rose-500 dark:text-rose-400">*</span>
            </label>

            <div
              onClick={() => setProdutoDropdownOpen(!produtoDropdownOpen)}
              className={`w-full bg-white dark:bg-slate-900 border ${
                produtoDropdownOpen
                  ? "border-rose-500 ring-2 ring-rose-500/20"
                  : "border-slate-300 dark:border-slate-700/80"
              } rounded-lg px-4 py-2.5 text-sm flex justify-between items-center cursor-pointer transition-all`}
            >
              <span
                className={
                  produtoSelecionado
                    ? "text-slate-900 dark:text-slate-100 font-medium flex items-center gap-2 flex-wrap"
                    : "text-slate-400 dark:text-slate-500"
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
                            ? "bg-blue-100 dark:bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-500/30"
                            : "bg-purple-100 dark:bg-purple-500/15 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-500/30"
                        }`}
                      >
                        {produtoSelecionado.tipo ||
                          produtoSelecionado.categoria}
                      </span>
                    )}
                    <span
                      className={`text-xs font-semibold px-2 py-0.5 rounded ${
                        Number(produtoSelecionado.quantidade) > 0
                          ? "bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20"
                          : "bg-rose-100 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-500/20"
                      }`}
                    >
                      Estoque: {produtoSelecionado.quantidade}
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
              <div className="absolute z-50 w-full mt-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-xl overflow-hidden">
                <div className="p-2 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50">
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
                      placeholder="Pesquisar por nome, variação (Original, Compatível)..."
                      className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 rounded-md pl-8 pr-3 py-2 text-sm outline-none focus:border-rose-500"
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
                      const temEstoque = Number(produto.quantidade) > 0;

                      return (
                        <li
                          key={produto.id}
                          onClick={() => {
                            setProdutoId(String(produto.id));
                            setProdutoDropdownOpen(false);
                            setBuscaProduto("");
                          }}
                          className="px-3 py-2.5 text-sm hover:bg-slate-100 dark:hover:bg-slate-800/70 cursor-pointer rounded-md flex justify-between items-center transition-colors gap-2"
                        >
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-medium text-slate-800 dark:text-slate-200">
                              {produto.nome}
                            </span>

                            {rotuloTipo && (
                              <span
                                className={`text-xs px-2 py-0.5 rounded font-medium border ${
                                  isOriginal
                                    ? "bg-blue-100 dark:bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-500/30"
                                    : "bg-purple-100 dark:bg-purple-500/15 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-500/30"
                                }`}
                              >
                                {rotuloTipo}
                              </span>
                            )}
                          </div>

                          <span
                            className={`text-xs px-2 py-1 rounded font-medium border shrink-0 ${
                              temEstoque
                                ? "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700/80"
                                : "bg-rose-100 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-800/40"
                            }`}
                          >
                            Estoque: {produto.quantidade}
                          </span>
                        </li>
                      );
                    })
                  ) : (
                    <li className="px-3 py-4 text-sm text-center text-slate-500 dark:text-slate-400">
                      Nenhum produto encontrado.
                    </li>
                  )}
                </ul>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Quantidade */}
          <div className="bg-slate-50/80 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-lg p-4">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Quantidade Retirada <span className="text-rose-500 dark:text-rose-400">*</span>
            </label>
            <input
              type="number"
              value={quantidade}
              onChange={(e) => setQuantidade(e.target.value)}
              min="1"
              max={produtoSelecionado ? produtoSelecionado.quantidade : undefined}
              placeholder="Ex: 1"
              className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700/80 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500 transition-all"
              required
            />
          </div>

          {/* Destino */}
          <div className="bg-slate-50/80 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-lg p-4">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
              <MapPin size={16} className="text-slate-400" />
              Destino / Setor <span className="text-rose-500 dark:text-rose-400">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                list="locais-list"
                value={destino}
                onChange={(e) => setDestino(e.target.value)}
                placeholder="Selecione ou digite..."
                className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700/80 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500 transition-all"
                required
              />
              <datalist id="locais-list">
                {locais.map((local) => (
                  <option key={local.id} value={local.nome} />
                ))}
              </datalist>
            </div>
          </div>

          {/* Data e Hora */}
          <div className="bg-slate-50/80 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-lg p-4">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
              <CalendarClock size={16} className="text-rose-500 dark:text-rose-400" />
              Data / Hora da Saída <span className="text-rose-500 dark:text-rose-400">*</span>
            </label>
            <input
              type="datetime-local"
              value={dataSaida}
              onChange={(e) => setDataSaida(e.target.value)}
              className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700/80 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500 transition-all"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Solicitante */}
          <div>
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
              <User size={16} className="text-slate-400" />
              Solicitante / Técnico (Opcional)
            </label>
            <input
              type="text"
              value={solicitante}
              onChange={(e) => setSolicitante(e.target.value)}
              placeholder="Nome da pessoa que solicitou"
              className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700/80 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500 transition-all"
            />
          </div>

          {/* Contador */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Contador / Impressora (Opcional)
            </label>
            <input
              type="text"
              value={contador}
              onChange={(e) => setContador(e.target.value)}
              placeholder="Ex: Contador de páginas ou equipamento"
              className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700/80 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500 transition-all"
            />
          </div>
        </div>

        {/* Observações */}
        <div>
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
            <FileText size={16} className="text-slate-400" />
            Observações Gerais
          </label>
          <textarea
            value={observacoes}
            onChange={(e) => setObservacoes(e.target.value)}
            placeholder="Motivo da troca, defeito do toner antigo, etc. (Opcional)"
            rows={3}
            className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700/80 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 rounded-lg px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500 transition-all resize-none"
          />
        </div>

        {/* Info Box */}
        <div className="bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/40 rounded-lg p-4 flex items-start gap-3 mt-2">
          <AlertTriangle size={18} className="text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-rose-800 dark:text-rose-300 text-sm">
              Baixa Automática no Estoque
            </p>
            <p className="text-xs text-rose-700 dark:text-rose-400/80 mt-1 leading-relaxed">
              Ao confirmar a saída, a quantidade informada será subtraída do estoque do produto imediatamente e vinculada ao seu usuário com a data selecionada.
            </p>
          </div>
        </div>

        {/* Botões */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
          <button
            type="submit"
            className="bg-rose-600 hover:bg-rose-700 text-white px-6 py-2.5 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 text-sm shadow-sm"
          >
            <Save size={18} />
            Confirmar Saída
          </button>

          <button
            type="button"
            onClick={() => router.push("/produtos")}
            className="bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white px-6 py-2.5 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 text-sm shadow-sm"
          >
            <ArrowLeft size={18} />
            Cancelar e Voltar
          </button>
        </div>
      </form>
    </div>
  );
}