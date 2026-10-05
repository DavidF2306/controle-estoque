"use client";

import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import {
  ArrowUpCircle,
  Save,
  ArrowLeft,
  Package,
  MapPin,
  ClipboardList,
  FileText,
  Gauge,
  AlertTriangle,
  CheckCircle,
  Search,
  ChevronDown,
} from "lucide-react";

export default function Saidas() {
  const router = useRouter();

  const [produtos, setProdutos] = useState<any[]>([]);
  const [locais, setLocais] = useState<any[]>([]);
  const [saidas, setSaidas] = useState<any[]>([]);

  const [produtoId, setProdutoId] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [local, setLocal] = useState("");
  const [contador, setContador] = useState("");
  const [observacoes, setObservacoes] = useState("");

  // Estados para busca e controle dos dropdowns customizados
  const [buscaProduto, setBuscaProduto] = useState("");
  const [buscaLocal, setBuscaLocal] = useState("");

  const [produtoDropdownOpen, setProdutoDropdownOpen] = useState(false);
  const [localDropdownOpen, setLocalDropdownOpen] = useState(false);

  // Refs para fechar os dropdowns ao clicar fora
  const produtoRef = useRef<HTMLDivElement>(null);
  const localRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    buscarDados();

    function handleClickOutside(event: MouseEvent) {
      if (
        produtoRef.current &&
        !produtoRef.current.contains(event.target as Node)
      ) {
        setProdutoDropdownOpen(false);
      }
      if (
        localRef.current &&
        !localRef.current.contains(event.target as Node)
      ) {
        setLocalDropdownOpen(false);
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

    const { data: locaisData } = await supabase
      .from("locais")
      .select("*")
      .order("nome");

    const { data: saidasData } = await supabase
      .from("saidas")
      .select("*")
      .order("created_at", { ascending: false });

    if (produtosData) setProdutos(produtosData);
    if (locaisData) setLocais(locaisData);
    if (saidasData) setSaidas(saidasData);
  }

  async function registrarSaida(e: React.FormEvent) {
    e.preventDefault();

    if (!produtoId) {
      alert("Por favor, pesquise e selecione um produto.");
      return;
    }

    if (!local) {
      alert("Por favor, pesquise e selecione o local de destino.");
      return;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const emailUsuario = user?.email || "Usuário não identificado";

    const produtoSelecionado = produtos.find(
      (produto) => produto.id === Number(produtoId)
    );

    if (Number(quantidade) > Number(produtoSelecionado?.quantidade || 0)) {
      alert("Quantidade maior que o estoque disponível.");
      return;
    }

    const novaQuantidade =
      Number(produtoSelecionado.quantidade) - Number(quantidade);

    const { error: erroSaida } = await supabase.from("saidas").insert([
      {
        produto_id: Number(produtoId),
        quantidade: Number(quantidade),
        local,
        contador: contador || null,
        observacoes: observacoes || null,
        usuario_email: emailUsuario,
        destino: local,
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
    router.push("/historico");
  }

  const totalEstoque = produtos.reduce(
    (total, produto) => total + Number(produto.quantidade || 0),
    0
  );

  const produtoSelecionado = produtos.find(
    (produto) => produto.id === Number(produtoId)
  );

  // Filtros em tempo real (Pesquisa por Nome, Tipo e Categoria)
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

  const locaisFiltrados = locais.filter((item) =>
    item.nome.toLowerCase().includes(buscaLocal.toLowerCase())
  );

  return (
    <div className="text-slate-800 w-full overflow-x-hidden space-y-6 pb-10">
      {/* Hero Section */}
      <section className="pt-14 md:pt-0">
        <div className="relative overflow-hidden rounded-2xl bg-slate-900 text-white shadow-md">
          <div className="absolute top-0 right-0 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />

          <div className="relative p-6 md:p-10 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-8">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-xl bg-white/10 border border-white/10 backdrop-blur-sm flex items-center justify-center shrink-0">
                <ArrowUpCircle size={32} className="text-rose-400" />
              </div>

              <div>
                <p className="text-slate-400 text-sm font-medium mb-1 tracking-wide uppercase">
                  Movimentação
                </p>

                <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                  Saída de Estoque
                </h1>

                <p className="text-slate-400 mt-2 text-sm md:text-base max-w-2xl">
                  Registre as entregas para locais, controle a retirada de
                  suprimentos e mantenha o inventário atualizado.
                </p>
              </div>
            </div>

            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5 min-w-[240px]">
              <p className="text-slate-400 text-sm font-medium">
                Total de saídas
              </p>

              <div className="flex items-end gap-2 mt-2">
                <p className="text-3xl font-bold text-white">{saidas.length}</p>
                <p className="text-slate-400 text-sm mb-1">registros</p>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-700">
                <p className="text-xs font-medium text-rose-400 flex items-center gap-1.5">
                  <CheckCircle size={14} />
                  Sincronizado com o histórico
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cards de Métricas */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Produtos</p>
            <h2 className="text-3xl font-bold text-slate-800 mt-1">
              {produtos.length}
            </h2>
            <p className="text-xs text-slate-400 mt-1">itens disponíveis</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <Package size={20} />
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Estoque Físico</p>
            <h2 className="text-3xl font-bold text-slate-800 mt-1">
              {totalEstoque}
            </h2>
            <p className="text-xs text-slate-400 mt-1">unidades no sistema</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-slate-50 text-slate-600 flex items-center justify-center">
            <Gauge size={20} />
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Destinos</p>
            <h2 className="text-3xl font-bold text-slate-800 mt-1">
              {locais.length}
            </h2>
            <p className="text-xs text-slate-400 mt-1">locais cadastrados</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <MapPin size={20} />
          </div>
        </div>
      </section>

      {/* Formulário */}
      <form
        onSubmit={registrarSaida}
        className="bg-white border border-slate-200 rounded-xl p-5 md:p-6 shadow-sm space-y-6 w-full relative"
      >
        <div className="flex items-center gap-3 mb-4 border-b border-slate-100 pb-4">
          <div className="w-10 h-10 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
            <ClipboardList size={20} />
          </div>

          <div>
            <h2 className="text-lg font-bold text-slate-800">Dados da Saída</h2>
            <p className="text-sm text-slate-500">
              Preencha os detalhes da entrega para o local de destino.
            </p>
          </div>
        </div>

        {/* Produto (Dropdown com Pesquisa) */}
        <div className="bg-slate-50/50 border border-slate-200 rounded-lg p-4">
          <div className="relative" ref={produtoRef}>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Selecione o Produto <span className="text-rose-500">*</span>
            </label>

            {/* Input Fake (Botão do Select) */}
            <div
              onClick={() => setProdutoDropdownOpen(!produtoDropdownOpen)}
              className={`w-full bg-white border ${
                produtoDropdownOpen
                  ? "border-blue-500 ring-2 ring-blue-100"
                  : "border-slate-200"
              } rounded-lg px-4 py-2.5 text-sm flex justify-between items-center cursor-pointer transition-shadow`}
            >
              <span
                className={
                  produtoSelecionado
                    ? "text-slate-800 font-medium flex items-center gap-2 flex-wrap"
                    : "text-slate-400"
                }
              >
                {produtoSelecionado ? (
                  <>
                    <span>{produtoSelecionado.nome}</span>
                    {(produtoSelecionado.tipo || produtoSelecionado.categoria) && (
                      <span className="text-xs px-2 py-0.5 rounded font-semibold border bg-slate-100 text-slate-700 border-slate-300">
                        {produtoSelecionado.tipo || produtoSelecionado.categoria}
                      </span>
                    )}
                    <span className="text-slate-500 text-xs font-normal">
                      — (Em Estoque: {produtoSelecionado.quantidade})
                    </span>
                  </>
                ) : (
                  "Selecione um item do estoque..."
                )}
              </span>
              <ChevronDown
                size={16}
                className={`text-slate-400 transition-transform ${
                  produtoDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </div>

            {/* Painel da Lista (Abre ao clicar) */}
            {produtoDropdownOpen && (
              <div className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-xl overflow-hidden">
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
                      placeholder="Pesquisar por nome ou variação (Original, Compatível...)"
                      className="w-full bg-white border border-slate-200 rounded-md pl-8 pr-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
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
                            setBuscaProduto(""); // limpa a busca ao selecionar
                          }}
                          className="px-3 py-2.5 text-sm hover:bg-blue-50 hover:text-blue-700 cursor-pointer rounded-md flex justify-between items-center transition-colors gap-2"
                        >
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-medium text-slate-800">
                              {produto.nome}
                            </span>

                            {rotuloTipo && (
                              <span
                                className={`text-xs px-2 py-0.5 rounded font-semibold border ${
                                  isOriginal
                                    ? "bg-blue-50 text-blue-700 border-blue-200"
                                    : "bg-purple-50 text-purple-700 border-purple-200"
                                }`}
                              >
                                {rotuloTipo}
                              </span>
                            )}
                          </div>

                          <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded font-medium border border-slate-200 shrink-0">
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

          {produtoSelecionado && (
            <p className="text-sm text-blue-600 mt-3 font-medium flex items-center gap-1.5">
              <CheckCircle size={14} />
              Estoque atual liberado para retirada: {produtoSelecionado.quantidade} un.
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Quantidade */}
          <div className="bg-slate-50/50 border border-slate-200 rounded-lg p-4">
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Quantidade Retirada <span className="text-rose-500">*</span>
            </label>
            <input
              type="number"
              value={quantidade}
              onChange={(e) => setQuantidade(e.target.value)}
              min="1"
              placeholder="Ex: 5"
              className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-shadow"
              required
            />
            {produtoSelecionado &&
              Number(quantidade) > Number(produtoSelecionado.quantidade) && (
                <p className="text-sm text-rose-600 mt-2 font-medium flex items-center gap-1.5">
                  <AlertTriangle size={14} />
                  Atenção: Quantidade superior ao estoque.
                </p>
              )}
          </div>

          {/* Local (Dropdown com Pesquisa) */}
          <div className="bg-slate-50/50 border border-slate-200 rounded-lg p-4">
            <div className="relative" ref={localRef}>
              <label className="text-sm font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <MapPin size={16} className="text-slate-400" />
                Local de Destino <span className="text-rose-500">*</span>
              </label>

              {/* Input Fake (Botão do Select) */}
              <div
                onClick={() => setLocalDropdownOpen(!localDropdownOpen)}
                className={`w-full bg-white border ${
                  localDropdownOpen
                    ? "border-blue-500 ring-2 ring-blue-100"
                    : "border-slate-200"
                } rounded-lg px-4 py-2.5 text-sm flex justify-between items-center cursor-pointer transition-shadow`}
              >
                <span
                  className={
                    local ? "text-slate-800 font-medium" : "text-slate-400"
                  }
                >
                  {local || "Selecione para onde vai..."}
                </span>
                <ChevronDown
                  size={16}
                  className={`text-slate-400 transition-transform ${
                    localDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </div>

              {/* Painel da Lista (Abre ao clicar) */}
              {localDropdownOpen && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-xl overflow-hidden">
                  <div className="p-2 border-b border-slate-100 bg-slate-50">
                    <div className="relative">
                      <Search
                        size={14}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                      />
                      <input
                        type="text"
                        autoFocus
                        value={buscaLocal}
                        onChange={(e) => setBuscaLocal(e.target.value)}
                        placeholder="Pesquisar local..."
                        className="w-full bg-white border border-slate-200 rounded-md pl-8 pr-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <ul className="max-h-60 overflow-y-auto p-1">
                    {locaisFiltrados.length > 0 ? (
                      locaisFiltrados.map((item) => (
                        <li
                          key={item.id}
                          onClick={() => {
                            setLocal(item.nome);
                            setLocalDropdownOpen(false);
                            setBuscaLocal(""); // limpa a busca ao selecionar
                          }}
                          className="px-3 py-2.5 text-sm hover:bg-blue-50 hover:text-blue-700 cursor-pointer rounded-md font-medium transition-colors"
                        >
                          {item.nome}
                        </li>
                      ))
                    ) : (
                      <li className="px-3 py-4 text-sm text-center text-slate-500">
                        Nenhum local encontrado.
                      </li>
                    )}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Contador e Observações */}
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Contador / Ordem de Serviço (Opcional)
            </label>
            <input
              type="text"
              value={contador}
              onChange={(e) => setContador(e.target.value)}
              placeholder="Ex: OS-1029 ou Referência do equipamento"
              className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <FileText size={16} className="text-slate-500" />
              Observações Gerais
            </label>
            <textarea
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              placeholder="Algum detalhe importante sobre essa saída? (Opcional)"
              rows={3}
              className="w-full bg-white border border-slate-200 rounded-lg px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow resize-none"
            />
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-emerald-50 border border-emerald-200/60 rounded-lg p-4 flex items-start gap-3 mt-2">
          <CheckCircle className="text-emerald-600 shrink-0 mt-0.5" size={18} />
          <div>
            <p className="font-semibold text-emerald-800 text-sm">
              Controle Preciso
            </p>
            <p className="text-xs text-emerald-700/80 mt-1 leading-relaxed">
              Ao registrar, o estoque do produto será atualizado automaticamente,
              garantindo que o sistema sempre exiba os valores reais disponíveis.
            </p>
          </div>
        </div>

        {/* Botões */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-100">
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
            className="bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900 px-6 py-2.5 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 text-sm shadow-sm"
          >
            <ArrowLeft size={18} />
            Cancelar e Voltar
          </button>
        </div>
      </form>
    </div>
  );
}