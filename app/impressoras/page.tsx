"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useRouter } from "next/navigation";


import {
  Printer,
  Plus,
  Search,
  Pencil,
  Trash2,
  Hash,
  MapPin,
  FileText,
  Download,
  Building2,
  BarChart3,
} from "lucide-react";

export default function Impressoras() {

  const [impressoras, setImpressoras] = useState<any[]>([]);
  const [locais, setLocais] = useState<any[]>([]);
  const router = useRouter();

  const [busca, setBusca] = useState("");
  const [localSelecionado, setLocalSelecionado] = useState("Todos");

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarDados();
  }, []);

  async function carregarDados() {

    setLoading(true);

    const { data: impressorasData } = await supabase
      .from("impressoras")
      .select("*")
      .order("local")
      .order("nome");

    const { data: locaisData } = await supabase
      .from("locais")
      .select("*")
      .order("nome");

    if (impressorasData) {
      setImpressoras(impressorasData);
    }

    if (locaisData) {
      setLocais(locaisData);
    }

    setLoading(false);
  }

async function excluirImpressora(id: number) {
  const confirmar = confirm(
    "Deseja realmente excluir esta impressora?"
  );

  if (!confirmar) return;

  const { error } = await supabase
    .from("impressoras")
    .delete()
    .eq("id", id);

  if (error) {
    alert(error.message);
    return;
  }

  carregarDados();
}

function exportarPDF() {
  const pdf = new jsPDF();

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(18);

  pdf.text("COPYSTAR", 14, 18);

  pdf.setFontSize(13);

  pdf.text(
    "Relatório de Impressoras",
    14,
    28
  );

  pdf.setFont("helvetica", "normal");

  pdf.setFontSize(11);

  pdf.text(
    `Local: ${localSelecionado}`,
    14,
    38
  );

  pdf.text(
    `Total: ${impressorasFiltradas.length} impressoras`,
    14,
    45
  );

  pdf.text(
    `Data: ${new Date().toLocaleDateString("pt-BR")}`,
    14,
    52
  );

  autoTable(pdf, {
    startY: 60,

    head: [[
      "Nome",
      "Modelo",
      "Local",
      "Série",
      "Contador"
    ]],

    body: impressorasFiltradas.map((item) => [
      item.nome,
      item.modelo,
      item.local,
      item.numero_serie || "-",
      item.contador ?? 0,
    ]),

    styles: {
      fontSize: 9,
      cellPadding: 3,
    },

    headStyles: {
      fillColor: [37, 99, 235],
    },
  });

  const nomeArquivo =
    localSelecionado === "Todos"
      ? "Relatorio_Impressoras.pdf"
      : `Relatorio_${localSelecionado}.pdf`;

  pdf.save(nomeArquivo);
}

function exportarExcel() {
  const dados = impressorasFiltradas.map((item) => ({
    Nome: item.nome,
    Modelo: item.modelo,
    Local: item.local,
    "Número de Série": item.numero_serie || "",
    Contador: item.contador ?? 0,
    Observações: item.observacoes || "",
  }));

  const worksheet = XLSX.utils.json_to_sheet(dados);

  worksheet["!cols"] = [
    { wch: 30 },
    { wch: 25 },
    { wch: 25 },
    { wch: 25 },
    { wch: 15 },
    { wch: 40 },
  ];

  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(
    workbook,
    worksheet,
    "Impressoras"
  );

  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  });

  const blob = new Blob([excelBuffer], {
    type:
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  const nomeArquivo =
    localSelecionado === "Todos"
      ? "Impressoras.xlsx"
      : `Impressoras_${localSelecionado}.xlsx`;

  saveAs(blob, nomeArquivo);
}


  const impressorasFiltradas = useMemo(() => {

    return impressoras.filter((item) => {

      const pesquisa =
        item.nome?.toLowerCase().includes(busca.toLowerCase()) ||
        item.modelo?.toLowerCase().includes(busca.toLowerCase()) ||
        item.numero_serie?.toLowerCase().includes(busca.toLowerCase());

      const filtroLocal =
        localSelecionado === "Todos"
          ? true
          : item.local === localSelecionado;

      return pesquisa && filtroLocal;

    });

  }, [impressoras, busca, localSelecionado]);

  const totalImpressoras = impressoras.length;

  const totalLocais = locais.length;

  const impressorasSemSerie = impressoras.filter(
    (item) => !item.numero_serie
  ).length;

  const impressorasSemContador = impressoras.filter(
    (item) => !item.contador
  ).length;

  if (loading) {
    return (
      <div className="p-10">
        Carregando...
      </div>
    );
  }

  return (

    <div className="text-gray-900 w-full overflow-x-hidden space-y-8">

      <section className="pt-14 md:pt-0">

        <div className="relative overflow-hidden rounded-[2.2rem] bg-gradient-to-br from-indigo-500 via-blue-600 to-cyan-500 text-white shadow-lg">

          <div className="absolute -top-24 -right-20 w-80 h-80 bg-white/20 rounded-full blur-3xl" />

          <div className="absolute bottom-0 left-0 w-72 h-72 bg-blue-900/20 rounded-full blur-3xl" />

          <div className="relative p-6 md:p-10 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-8">

            <div className="flex items-center gap-4">

              <div className="w-20 h-20 rounded-[2rem] bg-white/20 border border-white/30 flex items-center justify-center">

                <Printer size={40} />

              </div>

              <div>

                <p className="text-blue-50 text-sm font-medium mb-1">
                  Estoque Copystar
                </p>

                <h1 className="text-4xl md:text-6xl font-extrabold">
                  Impressoras
                </h1>

                <p className="text-blue-50 mt-2 max-w-2xl">
                  Gerencie todas as impressoras cadastradas da empresa.
                </p>

              </div>

            </div>

            <Link
              href="/impressoras/novo"
              className="bg-white text-blue-700 hover:bg-blue-50 px-6 py-3 rounded-2xl font-bold flex items-center justify-center gap-2 transition"
            >

              <Plus size={20} />

              Nova Impressora

            </Link>

          </div>

          <div className="h-7 bg-white rounded-t-[100%] opacity-95" />

        </div>

      </section>

      <section className="grid xl:grid-cols-4 md:grid-cols-2 gap-5">

        <div className="bg-white rounded-[2rem] border border-gray-200 p-6 shadow-sm">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm text-gray-500">
                Impressoras
              </p>

              <h2 className="text-4xl font-extrabold mt-2">
                {totalImpressoras}
              </h2>

            </div>

            <Printer
              className="text-blue-600"
              size={34}
            />

          </div>

        </div>

        <div className="bg-white rounded-[2rem] border border-gray-200 p-6 shadow-sm">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm text-gray-500">
                Locais
              </p>

              <h2 className="text-4xl font-extrabold mt-2">
                {totalLocais}
              </h2>

            </div>

            <Building2
              className="text-green-600"
              size={34}
            />

          </div>

        </div>

        <div className="bg-white rounded-[2rem] border border-gray-200 p-6 shadow-sm">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm text-gray-500">
                Sem Nº Série
              </p>

              <h2 className="text-4xl font-extrabold mt-2">
                {impressorasSemSerie}
              </h2>

            </div>

            <Hash
              className="text-orange-500"
              size={34}
            />

          </div>

        </div>

        <div className="bg-white rounded-[2rem] border border-gray-200 p-6 shadow-sm">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm text-gray-500">
                Sem Contador
              </p>

              <h2 className="text-4xl font-extrabold mt-2">
                {impressorasSemContador}
              </h2>

            </div>

            <BarChart3
              className="text-purple-600"
              size={34}
            />

          </div>

        </div>

      </section>

            <section className="bg-white border border-gray-200 rounded-[2rem] p-6 shadow-sm">

        <div className="grid lg:grid-cols-4 gap-4">

          <div className="lg:col-span-2">

            <label className="block text-sm font-semibold mb-2">
              Pesquisar
            </label>

            <div className="relative">

              <Search
                size={20}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                placeholder="Nome, modelo ou número de série..."
                className="w-full border border-gray-300 rounded-2xl pl-12 pr-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              />

            </div>

          </div>

          <div>

            <label className="block text-sm font-semibold mb-2">
              Local
            </label>

            <div className="relative">

              <MapPin
                size={20}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <select
                value={localSelecionado}
                onChange={(e) =>
                  setLocalSelecionado(e.target.value)
                }
                className="w-full border border-gray-300 rounded-2xl pl-12 pr-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
              >

                <option value="Todos">
                  Todos os locais
                </option>

                {locais.map((local) => (

                  <option
                    key={local.id}
                    value={local.nome}
                  >
                    {local.nome}
                  </option>

                ))}

              </select>

            </div>

          </div>

          <div>

            <label className="block text-sm font-semibold mb-2">
              Exportações
            </label>

            <div className="flex gap-2">

<button
  type="button"
  onClick={exportarPDF}
  className="flex-1 bg-red-50 text-red-700 hover:bg-red-100 rounded-2xl py-3 font-bold transition flex items-center justify-center gap-2"
>

  <FileText size={18} />

  PDF

</button>


<button
  type="button"
  onClick={exportarExcel}
  className="flex-1 bg-green-50 text-green-700 hover:bg-green-100 rounded-2xl py-3 font-bold transition flex items-center justify-center gap-2"
>

  <Download size={18} />

  Excel

</button>


            </div>

          </div>

        </div>

      </section>

      <section className="space-y-4">

        {impressorasFiltradas.map((item) => (

          <div
            key={item.id}
            className="bg-white border border-gray-200 rounded-[2rem] p-6 shadow-sm hover:shadow-md transition"
          >

            <div className="flex flex-col xl:flex-row xl:justify-between xl:items-center gap-6">

              <div className="space-y-4">

                <div>

                  <h2 className="text-2xl font-extrabold">
                    {item.nome}
                  </h2>

                  <p className="text-gray-500 mt-1">
                    {item.modelo}
                  </p>

                </div>

                <div className="flex flex-wrap gap-3">

                  <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-xl flex items-center gap-2">

                    <MapPin size={16} />

                    {item.local}

                  </div>

                  <div className="bg-gray-100 text-gray-700 px-4 py-2 rounded-xl flex items-center gap-2">

                    <Hash size={16} />

                    {item.numero_serie || "Sem número de série"}

                  </div>

                </div>

                <div className="grid sm:grid-cols-2 gap-4">

                  <div className="bg-gray-50 rounded-2xl p-4">

                    <p className="text-xs text-gray-500 uppercase">
                      Contador
                    </p>

                    <h3 className="text-2xl font-extrabold mt-1">
                      {item.contador || 0}
                    </h3>

                  </div>

                  <div className="bg-gray-50 rounded-2xl p-4">

                    <p className="text-xs text-gray-500 uppercase">
                      Observações
                    </p>

                    <p className="mt-1">
                      {item.observacoes || "-"}
                    </p>

                  </div>

                </div>

              </div>

              <div className="flex flex-col gap-3">

                <Link
                  href={`/impressoras/editar/${item.id}`}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-2xl font-bold flex items-center justify-center gap-2 transition"
                >
                  <Pencil size={18} />
                  Editar
                </Link>

                <button
                  onClick={() => excluirImpressora(item.id)}
                  className="bg-red-600 hover:bg-red-700 text-white px-5 py-3 rounded-2xl font-bold flex items-center justify-center gap-2 transition"
                >
                  <Trash2 size={18} />
                  Excluir
                </button>

                <button
                  onClick={() => router.push(`/impressoras/${item.id}`)}
                  className="bg-sky-600 hover:bg-sky-700 text-white px-6 py-3 rounded-2xl font-bold flex items-center justify-center gap-2"
                >
                  👁 Ver
                </button>

                <button>
                  ✏ Editar
                </button>

                <button>
                  🗑 Excluir
                </button>

                

              </div>

            </div>

          </div>

        ))}

        {impressorasFiltradas.length === 0 && (

          <div className="bg-white border border-gray-200 rounded-[2rem] p-12 text-center shadow-sm">

            <Printer
              size={60}
              className="mx-auto text-gray-300 mb-5"
            />

            <h2 className="text-2xl font-bold text-gray-700">
              Nenhuma impressora encontrada
            </h2>

            <p className="text-gray-500 mt-3">

              Não existem impressoras com os filtros informados.

            </p>

            <Link
              href="/impressoras/novo"
              className="inline-flex mt-8 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-bold items-center gap-2 transition"
            >

              <Plus size={20} />

              Cadastrar Impressora

            </Link>

          </div>

        )}

      </section>

    </div>

  );

}
