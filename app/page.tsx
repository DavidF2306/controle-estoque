import { supabase } from "@/lib/supabase";
import GraficoEstoque from "./components/GraficoEstoque";

export default async function Home() {
  const { data: produtos } = await supabase.from("produtos").select("*");
  const { data: entradas } = await supabase.from("entradas").select("*");
  const { data: saidas } = await supabase.from("saidas").select("*");

  const totalProdutos = produtos?.length || 0;

  const totalEstoque =
    produtos?.reduce(
      (total, produto) => total + produto.quantidade,
      0
    ) || 0;

  const estoqueBaixo =
    produtos?.filter((produto) => produto.quantidade <= 5).length || 0;

  const produtosBaixoEstoque =
    produtos?.filter((produto) => produto.quantidade <= 5) || [];

  return (
    <div className="text-gray-800 w-full overflow-x-hidden">

      <div className="mb-8 pt-14 md:pt-0">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
          Dashboard
        </h1>

        <p className="text-gray-500 mt-2">
          Bem-vindo ao sistema de controle de estoque
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6">

        {[
          ["Produtos", totalProdutos],
          ["Itens em Estoque", totalEstoque],
          ["Entradas", entradas?.length || 0],
          ["Saídas", saidas?.length || 0],
          ["Estoque Baixo", estoqueBaixo],
        ].map(([titulo, valor]) => (
          <div
            key={titulo}
            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200"
          >
            <p className="text-gray-500">{titulo}</p>

            <h2
              className={`text-4xl font-bold mt-4 ${
                titulo === "Estoque Baixo"
                  ? "text-red-600"
                  : "text-gray-800"
              }`}
            >
              {valor}
            </h2>
          </div>
        ))}

      </div>

      <div className="mt-8 md:mt-10 overflow-x-auto">
        <GraficoEstoque />
      </div>

      <div className="mt-8 md:mt-10 bg-white rounded-2xl shadow-sm border border-gray-200 p-4 md:p-6">
        <h2 className="text-xl md:text-2xl font-bold mb-6 text-red-600">
          Produtos com Estoque Baixo
        </h2>

        {produtosBaixoEstoque.length === 0 ? (
          <p className="text-gray-500">
            Nenhum produto com estoque baixo.
          </p>
        ) : (
          <div className="space-y-4">
            {produtosBaixoEstoque.map((produto) => (
              <div
                key={produto.id}
                className="flex items-center justify-between bg-red-50 border border-red-200 rounded-xl p-4 gap-4"
              >
                <div>
                  <h3 className="font-semibold text-gray-800">
                    {produto.nome}
                  </h3>

                  <p className="text-sm text-gray-500">
                    Código: {produto.codigo}
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

      <div className="mt-8 md:mt-10 bg-white rounded-2xl shadow-sm border border-gray-200 p-4 md:p-6">
        <h2 className="text-xl md:text-2xl font-bold mb-6 text-gray-800">
          Últimos Produtos
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead className="bg-gray-100">
              <tr className="text-left">
                <th className="p-4 text-gray-800">Nome</th>
                <th className="p-4 text-gray-800">Código</th>
                <th className="p-4 text-gray-800">Quantidade</th>
                <th className="p-4 text-gray-800">Categoria</th>
              </tr>
            </thead>

            <tbody>
              {produtos?.map((produto) => (
                <tr
                  key={produto.id}
                  className="border-t border-gray-200 hover:bg-gray-50"
                >
                  <td className="p-4 text-gray-800">{produto.nome}</td>
                  <td className="p-4 text-gray-800">{produto.codigo}</td>
                  <td className="p-4 text-gray-800">{produto.quantidade}</td>
                  <td className="p-4 text-gray-800">{produto.categoria}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}