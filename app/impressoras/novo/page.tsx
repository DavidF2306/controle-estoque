"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Save,
  Printer,
  PlusCircle,
} from "lucide-react";

export default function NovaImpressora() {
  const router = useRouter();

  const [modelo, setModelo] = useState("");
  const [local, setLocal] = useState("");
  const [numeroSerie, setNumeroSerie] = useState("");
  const [contador, setContador] = useState("");
  const [observacoes, setObservacoes] = useState("");

  async function salvarImpressora(e: React.FormEvent) {
    e.preventDefault();

    const { error } = await supabase
      .from("impressoras")
      .insert([
        {
          modelo,
          local,
          numero_serie: numeroSerie || null,
          contador: contador ? Number(contador) : null,
          observacoes: observacoes || null,
        },
      ]);

    if (error) {
      alert("Erro ao cadastrar impressora: " + error.message);
      return;
    }

    alert("Impressora cadastrada com sucesso!");
    router.push("/impressoras");
  }

  return (
    <div className="text-gray-900 w-full overflow-x-hidden space-y-8">

      <section className="pt-14 md:pt-0">
        <div className="rounded-[2rem] bg-gradient-to-br from-blue-600 to-cyan-500 text-white p-8">

          <div className="flex items-center gap-4">

            <div className="w-20 h-20 rounded-[2rem] bg-white/20 flex items-center justify-center">
              <PlusCircle size={40} />
            </div>

            <div>
              <p className="text-blue-100">
                Estoque Copystar
              </p>

              <h1 className="text-5xl font-extrabold">
                Nova Impressora
              </h1>

              <p className="mt-2 text-blue-100">
                Cadastre uma impressora para controle por local.
              </p>
            </div>

          </div>

        </div>
      </section>

      <form
        onSubmit={salvarImpressora}
        className="bg-white rounded-[2rem] border border-gray-200 shadow-sm p-8 space-y-6"
      >
                <div>
          <label className="block text-sm font-medium mb-2">
            Modelo da impressora
          </label>

          <input
            type="text"
            value={modelo}
            onChange={(e) => setModelo(e.target.value)}
            placeholder="Ex: Kyocera M2040DN"
            className="w-full border border-gray-300 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Local
          </label>

          <input
            type="text"
            value={local}
            onChange={(e) => setLocal(e.target.value)}
            placeholder="Ex: FIEMA"
            className="w-full border border-gray-300 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">

          <div>
            <label className="block text-sm font-medium mb-2">
              Número de série (opcional)
            </label>

            <input
              type="text"
              value={numeroSerie}
              onChange={(e) => setNumeroSerie(e.target.value)}
              placeholder="Número de série"
              className="w-full border border-gray-300 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Contador (opcional)
            </label>

            <input
              type="number"
              value={contador}
              onChange={(e) => setContador(e.target.value)}
              placeholder="0"
              className="w-full border border-gray-300 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Observações
          </label>

          <textarea
            value={observacoes}
            onChange={(e) => setObservacoes(e.target.value)}
            rows={4}
            placeholder="Informações adicionais..."
            className="w-full border border-gray-300 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </div>

        <div className="flex gap-3">

          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl flex items-center gap-2 font-bold"
          >
            <Save size={20} />
            Salvar Impressora
          </button>

          <button
            type="button"
            onClick={() => router.push("/impressoras")}
            className="bg-gray-900 hover:bg-black text-white px-6 py-3 rounded-2xl flex items-center gap-2 font-bold"
          >
            <ArrowLeft size={20} />
            Voltar
          </button>

        </div>

      </form>

    </div>
  );
}