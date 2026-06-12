"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import {
  ArrowDownCircle,
  Save,
  ArrowLeft,
} from "lucide-react";

export default function Entradas() {
  const router = useRouter();

  const [produtos, setProdutos] = useState<any[]>([]);

  const [produtoId, setProdutoId] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [origem, setOrigem] = useState("");
  const [notaFiscal, setNotaFiscal] = useState("");
  const [contador, setContador] = useState("");
  const [observacoes, setObservacoes] = useState("");

  useEffect(() => {
    buscarProdutos();
  }, []);

  async function buscarProdutos() {
    const { data } = await supabase
      .from("produtos")
      .select("*")
      .order("nome");

    if (data) {
      setProdutos(data);
    }
  }

  async function registrarEntrada(e: React.FormEvent) {
    e.preventDefault();

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

  return (
    <div className="text-gray-900 w-full overflow-x-hidden">

      <div className="pt-14 md:pt-0 mb-8 flex items-center gap-3">
        <div className="w-11 h-11 rounded-2xl bg-green-600 text-white flex items-center justify-center">
          <ArrowDownCircle size={22} />
        </div>

        <div>
          <h1 className="text-3xl md:text-4xl font-bold">
            Entrada de Estoque
          </h1>

          <p className="text-gray-500 mt-1">
            Registre novas entradas de produtos
          </p>
        </div>
      </div>

      <form
        onSubmit={registrarEntrada}
        className="bg-white border border-gray-200 rounded-3xl p-4 md:p-8 shadow-sm space-y-6 w-full max-w-3xl"
      >
        <div>
          <label className="block text-sm font-medium mb-2">
            Produto
          </label>

          <select
            value={produtoId}
            onChange={(e) => setProdutoId(e.target.value)}
            className="w-full border border-gray-300 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
            required
          >
            <option value="">
              Selecione um produto
            </option>

            {produtos.map((produto) => (
              <option
                key={produto.id}
                value={produto.id}
              >
                {produto.nome}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <div>
            <label className="block text-sm font-medium mb-2">
              Quantidade
            </label>

            <input
              type="number"
              value={quantidade}
              onChange={(e) => setQuantidade(e.target.value)}
              min="1"
              placeholder="0"
              className="w-full border border-gray-300 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Origem
            </label>

            <input
              type="text"
              value={origem}
              onChange={(e) => setOrigem(e.target.value)}
              placeholder="Fornecedor"
              className="w-full border border-gray-300 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
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
              className="w-full border border-gray-300 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
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
              className="w-full border border-gray-300 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Observações
          </label>

          <textarea
            value={observacoes}
            onChange={(e) => setObservacoes(e.target.value)}
            placeholder="Opcional"
            rows={4}
            className="w-full border border-gray-300 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-500 resize-none"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">

          <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-2xl font-medium transition flex items-center justify-center gap-2">
            <Save size={20} />
            Registrar Entrada
          </button>

          <button
            type="button"
            onClick={() => router.push("/produtos")}
            className="bg-gray-900 hover:bg-black text-white px-6 py-3 rounded-2xl font-medium transition flex items-center justify-center gap-2"
          >
            <ArrowLeft size={20} />
            Voltar
          </button>

        </div>
      </form>

    </div>
  );
}