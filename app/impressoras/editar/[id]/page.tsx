"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useParams, useRouter } from "next/navigation";

import {
  ArrowLeft,
  Save,
  Printer,
  Pencil,
  CheckCircle,
} from "lucide-react";

export default function EditarImpressora() {
  const params = useParams();
  const router = useRouter();

  const [nome, setNome] = useState("");
  const [modelo, setModelo] = useState("");
  const [local, setLocal] = useState("");
  const [numeroSerie, setNumeroSerie] = useState("");
  const [contador, setContador] = useState("");
  const [observacoes, setObservacoes] = useState("");
  const [loading, setLoading] = useState(true);
  const [locais, setLocais] = useState<any[]>([]);

  useEffect(() => {
    buscarLocais();
    buscarImpressora();
  }, []);

  async function buscarLocais() {
    const { data } = await supabase.from("locais").select("*").order("nome");
    if (data) setLocais(data);
  }

  async function buscarImpressora() {
    const { data } = await supabase
      .from("impressoras")
      .select("*")
      .eq("id", params.id)
      .single();

    if (data) {
      setNome(data.nome || "");
      setModelo(data.modelo || "");
      setLocal(data.local || "");
      setNumeroSerie(data.numero_serie || "");
      setContador(String(data.contador || ""));
      setObservacoes(data.observacoes || "");
    }

    setLoading(false);
  }

  async function atualizarImpressora(e: React.FormEvent) {
    e.preventDefault();

    const { error } = await supabase
      .from("impressoras")
      .update({
        nome,
        modelo,
        local,
        numero_serie: numeroSerie || null,
        contador: contador ? Number(contador) : null,
        observacoes,
      })
      .eq("id", params.id);

    if (error) {
      alert("Erro ao atualizar impressora: " + error.message);
      return;
    }

    alert("Impressora atualizada com sucesso!");
    router.push("/impressoras");
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-slate-500">
          <div className="w-8 h-8 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin" />
          <p className="font-medium">Carregando dados da impressora...</p>
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
              <Pencil size={32} className="text-blue-400" />
            </div>

            <div>
              <p className="text-slate-400 text-sm font-medium mb-1 tracking-wide uppercase">
                Parque de Impressão
              </p>

              <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                Editar Impressora
              </h1>

              <p className="text-slate-400 mt-2 text-sm md:text-base max-w-2xl">
                Atualize os dados e as especificações da impressora cadastrada no sistema.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Formulário de Edição (Corrigido para w-full) */}
      <form
        onSubmit={atualizarImpressora}
        className="bg-white border border-slate-200 rounded-xl p-5 md:p-6 shadow-sm space-y-6 w-full"
      >
        <div className="flex items-center gap-3 mb-4 border-b border-slate-100 pb-4">
          <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Printer size={20} />
          </div>

          <div>
            <h2 className="text-lg font-bold text-slate-800">
              Dados da Impressora
            </h2>
            <p className="text-sm text-slate-500">
              Modifique as informações necessárias abaixo
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          {/* Nome */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Nome de Identificação <span className="text-rose-500">*</span>
            </label>
            <input
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Ex: Impressora Recepção"
              className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
              required
            />
          </div>

          {/* Modelo */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Modelo <span className="text-rose-500">*</span>
            </label>
            <input
              value={modelo}
              onChange={(e) => setModelo(e.target.value)}
              placeholder="Ex: Brother DCP-L5652DN"
              className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
              required
            />
          </div>

          {/* Local */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Localidade / Setor <span className="text-rose-500">*</span>
            </label>
            <select
              value={local}
              onChange={(e) => setLocal(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
              required
            >
              <option value="">Selecione o local de alocação</option>
              {locais.map((item) => (
                <option key={item.id} value={item.nome}>
                  {item.nome}
                </option>
              ))}
            </select>
          </div>

          {/* Número de Série */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Número de Série (S/N)
            </label>
            <input
              value={numeroSerie}
              onChange={(e) => setNumeroSerie(e.target.value)}
              placeholder="Ex: E71822M9J312"
              className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-5 pt-2">
          {/* Contador */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Contador Atual de Páginas
            </label>
            <input
              type="number"
              value={contador}
              onChange={(e) => setContador(e.target.value)}
              placeholder="Ex: 125000"
              min="0"
              className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
            />
          </div>

          {/* Observações */}
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Observações ou Detalhes Técnicos
            </label>
            <textarea
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              rows={3}
              className="w-full bg-white border border-slate-200 rounded-lg px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow resize-none"
              placeholder="Registre qualquer detalhe extra como IP, manutenções recentes, ou problemas crônicos..."
            />
          </div>
        </div>

        {/* Informação */}
        <div className="bg-emerald-50 border border-emerald-200/60 rounded-lg p-4 flex items-start gap-3 mt-2">
          <CheckCircle className="text-emerald-600 shrink-0 mt-0.5" size={18} />
          <div>
            <p className="font-semibold text-emerald-800 text-sm">Atualização Imediata</p>
            <p className="text-xs text-emerald-700/80 mt-1 leading-relaxed">
              As alterações feitas no cadastro da impressora serão refletidas imediatamente em todos os relatórios e consultas do sistema.
            </p>
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-100">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 text-sm shadow-sm"
          >
            <Save size={18} />
            Salvar Alterações
          </button>

          <button
            type="button"
            onClick={() => router.push("/impressoras")}
            className="bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900 px-6 py-2.5 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 text-sm shadow-sm"
          >
            <ArrowLeft size={18} />
            Voltar para Lista
          </button>
        </div>
      </form>
    </div>
  );
}