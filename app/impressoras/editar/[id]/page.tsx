"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useParams, useRouter } from "next/navigation";

import {
  ArrowLeft,
  Save,
  Printer,
  Pencil,
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

  useEffect(() => {
    buscarImpressora();
  }, []);

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

  async function atualizarImpressora(
    e: React.FormEvent
  ) {
    e.preventDefault();

    const { error } = await supabase
      .from("impressoras")
      .update({
        nome,
        modelo,
        local,
        numero_serie: numeroSerie || null,
        contador: contador
          ? Number(contador)
          : null,
        observacoes,
      })
      .eq("id", params.id);

    if (error) {
      alert("Erro: " + error.message);
      return;
    }

    alert("Impressora atualizada!");

    router.push("/impressoras");
  }

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

          <div className="relative p-6 md:p-10 flex items-center gap-4">

            <div className="w-20 h-20 rounded-[2rem] bg-white/20 border border-white/30 flex items-center justify-center">
              <Pencil size={40} />
            </div>

            <div>
              <p className="text-blue-50 text-sm font-medium mb-1">
                Estoque Copystar
              </p>

              <h1 className="text-4xl md:text-6xl font-extrabold">
                Editar Impressora
              </h1>

              <p className="text-blue-50 mt-2">
                Atualize os dados da impressora cadastrada.
              </p>
            </div>

          </div>

          <div className="h-7 bg-white rounded-t-[100%] opacity-95" />

        </div>
      </section>

      <form
        onSubmit={atualizarImpressora}
        className="bg-white border border-gray-200 rounded-[2rem] p-8 shadow-sm space-y-6 max-w-5xl"
      >

        <div className="flex items-center gap-3">

          <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center">
            <Printer size={22} />
          </div>

          <div>
            <h2 className="text-2xl font-extrabold">
              Dados da Impressora
            </h2>

            <p className="text-gray-500 text-sm">
              Altere as informações que desejar.
            </p>
          </div>

        </div>

        <div className="grid md:grid-cols-2 gap-5">

          <div>
            <label className="block text-sm font-medium mb-2">
              Nome
            </label>

            <input
              value={nome}
              onChange={(e)=>setNome(e.target.value)}
              className="w-full border rounded-2xl px-4 py-3"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Modelo
            </label>

            <input
              value={modelo}
              onChange={(e)=>setModelo(e.target.value)}
              className="w-full border rounded-2xl px-4 py-3"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Local
            </label>

            <input
              value={local}
              onChange={(e)=>setLocal(e.target.value)}
              className="w-full border rounded-2xl px-4 py-3"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Número de Série
            </label>

            <input
              value={numeroSerie}
              onChange={(e)=>setNumeroSerie(e.target.value)}
              className="w-full border rounded-2xl px-4 py-3"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-5">

          <div>
            <label className="block text-sm font-medium mb-2">
              Contador
            </label>

            <input
              type="number"
              value={contador}
              onChange={(e) => setContador(e.target.value)}
              className="w-full border rounded-2xl px-4 py-3"
              placeholder="Ex: 125000"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Observações
            </label>

            <textarea
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              rows={4}
              className="w-full border rounded-2xl px-4 py-3 resize-none"
              placeholder="Observações da impressora..."
            />
          </div>

        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-3">

          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-bold flex items-center justify-center gap-2 transition"
          >
            <Save size={20} />
            Salvar Alterações
          </button>

          <button
            type="button"
            onClick={() => router.push("/impressoras")}
            className="bg-gray-900 hover:bg-black text-white px-6 py-3 rounded-2xl font-bold flex items-center justify-center gap-2 transition"
          >
            <ArrowLeft size={20} />
            Voltar
          </button>

        </div>

      </form>

    </div>
  );
}