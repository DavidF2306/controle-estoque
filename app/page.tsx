import { supabase } from "@/lib/supabase";

export default async function Home() {
  const { data: produtos } = await supabase
    .from("produtos")
    .select("*");

  const { data: entradas } = await supabase
    .from("entradas")
    .select(`
      *,
      produtos (
        nome
      )
    `);

  const { data: saidas } = await supabase
    .from("saidas")
    .select(`
      *,
      produtos (
        nome
      )
    `);

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

  return (
    <div className="text-gray-800 w-full overflow-x-hidden">

      <div className="mb-8 pt-14 md:pt-0">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
          Página Inicial
        </h1>

        <p className="text-gray-500 mt-2">
          Gestão de estoque de impressoras e suprimentos
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6">

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
          <p className="text-gray-500">Produtos</p>

          <h2 className="text-4xl font-bold mt-4 text-gray-800">
            {totalProdutos}
          </h2>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
          <p className="text-gray-500">Itens em Estoque</p>

          <h2 className="text-4xl font-bold mt-4 text-gray-800">
            {totalEstoque}
          </h2>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
          <p className="text-gray-500">Entradas</p>

          <h2 className="text-4xl font-bold mt-4 text-gray-800">
            {entradas?.length || 0}
          </h2>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
          <p className="text-gray-500">Saídas</p>

          <h2 className="text-4xl font-bold mt-4 text-gray-800">
            {saidas?.length || 0}
          </h2>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
          <p className="text-gray-500">Estoque Baixo</p>

          <h2 className="text-4xl font-bold mt-4 text-red-600">
            {estoqueBaixo}
          </h2>
        </div>

      </div>

      <div className="mt-8 md:mt-10 bg-white rounded-2xl shadow-sm border border-gray-200 p-4 md:p-6">

        <h2 className="text-xl md:text-2xl font-bold mb-6 text-gray-800">
          Movimentações Recentes
        </h2>

        {movimentacoesRecentes.length === 0 ? (
          <p className="text-gray-500">
            Nenhuma movimentação registrada.
          </p>
        ) : (
          <div className="space-y-4">
            {movimentacoesRecentes.map((movimentacao, index) => (
              <div
                key={index}
                className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 border border-gray-200 rounded-xl p-4 hover:bg-gray-50"
              >
                <div>
                  <span
                    className={
                      movimentacao.tipo === "Entrada"
                        ? "text-green-600 font-semibold"
                        : "text-red-600 font-semibold"
                    }
                  >
                    {movimentacao.tipo}
                  </span>

                  <h3 className="font-semibold text-gray-800 mt-1">
                    {movimentacao.produto}
                  </h3>

                  <p className="text-sm text-gray-500">
                    {movimentacao.tipo === "Entrada"
                      ? `Origem: ${movimentacao.local}`
                      : `Cliente: ${movimentacao.cliente} | Local: ${movimentacao.local}`}
                  </p>
                </div>

                <div className="text-left md:text-right">
                  <p className="font-bold text-gray-800">
                    {movimentacao.tipo === "Entrada" ? "+" : "-"}
                    {movimentacao.quantidade} un.
                  </p>

                  <p className="text-sm text-gray-500">
                    {new Date(
                      movimentacao.data
                    ).toLocaleDateString("pt-BR")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

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

      <div className="mt-8 md:mt-10 bg-white rounded-2xl shadow-sm border border-gray-200 p-4 md:p-6">

        <h2 className="text-xl md:text-2xl font-bold mb-6 text-gray-800">
          Últimos Produtos
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[650px]">

            <thead className="bg-gray-100">
              <tr className="text-left">
                <th className="p-4 text-gray-800">Nome</th>
                <th className="p-4 text-gray-800">Tipo</th>
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
                  <td className="p-4 text-gray-800">
                    {produto.nome}
                  </td>

                  <td className="p-4 text-gray-800">
                    {produto.tipo || "-"}
                  </td>

                  <td className="p-4 text-gray-800">
                    {produto.quantidade}
                  </td>

                  <td className="p-4 text-gray-800">
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