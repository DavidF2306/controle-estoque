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
  Activity,
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
    setAbrirModalContador(false);
  }

  function exportarPDFImpressora() {
    const pdf = new jsPDF();

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(18);
    pdf.text("COPYSTAR", 14, 18);

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(12);
    pdf.text("Relatório Detalhado de Equipamento", 14, 28);

    pdf.setFontSize(10);
    pdf.setTextColor(100);
    pdf.text(`Emitido em: ${new Date().toLocaleDateString("pt-BR")}`, 14, 34);

    autoTable(pdf, {
      startY: 42,
      head: [["Campo", "Informação"]],
      body: [
        ["Nome / Identificação", impressora.nome],
        ["Modelo", impressora.modelo],
        ["Localidade / Setor", impressora.local],
        ["Número de Série (S/N)", impressora.numero_serie || "-"],
        ["Contador Atual", String(impressora.contador || 0)],
        ["Observações / Detalhes Técnicos", impressora.observacoes || "-"],
      ],
      theme: "grid",
      styles: {
        fontSize: 10,
        cellPadding: 4,
      },
      headStyles: {
        fillColor: [30, 58, 138], // Azul escuro corporativo
      },
      columnStyles: {
        0: { fontStyle: "bold", cellWidth: 70 },
      },
    });

    pdf.save(`Ficha_Impressora_${impressora.nome.replace(/\s+/g, "_")}.pdf`);
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-slate-500">
          <div className="w-8 h-8 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin" />
          <p className="font-medium">Carregando detalhes do equipamento...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="text-slate-800 w-full overflow-x-hidden space-y-6">
      
      {/* Hero Section */}
      <section className="pt-14 md:pt-0">
        <div className="relative overflow-hidden rounded-2xl bg-slate-900 text-white shadow-md">
          {/* Elemento de fundo sutil */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
          
          <div className="relative p-6 md:p-10 flex items-center gap-5">
            <div className="w-16 h-16 rounded-xl bg-white/10 border border-white/10 backdrop-blur-sm flex items-center justify-center shrink-0">
              <Printer size={32} className="text-blue-400" />
            </div>

            <div>
              <p className="text-slate-400 text-sm font-medium mb-1 tracking-wide uppercase">
                Ficha do Equipamento
              </p>

              <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                {impressora.nome}
              </h1>

              <p className="text-slate-300 mt-2 text-sm md:text-base font-medium">
                Modelo: {impressora.modelo}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Grid de Informações */}
      <section className="grid md:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex items-start gap-4 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <MapPin size={24} />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Localidade / Setor
            </h2>
            <p className="text-xl font-bold text-slate-800">
              {impressora.local}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex items-start gap-4 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-lg bg-slate-50 text-slate-600 flex items-center justify-center shrink-0">
            <Hash size={24} />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Número de Série
            </h2>
            <p className="text-xl font-bold text-slate-800">
              {impressora.numero_serie || "Não informado"}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex items-start gap-4 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <Activity size={24} />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Contador de Páginas
            </h2>
            <p className="text-3xl font-bold text-slate-800">
              {(impressora.contador || 0).toLocaleString("pt-BR")}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex items-start gap-4 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <FileText size={24} />
          </div>
          <div className="w-full">
            <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Observações Técnicas
            </h2>
            <p className="text-slate-700 text-sm mt-1 whitespace-pre-wrap leading-relaxed">
              {impressora.observacoes || "Nenhuma observação cadastrada."}
            </p>
          </div>
        </div>
      </section>

      {/* Barra de Ações */}
      <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
        <div className="flex flex-col sm:flex-row flex-wrap gap-3">
          <button
            onClick={() => router.back()}
            className="flex-1 min-w-[160px] bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900 rounded-lg py-2.5 font-semibold transition-colors flex items-center justify-center gap-2 text-sm shadow-sm"
          >
            <ArrowLeft size={18} />
            Voltar
          </button>

          <button
            onClick={() => router.push(`/impressoras/editar/${impressora.id}`)}
            className="flex-1 min-w-[160px] bg-white border border-slate-200 text-slate-700 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 rounded-lg py-2.5 font-semibold transition-colors flex items-center justify-center gap-2 text-sm shadow-sm"
          >
            <Pencil size={18} />
            Editar Dados
          </button>
          
          <button
            onClick={exportarPDFImpressora}
            className="flex-1 min-w-[160px] bg-white border border-slate-200 text-slate-700 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 rounded-lg py-2.5 font-semibold transition-colors flex items-center justify-center gap-2 text-sm shadow-sm"
          >
            <FileText size={18} />
            Exportar PDF
          </button>

          <button
            onClick={() => {
              setNovoContador(String(impressora.contador || ""));
              setAbrirModalContador(true);
            }}
            className="flex-1 min-w-[160px] bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg py-2.5 font-semibold transition-colors flex items-center justify-center gap-2 text-sm shadow-sm"
          >
            <Activity size={18} />
            Atualizar Contador
          </button>
        </div>
      </section>

      {/* Modal Atualizar Contador */}
      {abrirModalContador && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-md p-6 shadow-2xl relative animate-in fade-in zoom-in duration-200">
            
            <div className="flex items-center gap-3 mb-5 border-b border-slate-100 pb-4">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <Activity size={20} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-800">
                  Atualizar Contador
                </h2>
                <p className="text-sm text-slate-500">
                  Informe o volume de páginas atual.
                </p>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Novo valor do contador <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                value={novoContador}
                onChange={(e) => setNovoContador(e.target.value)}
                min="0"
                placeholder="Ex: 145000"
                className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-shadow"
                autoFocus
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setAbrirModalContador(false)}
                className="flex-1 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-lg py-2.5 font-semibold transition-colors text-sm shadow-sm"
              >
                Cancelar
              </button>

              <button
                onClick={atualizarContador}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg py-2.5 font-semibold transition-colors text-sm shadow-sm flex items-center justify-center gap-2"
              >
                Salvar Valor
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}