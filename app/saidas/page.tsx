"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import {
  ArrowUpCircle,
  Save,
  ArrowLeft,
  Package,
  MapPin,
  Users,
  ClipboardList,
  FileText,
  Gauge,
  Building2,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";

export default function Saidas() {
  const router = useRouter();

  const [produtos, setProdutos] = useState<any[]>([]);
  const [locais, setLocais] = useState<any[]>([]);
  const [saidas, setSaidas] = useState<any[]>([]);

  const [produtoId, setProdutoId] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [cliente, setCliente] = useState("");
  const [local, setLocal] = useState("");
  const [contador, setContador] = useState("");
  const [observacoes, setObservacoes] = useState("");

  useEffect(() => {
    buscarDados();
  }, []);

  async function buscarDados() {
    const { data: produtosData } = await supabase
      .from("produtos")
      .select("*")
      .order("nome");

    const { data: locaisData } = await supabase
      .from("locais")
      .select("*")
      .order("cliente");

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

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const emailUsuario =
      user?.email || "Usuário não identificado";

    const produtoSelecionado = produtos.find(
      (produto) => produto.id === Number(produtoId)
    );

    if (!produtoSelecionado) {
      alert("Selecione um produto.");
      return;
    }

    if (Number(quantidade) > Number(produtoSelecionado.quantidade)) {
      alert("Quantidade maior que o estoque.");
      return;
    }

    const novaQuantidade =
      Number(produtoSelecionado.quantidade) - Number(quantidade);

    const { error: erroSaida } = await supabase
      .from("saidas")
      .insert([
        {
          produto_id: Number(produtoId),
          quantidade: Number(quantidade),
          cliente,
          local,
          contador: contador || null,
          observacoes: observacoes || null,
          usuario_email: emailUsuario,
          destino: `${cliente} - ${local}`,
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

  const clientes = [
    ...new Set(
      locais
        .map((item) => item.cliente)
        .filter(Boolean)
    ),
  ];

  const locaisFiltrados = locais.filter(
    (item) => item.cliente === cliente
  );

  const totalEstoque = produtos.reduce(
    (total, produto) =>
      total + Number(produto.quantidade || 0),
    0
  );

  const produtoSelecionado = produtos.find(
    (produto) => produto.id === Number(produtoId)
  );

  return (
    <div className="text-gray-900 w-full overflow-x-hidden space-y-8">

      <section className="pt-14 md:pt-0">
        <div className="relative overflow-hidden rounded-[2.2rem] bg-gradient-to-br from-rose-500 via-red-600 to-orange-600 text-white shadow-lg">
          <div className="absolute -top-24 -right-20 w-80 h-80 bg-white/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-yellow-300/30 rounded-full blur-3xl" />

          <div className="relative p-6 md:p-10 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-8">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-[2rem] bg-white/20 border border-white/30 flex items-center justify-center">
                <ArrowUpCircle size={40} />
              </div>

              <div>
                <p className="text-red-50 text-sm font-medium mb-1">
                  Estoque Copystar
                </p>

                <h1 className="text-4xl md:text-6xl font-extrabold">
                  Saída de Estoque
                </h1>

                <p className="text-red-50 mt-2 max-w-2xl">
                  Registre entregas para clientes, acompanhe locais e mantenha o estoque sempre atualizado.
                </p>
              </div>
            </div>

            <div className="bg-white/15 border border-white/20 backdrop-blur rounded-[2rem] p-5 min-w-[240px]">
              <p className="text-red-50 text-sm">
                Total de saídas
              </p>

              <p className="text-4xl font-extrabold mt-2">
                {saidas.length}
              </p>

              <p className="text-red-50 text-sm mt-1">
                registros realizados
              </p>

              <p className="text-xs text-red-50 mt-3">
                {clientes.length} cliente(s) disponíveis
              </p>
            </div>
          </div>

          <div className="h-7 bg-white rounded-t-[100%] opacity-95" />
        </div>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-[1.8rem] p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Produtos</p>
              <h2 className="text-4xl font-extrabold mt-2">
                {produtos.length}
              </h2>
              <p className="text-xs text-gray-400 mt-2">
                disponíveis
              </p>
            </div>

            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center">
              <Package size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-[1.8rem] p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Estoque</p>
              <h2 className="text-4xl font-extrabold mt-2">
                {totalEstoque}
              </h2>
              <p className="text-xs text-gray-400 mt-2">
                unidades
              </p>
            </div>

            <div className="w-12 h-12 rounded-2xl bg-violet-50 text-violet-700 flex items-center justify-center">
              <Gauge size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-[1.8rem] p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Clientes</p>
              <h2 className="text-4xl font-extrabold mt-2">
                {clientes.length}
              </h2>
              <p className="text-xs text-gray-400 mt-2">
                cadastrados
              </p>
            </div>

            <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-700 flex items-center justify-center">
              <Users size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-[1.8rem] p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Locais</p>
              <h2 className="text-4xl font-extrabold mt-2">
                {locais.length}
              </h2>
              <p className="text-xs text-gray-400 mt-2">
                disponíveis
              </p>
            </div>

            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <MapPin size={24} />
            </div>
          </div>
        </div>
      </section>

      <form
        onSubmit={registrarSaida}
        className="bg-white border border-gray-200 rounded-[2rem] p-4 md:p-8 shadow-sm space-y-6 w-full max-w-5xl"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="w-11 h-11 rounded-2xl bg-rose-50 text-rose-700 flex items-center justify-center">
            <ClipboardList size={22} />
          </div>

          <div>
            <h2 className="text-xl md:text-2xl font-extrabold">
              Dados da saída
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Preencha os dados da entrega ao cliente
            </p>
          </div>
        </div>

        <div className="bg-blue-50/50 border border-blue-100 rounded-3xl p-4">
          <label className="block text-sm font-medium mb-2">
            Produto
          </label>

          <select
            value={produtoId}
            onChange={(e) => setProdutoId(e.target.value)}
            className="w-full bg-white border border-blue-200 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">
              Selecione um produto
            </option>

            {produtos.map((produto) => (
              <option key={produto.id} value={produto.id}>
                {produto.nome} — Estoque: {produto.quantidade}
              </option>
            ))}
          </select>

          {produtoSelecionado && (
            <p className="text-sm text-blue-700 mt-3">
              Estoque atual deste produto:{" "}
              <strong>{produtoSelecionado.quantidade} un.</strong>
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <div className="bg-rose-50/60 border border-rose-100 rounded-3xl p-4">
            <label className="block text-sm font-medium mb-2">
              Quantidade
            </label>

            <input
              type="number"
              value={quantidade}
              onChange={(e) => setQuantidade(e.target.value)}
              className="w-full bg-white border border-rose-200 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-rose-500"
              placeholder="0"
              min="1"
              required
            />

            {produtoSelecionado &&
              Number(quantidade) > Number(produtoSelecionado.quantidade) && (
                <p className="text-sm text-red-600 mt-3 flex items-center gap-1">
                  <AlertTriangle size={16} />
                  Quantidade maior que o estoque disponível.
                </p>
              )}
          </div>

          <div className="bg-orange-50/60 border border-orange-100 rounded-3xl p-4">
            <label className="text-sm font-medium mb-2 flex items-center gap-2">
              <Building2 size={17} />
              Cliente
            </label>

            <select
              value={cliente}
              onChange={(e) => {
                setCliente(e.target.value);
                setLocal("");
              }}
              className="w-full bg-white border border-orange-200 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-orange-500"
              required
            >
              <option value="">
                Selecione o cliente
              </option>

              {clientes.map((clienteNome) => (
                <option key={clienteNome} value={clienteNome}>
                  {clienteNome}
                </option>
              ))}
            </select>
          </div>

        </div>

        <div className="bg-violet-50/60 border border-violet-100 rounded-3xl p-4">
          <label className="text-sm font-medium mb-2 flex items-center gap-2">
            <MapPin size={17} />
            Local
          </label>

          <select
            value={local}
            onChange={(e) => setLocal(e.target.value)}
            className="w-full bg-white border border-violet-200 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-violet-500"
            required
            disabled={!cliente}
          >
            <option value="">
              {cliente
                ? "Selecione o local"
                : "Selecione um cliente primeiro"}
            </option>

            {locaisFiltrados.map((item) => (
              <option key={item.id} value={item.nome}>
                {item.nome}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Contador
          </label>

          <input
            type="text"
            value={contador}
            onChange={(e) => setContador(e.target.value)}
            className="w-full border border-gray-300 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-rose-500"
            placeholder="Opcional"
          />
        </div>

        <div>
          <label className="text-sm font-medium mb-2 flex items-center gap-2">
            <FileText size={17} />
            Observações
          </label>

          <textarea
            value={observacoes}
            onChange={(e) => setObservacoes(e.target.value)}
            placeholder="Opcional"
            rows={4}
            className="w-full border border-gray-300 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-rose-500 resize-none"
          />
        </div>

        <div className="bg-emerald-50 border border-emerald-100 rounded-3xl p-4 flex items-start gap-3">
          <CheckCircle className="text-emerald-700 shrink-0 mt-0.5" size={20} />

          <div>
            <p className="font-bold text-emerald-800">
              Conferência antes de salvar
            </p>

            <p className="text-sm text-emerald-700/80 mt-1">
              Ao registrar a saída, o estoque do produto será atualizado automaticamente.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button className="bg-rose-600 hover:bg-rose-700 text-white px-6 py-3 rounded-2xl font-bold transition flex items-center justify-center gap-2">
            <Save size={20} />
            Registrar Saída
          </button>

          <button
            type="button"
            onClick={() => router.push("/produtos")}
            className="bg-gray-900 hover:bg-black text-white px-6 py-3 rounded-2xl font-bold transition flex items-center justify-center gap-2"
          >
            <ArrowLeft size={20} />
            Voltar
          </button>
        </div>
      </form>

    </div>
  );
}