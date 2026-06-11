import { supabase } from "@/lib/supabase";

import {
  Package,
  Archive,
  ArrowDownCircle,
  ArrowUpCircle,
  AlertTriangle,
  Activity,
} from "lucide-react";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Home() {
  const { data: produtos } = await supabase
    .from("produtos")
    .select("*")
    .order("id", { ascending: false });

  const { data: entradas } = await supabase
    .from("entradas")
    .select(`
      *,
      produtos (
        nome
      )
    `)
    .order("created_at", { ascending: false });

  const { data: saidas } = await supabase
    .from("saidas")
    .select(`
      *,
      produtos (
        nome
      )
    `)
    .order("created_at", { ascending: false });

  const totalProdutos = produtos?.length || 0;

  const totalEstoque =
    produtos?.reduce(
      (total, produto) =>
        total + Number(produto.quantidade || 0),
      0
    ) || 0;

  const produtosBaixoEstoque =
    produtos?.filter(
      (produto) =>
        Number(produto.quantidade) <= 5
    ) || [];

  const estoqueBaixo =
    produtosBaixoEstoque.length;

  const movimentacoesRecentes = [
    ...(entradas || []).map((entrada) => ({
      tipo: "Entrada",
      produto: entrada.produtos?.nome || "-",
      quantidade: entrada.quantidade,
      cliente: "-",
      local: entrada.origem || "-",
      data: entrada.created_at,
    })),

    ...(saidas || []).map((saida) => ({
      tipo: "Saída",
      produto: saida.produtos?.nome || "-",
      quantidade: saida.quantidade,
      cliente: saida.cliente || "-",
      local: saida.local || saida.destino || "-",
      data: saida.created_at,
    })),
  ]
    .sort(
      (a, b) =>
        new Date(b.data).getTime() -
        new Date(a.data).getTime()
    )
    .slice(0, 5);

  const ultimosProdutos =
    produtos?.slice(0, 5) || [];

  const cards = [
    {
      titulo: "Produtos",
      valor: totalProdutos,
      icon: Package,
      cor: "bg-blue-50 text-blue-600",
    },
    {
      titulo: "Itens em Estoque",
      valor: totalEstoque,
      icon: Archive,
      cor: "bg-indigo-50 text-indigo-600",
    },
    {
      titulo: "Entradas",
      valor: entradas?.length || 0,
      icon: ArrowDownCircle,
      cor: "bg-green-50 text-green-600",
    },
    {
      titulo: "Saídas",
      valor: saidas?.length || 0,
      icon: ArrowUpCircle,
      cor: "bg-red-50 text-red-600",
    },
    {
      titulo: "Estoque Baixo",
      valor: estoqueBaixo,
      icon: AlertTriangle,
      cor: "bg-orange-50 text-orange-600",
    },
  ];

  return (
    <div className="text-gray-900 w-full overflow-x-hidden">

      <div className="mb-8 pt-14 md:pt-0">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-11 h-11 rounded-2xl bg-blue-600 text-white flex items-center justify-center">
            <Activity size={22} />
          </div>

          <div>
            <h1 className="text-3xl md:text-4xl font-bold">
              Página Inicial
            </h1>

            <p className="text-gray-500 mt-1">
              Gestão de estoque de impressoras e suprimentos
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4 md:gap-5">
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.titulo}
              className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">
                    {card.titulo}
                  </p>

                  <h2 className="text-4xl font-bold mt-3">
                    {card.valor}
                  </h2>
                </div>

                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center ${card.cor}`}
                >
                  <Icon size={24} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-8">

        <div className="bg-white border border-gray-200 rounded-3xl p-4 md:p-6 shadow-sm">
          <h2 className="text-xl md:text-2xl font-bold mb-2">
            Movimentações Recentes
          </h2>

          <p className="text-sm text-gray-500 mb-6">
            Últimas entradas e saídas registradas
          </p>

          {movimentacoesRecentes.length === 0 ? (
            <p className="text-gray-500">
              Nenhuma movimentação registrada.
            </p>
          ) : (
            <div className="space-y-3">
              {movimentacoesRecentes.map((mov, index) => (
                <div
                  key={index}
                  className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 border border-gray-100 rounded-2xl p-4 hover:bg-gray-50 transition"
                >
                  <div>
                    <span
                      className={
                        mov.tipo === "Entrada"
                          ? "text-green-600 text-sm font-semibold"
                          : "text-red-600 text-sm font-semibold"
                      }
                    >
                      {mov.tipo}
                    </span>

                    <h3 className="font-semibold mt-1">
                      {mov.produto}
                    </h3>

                    <p className="text-sm text-gray-500 mt-1">
                      {mov.tipo === "Entrada"
                        ? `Origem: ${mov.local}`
                        : `Cliente: ${mov.cliente} • Local: ${mov.local}`}
                    </p>
                  </div>

                  <div className="md:text-right">
                    <p className="font-bold">
                      {mov.tipo === "Entrada" ? "+" : "-"}
                      {mov.quantidade} un.
                    </p>

                    <p className="text-sm text-gray-500">
                      {new Date(mov.data).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white border border-gray-200 rounded-3xl p-4 md:p-6 shadow-sm">
          <h2 className="text-xl md:text-2xl font-bold text-red-600 mb-2">
            Produtos com Estoque Baixo
          </h2>

          <p className="text-sm text-gray-500 mb-6">
            Produtos com quantidade igual ou menor que 5 unidades
          </p>

          {produtosBaixoEstoque.length === 0 ? (
            <p className="text-gray-500">
              Nenhum produto com estoque baixo.
            </p>
          ) : (
            <div className="space-y-3">
              {produtosBaixoEstoque.map((produto) => (
                <div
                  key={produto.id}
                  className="flex items-center justify-between bg-red-50 border border-red-100 rounded-2xl p-4 gap-4"
                >
                  <div>
                    <h3 className="font-semibold">
                      {produto.nome}
                    </h3>

                    <p className="text-sm text-gray-500">
                      Tipo: {produto.tipo || "-"}
                    </p>
                  </div>

                  <div className="text-red-600 font-bold text-lg whitespace-nowrap">
                    {produto.quantidade} un.
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      <div className="mt-8 bg-white border border-gray-200 rounded-3xl p-4 md:p-6 shadow-sm">

        <h2 className="text-xl md:text-2xl font-bold mb-2">
          Últimos Produtos
        </h2>

        <p className="text-sm text-gray-500 mb-6">
          Últimos produtos cadastrados no estoque
        </p>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[650px]">
            <thead>
              <tr className="text-left bg-gray-50">
                <th className="p-4 text-sm text-gray-600 font-semibold rounded-l-2xl">
                  Nome
                </th>

                <th className="p-4 text-sm text-gray-600 font-semibold">
                  Tipo
                </th>

                <th className="p-4 text-sm text-gray-600 font-semibold">
                  Quantidade
                </th>

                <th className="p-4 text-sm text-gray-600 font-semibold rounded-r-2xl">
                  Categoria
                </th>
              </tr>
            </thead>

            <tbody>
              {ultimosProdutos.map((produto) => (
                <tr
                  key={produto.id}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="p-4 font-medium">
                    {produto.nome}
                  </td>

                  <td className="p-4 text-gray-600">
                    {produto.tipo || "-"}
                  </td>

                  <td
                    className={
                      Number(produto.quantidade) <= 5
                        ? "p-4 font-semibold text-red-600"
                        : "p-4 text-gray-600"
                    }
                  >
                    {produto.quantidade}
                  </td>

                  <td className="p-4 text-gray-600">
                    {produto.categoria || "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
}