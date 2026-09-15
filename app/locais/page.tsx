"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

import {
  MapPin,
  Plus,
  Trash2,
  Building2,
  CheckCircle,
  Archive,
} from "lucide-react";

export default function Locais() {
  const [locais, setLocais] = useState<any[]>([]);
  const [nome, setNome] = useState("");

  useEffect(() => {
    buscarLocais();
  }, []);

  async function buscarLocais() {
    const { data } = await supabase
      .from("locais")
      .select("*")
      .order("nome");

    if (data) {
      setLocais(data);
    }
  }

  async function salvarLocal(e: React.FormEvent) {
    e.preventDefault();

    const { data: existente } = await supabase
      .from("locais")
      .select("id")
      .eq("nome", nome)
      .maybeSingle();

    if (existente) {
      alert("Este local já está cadastrado.");
      return;
    }

    const { error } = await supabase.from("locais").insert([
      {
        nome,
      },
    ]);

    if (error) {
      alert(error.message);
      return;
    }

    setNome("");
    buscarLocais();
  }

  async function excluirLocal(id: number) {
    const confirmar = confirm("Deseja realmente excluir este local?");

    if (!confirmar) return;

    const local = locais.find((l) => l.id === id);

    if (!local) return;

    const { data: impressoras } = await supabase
      .from("impressoras")
      .select("id")
      .eq("local", local.nome);

    if (impressoras && impressoras.length > 0) {
      alert(
        "Não é possível excluir este local, pois ele está sendo utilizado por uma ou mais impressoras."
      );
      return;
    }

    const { error } = await supabase.from("locais").delete().eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    buscarLocais();
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
              <MapPin size={32} className="text-blue-400" />
            </div>

            <div>
              <p className="text-slate-400 text-sm font-medium mb-1 tracking-wide uppercase">
                Parque de Impressão
              </p>

              <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                Locais e Setores
              </h1>

              <p className="text-slate-400 mt-2 text-sm md:text-base max-w-2xl">
                Cadastre as localidades e setores disponíveis para alocação dos equipamentos.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid md:grid-cols-2 gap-6">
        
        {/* Formulário de Novo Local */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 md:p-6 shadow-sm h-fit">
          <div className="flex items-center gap-3 mb-5 border-b border-slate-100 pb-4">
            <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Plus size={20} />
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-800">
                Novo Local
              </h2>
              <p className="text-sm text-slate-500">
                Adicione um novo setor ao sistema.
              </p>
            </div>
          </div>

          <form onSubmit={salvarLocal} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Nome do Local / Setor <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Ex: Recepção, RH, Filial Centro..."
                className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-2.5 font-semibold flex items-center justify-center gap-2 transition-colors text-sm shadow-sm"
            >
              <Plus size={18} />
              Cadastrar Local
            </button>

            <div className="bg-emerald-50 border border-emerald-200/60 rounded-lg p-4 flex items-start gap-3 mt-4">
              <CheckCircle className="text-emerald-600 shrink-0 mt-0.5" size={18} />
              <div>
                <p className="font-semibold text-emerald-800 text-sm">Integração Automática</p>
                <p className="text-xs text-emerald-700/80 mt-1 leading-relaxed">
                  Todo local cadastrado aparecerá automaticamente como opção na tela de cadastro e edição de impressoras e saídas de estoque.
                </p>
              </div>
            </div>
          </form>
        </div>

        {/* Lista de Locais */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 md:p-6 shadow-sm flex flex-col">
          <div className="flex items-center gap-3 mb-5 border-b border-slate-100 pb-4">
            <div className="w-10 h-10 rounded-lg bg-slate-50 text-slate-600 flex items-center justify-center shrink-0">
              <Building2 size={20} />
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-800">
                Locais Cadastrados
              </h2>
              <p className="text-sm text-slate-500">
                {locais.length} setor(es) disponível(is)
              </p>
            </div>
          </div>

          <div className="flex-1">
            {locais.length === 0 ? (
              <div className="h-full min-h-[200px] flex flex-col items-center justify-center text-slate-400 border border-dashed border-slate-200 rounded-lg p-6 bg-slate-50/50">
                <Archive size={32} className="mb-3 text-slate-300" />
                <p className="text-sm font-medium text-slate-500">Nenhum local cadastrado.</p>
                <p className="text-xs mt-1">Utilize o formulário ao lado para adicionar.</p>
              </div>
            ) : (
              <div className="space-y-3 overflow-y-auto max-h-[400px] pr-2 custom-scrollbar">
                {locais.map((local) => (
                  <div
                    key={local.id}
                    className="flex items-center justify-between border border-slate-200 rounded-lg p-4 bg-white hover:border-slate-300 hover:shadow-sm transition-all"
                  >
                    <div>
                      <h3 className="font-semibold text-slate-800">
                        {local.nome}
                      </h3>
                      <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider mt-0.5">
                        ID: {local.id}
                      </p>
                    </div>

                    <button
                      onClick={() => excluirLocal(local.id)}
                      title="Excluir Local"
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </section>
    </div>
  );
}