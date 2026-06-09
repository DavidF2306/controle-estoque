import { supabase } from "@/lib/supabase";

import GraficoEstoque from "./components/GraficoEstoque";

export default async function Home() {

  const { data: produtos } = await supabase
    .from("produtos")
    .select("*");

  const { data: entradas } = await supabase
    .from("entradas")
    .select("*");

  const { data: saidas } = await supabase
    .from("saidas")
    .select("*");

  const totalProdutos = produtos?.length || 0;

  const totalEstoque =
    produtos?.reduce(
      (total, produto) =>
        total + produto.quantidade,
      0
    ) || 0;

  const estoqueBaixo =
    produtos?.filter(
      (produto) =>
        produto.quantidade <= 5
    ).length || 0;

  const produtosBaixoEstoque =
    produtos?.filter(
      (produto) =>
        produto.quantidade <= 5
    ) || [];

  return (
    <div>

      <div className="mb-8">

        <h1 className="text-4xl font-bold text-gray-800 dark:text-white">
          Dashboard
        </h1>

        <p className="text-gray-500 dark:text-gray-300 mt-2">
          Bem-vindo ao sistema de controle de estoque
        </p>

      </div>

      <div className="grid grid-cols-5 gap-6">

        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">

          <p className="text-gray-500 dark:text-gray-300">
            Produtos
          </p>

          <h2 className="text-4xl font-bold mt-4 text-gray-800 dark:text-white">
            {totalProdutos}
          </h2>

        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">

          <p className="text-gray-500 dark:text-gray-300">
            Itens em Estoque
          </p>

          <h2 className="text-4xl font-bold mt-4 text-gray-800 dark:text-white">
            {totalEstoque}
          </h2>

        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">

          <p className="text-gray-500 dark:text-gray-300">
            Entradas
          </p>

          <h2 className="text-4xl font-bold mt-4 text-gray-800 dark:text-white">
            {entradas?.length || 0}
          </h2>

        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">

          <p className="text-gray-500 dark:text-gray-300">
            Saídas
          </p>

          <h2 className="text-4xl font-bold mt-4 text-gray-800 dark:text-white">
            {saidas?.length || 0}
          </h2>

        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">

          <p className="text-gray-500 dark:text-gray-300">
            Estoque Baixo
          </p>

          <h2 className="text-4xl font-bold mt-4 text-red-600">
            {estoqueBaixo}
          </h2>

        </div>

      </div>

      <div className="mt-10">

        <GraficoEstoque />

      </div>

      <div className="mt-10 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">

        <h2 className="text-2xl font-bold mb-6 text-red-600">
          Produtos com Estoque Baixo
        </h2>

        {
          produtosBaixoEstoque.length === 0 ? (

            <p className="text-gray-500 dark:text-gray-300">
              Nenhum produto com estoque baixo.
            </p>

          ) : (

            <div className="space-y-4">

              {produtosBaixoEstoque.map((produto) => (

                <div
                  key={produto.id}
                  className="
                    flex items-center justify-between
                    bg-red-50 dark:bg-red-900/20
                    border border-red-200 dark:border-red-800
                    rounded-xl
                    p-4
                  "
                >

                  <div>

                    <h3 className="font-semibold text-gray-800 dark:text-white">
                      {produto.nome}
                    </h3>

                    <p className="text-sm text-gray-500 dark:text-gray-300">
                      Código: {produto.codigo}
                    </p>

                  </div>

                  <div className="text-red-600 font-bold text-lg">

                    {produto.quantidade} un.

                  </div>

                </div>

              ))}

            </div>

          )
        }

      </div>

      <div className="mt-10 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">

        <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
          Últimos Produtos
        </h2>

        <table className="w-full">

          <thead className="bg-gray-100 dark:bg-gray-700">

            <tr className="text-left">

              <th className="p-4 text-gray-800 dark:text-white">
                Nome
              </th>

              <th className="p-4 text-gray-800 dark:text-white">
                Código
              </th>

              <th className="p-4 text-gray-800 dark:text-white">
                Quantidade
              </th>

              <th className="p-4 text-gray-800 dark:text-white">
                Categoria
              </th>

            </tr>

          </thead>

          <tbody>

            {produtos?.map((produto) => (

              <tr
                key={produto.id}
                className="
                  border-t
                  border-gray-200
                  dark:border-gray-700
                  hover:bg-gray-50
                  dark:hover:bg-gray-700
                "
              >

                <td className="p-4 text-gray-800 dark:text-white">
                  {produto.nome}
                </td>

                <td className="p-4 text-gray-800 dark:text-white">
                  {produto.codigo}
                </td>

                <td className="p-4 text-gray-800 dark:text-white">
                  {produto.quantidade}
                </td>

                <td className="p-4 text-gray-800 dark:text-white">
                  {produto.categoria}
                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}