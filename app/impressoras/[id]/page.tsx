"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useParams, useRouter } from "next/navigation";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import {
  ArrowLeft,
  Printer,
  Hash,
  MapPin,
  FileText,
  Pencil,
} from "lucide-react";

export default function DetalhesImpressora() {
  const { id } = useParams();
  const router = useRouter();

  const [impressora, setImpressora] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [novoContador, setNovoContador] = useState("");
  const [abrirModalContador, setAbrirModalContador] = useState(false);

  useEffect(() => {
    buscarImpressora();
  }, []);

  async function buscarImpressora() {

  const { data, error } = await supabase
    .from("impressoras")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    alert(error.message);
    return;
  }

  setImpressora(data);
  setLoading(false);
}

async function atualizarContador() {

  if (!novoContador) {
    alert("Informe o novo contador.");
    return;
  }

  const { error } = await supabase
    .from("impressoras")
    .update({
      contador: Number(novoContador),
    })
    .eq("id", impressora.id);

  if (error) {
    alert(error.message);
    return;
  }

  alert("Contador atualizado com sucesso!");

  buscarImpressora();

  setNovoContador("");
}

function exportarPDFImpressora() {
  const pdf = new jsPDF();

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(18);
  pdf.text("COPYSTAR", 14, 18);

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(12);
  pdf.text("Relatório da Impressora", 14, 28);

  pdf.setFontSize(10);
  pdf.text(
    `Data: ${new Date().toLocaleDateString("pt-BR")}`,
    14,
    38
  );

  autoTable(pdf, {
    startY: 48,
    head: [["Campo", "Informação"]],
    body: [
      ["Nome", impressora.nome],
      ["Modelo", impressora.modelo],
      ["Local", impressora.local],
      ["Número de Série", impressora.numero_serie || "-"],
      ["Contador", String(impressora.contador || 0)],
      ["Observações", impressora.observacoes || "-"],
    ],
    theme: "grid",
    headStyles: {
      fillColor: [37, 99, 235],
    },
  });

  pdf.save(`Impressora_${impressora.nome}.pdf`);
}

if (loading) {
  return (
    <div className="flex justify-center items-center h-96">
      <p className="text-gray-500 text-lg">
        Carregando impressora...
      </p>
    </div>
  );
}

return (
  <div className="space-y-8">

    {/* Cabeçalho */}

    <section className="rounded-[2rem] bg-gradient-to-br from-blue-600 via-sky-500 to-cyan-500 text-white p-8 shadow-lg">

      <div className="flex items-center gap-5">

        <div className="w-20 h-20 rounded-[2rem] bg-white/20 flex items-center justify-center">
          <Printer size={42} />
        </div>

        <div>

          <p className="text-blue-100">
            Detalhes da Impressora
          </p>

          <h1 className="text-5xl font-extrabold">
            {impressora.nome}
          </h1>

          <p className="mt-2 text-blue-100">
            {impressora.modelo}
          </p>

        </div>

      </div>

    </section>

    {/* Informações */}

    <section className="grid md:grid-cols-2 gap-6">

      <div className="bg-white rounded-[2rem] border border-gray-200 shadow-sm p-6">

        <div className="flex items-center gap-3 mb-3">

          <MapPin className="text-blue-600" size={22} />

          <h2 className="font-bold text-lg">
            Local
          </h2>

        </div>

        <p className="text-2xl font-extrabold">
          {impressora.local}
        </p>

      </div>

      <div className="bg-white rounded-[2rem] border border-gray-200 shadow-sm p-6">

        <div className="flex items-center gap-3 mb-3">

          <Hash className="text-blue-600" size={22} />

          <h2 className="font-bold text-lg">
            Número de Série
          </h2>

        </div>

        <p className="text-xl font-semibold">
          {impressora.numero_serie || "Não informado"}
        </p>

      </div>

      <div className="bg-white rounded-[2rem] border border-gray-200 shadow-sm p-6">

        <div className="flex items-center gap-3 mb-3">

          <FileText className="text-blue-600" size={22} />

          <h2 className="font-bold text-lg">
            Contador
          </h2>

        </div>

        <p className="text-3xl font-extrabold">
          {(impressora.contador || 0).toLocaleString("pt-BR")}
        </p>

      </div>

      <div className="bg-white rounded-[2rem] border border-gray-200 shadow-sm p-6">

        <h2 className="font-bold text-lg mb-3">
          Observações
        </h2>

        <p className="text-gray-700">
          {impressora.observacoes || "Nenhuma observação cadastrada."}
        </p>

      </div>

    </section>

    {/* Botões */}

    <section className="bg-white rounded-[2rem] border border-gray-200 shadow-sm p-6">

      <div className="flex flex-wrap gap-4">

        <button
          onClick={() => router.back()}
          className="flex-1 min-w-[180px] bg-gray-100 hover:bg-gray-200 rounded-2xl py-3 font-bold transition"
        >
          <div className="flex items-center justify-center gap-2">
            <ArrowLeft size={18} />
            Voltar
          </div>
        </button>

        <button
          onClick={() =>
            router.push(`/impressoras/editar/${impressora.id}`)
          }
          className="flex-1 min-w-[180px] bg-blue-600 hover:bg-blue-700 text-white rounded-2xl py-3 font-bold transition"
        >
          <div className="flex items-center justify-center gap-2">
            <Pencil size={18} />
            Editar
          </div>
        </button>

        
<button
  onClick={exportarPDFImpressora}
  className="flex-1 min-w-[180px] bg-red-50 hover:bg-red-100 text-red-700 rounded-2xl py-3 font-bold transition"
>
  <div className="flex items-center justify-center gap-2">
    <FileText size={18} />
    PDF
  </div>
</button>


        <button
  onClick={() => {
    setNovoContador(String(impressora.contador || 0));
    setAbrirModalContador(true);
  }}
  className="flex-1 min-w-[180px] bg-green-50 hover:bg-green-100 text-green-700 rounded-2xl py-3 font-bold transition"
>
  <div className="flex items-center justify-center gap-2">
    <Hash size={18} />
    Atualizar Contador
  </div>
</button>

      </div>

    </section>

    {abrirModalContador && (

  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

    <div className="bg-white rounded-[2rem] w-full max-w-md p-8">

      <h2 className="text-2xl font-extrabold mb-6">
        Atualizar Contador
      </h2>

      <label className="block text-sm font-medium mb-2">
        Novo contador
      </label>

      <input
        type="number"
        value={novoContador}
        onChange={(e) => setNovoContador(e.target.value)}
        className="w-full border border-gray-300 rounded-2xl px-4 py-3"
      />

      <div className="flex gap-3 mt-8">

        <button
          onClick={() => setAbrirModalContador(false)}
          className="flex-1 bg-gray-200 hover:bg-gray-300 rounded-2xl py-3 font-bold"
        >
          Cancelar
        </button>

        <button
          onClick={async () => {
            await atualizarContador();
            setAbrirModalContador(false);
          }}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl py-3 font-bold"
        >
          Salvar
        </button>

      </div>

    </div>

  </div>

)}

  </div>
);
}
