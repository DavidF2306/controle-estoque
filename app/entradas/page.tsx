"use client";

import { useEffect, useState } from "react";
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

  useEffect(() => {
    buscarDados();
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

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const emailUsuario = user?.email || "Usuário não identificado";

    const produtoSelecionado = produtos.find(
      (produto) => produto.id === Number(produtoId)
    );

    if (!produtoSelecionado) {
      alert("Selecione um produto.");
      return;
    }

    const novaQuantidade =
      Number(produtoSelecionado.quantidade) + Number(quantidade);

    const { error: erroEntrada } = await supabase
      .from("entradas")
      .insert([
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
    (total, produto) =>
      total + Number(produto.quantidade || 0),
    0
  );

  const ultimaEntrada = entradas[0];

  return (
    <div className="text-gray-900 w-full overflow-x-hidden space-y-8">

      <section className="pt-14 md:pt-0">
        <div className="relative overflow-hidden rounded-[2.2rem] bg-gradient-to-br from-emerald-500 via-green-600 to-cyan-700 text-white shadow-lg">

          <div className="absolute -top-24 -right-20 w-80 h-80 bg-white/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-lime-300/30 rounded-full blur-3xl" />

          <div className="relative p-6 md:p-10 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-8">

            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-[2rem] bg-white/20 border border-white/30 flex items-center justify-center">
                <ArrowDownCircle size={40} />
              </div>

              <div>
                <p className="text-emerald-50 text-sm font-medium mb-1">
                  Estoque Copystar
                </p>

                <h1 className="text-4xl md:text-6xl font-extrabold">
                  Entrada de Estoque
                </h1>

                <p className="text-emerald-50 mt-2 max-w-2xl">
                  Registre novos produtos recebidos, atualize quantidades e mantenha o estoque sempre em dia.
                </p>
              </div>
            </div>

            <div className="bg-white/15 border border-white/20 backdrop-blur rounded-[2rem] p-5 min-w-[240px]">
              <p className="text-emerald-50 text-sm">
                Total de entradas
              </p>

              <p className="text-4xl font-extrabold mt-2">
                {entradas.length}
              </p>

              <p className="text-emerald-50 text-sm mt-1">
                registros realizados
              </p>

              <p className="text-xs text-emerald-50 mt-3">
                {ultimaEntrada
                  ? "Última entrada registrada recentemente"
                  : "Nenhuma entrada registrada ainda"}
              </p>
            </div>

          </div>

          <div className="h-7 bg-white rounded-t-[100%] opacity-95" />
        </div>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-[1.8rem] p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Produtos</p>
              <h2 className="text-4xl font-extrabold mt-2">
                {totalProdutos}
              </h2>
              <p className="text-xs text-gray-400 mt-2">
                disponíveis para entrada
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
              <p className="text-sm text-gray-500">Estoque atual</p>
              <h2 className="text-4xl font-extrabold mt-2">
                {totalEstoque}
              </h2>
              <p className="text-xs text-gray-400 mt-2">
                unidades no sistema
              </p>
            </div>

            <div className="w-12 h-12 rounded-2xl bg-violet-50 text-violet-700 flex items-center justify-center">
              <Boxes size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-[1.8rem] p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Status</p>
              <h2 className="text-3xl font-extrabold mt-2">
                Ativo
              </h2>
              <p className="text-xs text-gray-400 mt-2">
                pronto para registrar
              </p>
            </div>

            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <CheckCircle size={24} />
            </div>
          </div>
        </div>
      </section>

      <form
        onSubmit={registrarEntrada}
        className="bg-white border border-gray-200 rounded-[2rem] p-4 md:p-8 shadow-sm space-y-6 w-full max-w-5xl"
      >

        <div className="flex items-center gap-3 mb-2">
          <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <ClipboardList size={22} />
          </div>

          <div>
            <h2 className="text-xl md:text-2xl font-extrabold">
              Dados da entrada
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Preencha os dados do produto recebido
            </p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Produto
          </label>

          <select
            value={produtoId}
            onChange={(e) => setProdutoId(e.target.value)}
            className="w-full border border-gray-300 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500"
            required
          >
            <option value="">
              Selecione um produto
            </option>

            {produtos.map((produto) => (
              <option key={produto.id} value={produto.id}>
                {produto.nome} — Estoque atual: {produto.quantidade}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <div className="bg-emerald-50/50 border border-emerald-100 rounded-3xl p-4">
            <label className="block text-sm font-medium mb-2">
              Quantidade
            </label>

            <input
              type="number"
              value={quantidade}
              onChange={(e) => setQuantidade(e.target.value)}
              min="1"
              placeholder="0"
              className="w-full bg-white border border-emerald-200 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500"
              required
            />
          </div>

          <div className="bg-blue-50/50 border border-blue-100 rounded-3xl p-4">
            <label className="text-sm font-medium mb-2 flex items-center gap-2">
              <Truck size={17} />
              Origem
            </label>

            <input
              type="text"
              value={origem}
              onChange={(e) => setOrigem(e.target.value)}
              placeholder="Fornecedor, compra, retorno..."
              className="w-full bg-white border border-blue-200 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <div>
            <label className="block text-sm font-medium mb-2">
              Nota Fiscal
            </label>

            <input
              type="text"
              value={notaFiscal}
              onChange={(e) => setNotaFiscal(e.target.value)}
              placeholder="Opcional"
              className="w-full border border-gray-300 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Contador
            </label>

            <input
              type="text"
              value={contador}
              onChange={(e) => setContador(e.target.value)}
              placeholder="Opcional"
              className="w-full border border-gray-300 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

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
            className="w-full border border-gray-300 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">

          <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-2xl font-bold transition flex items-center justify-center gap-2">
            <Save size={20} />
            Registrar Entrada
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