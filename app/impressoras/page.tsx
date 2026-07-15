"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

import {
  Printer,
  Plus,
  Search,
  Pencil,
  Trash2,
  Hash,
  MapPin,
  FileText,
} from "lucide-react";

export default function Impressoras() {
  const [impressoras, setImpressoras] = useState<any[]>([]);
  const [busca, setBusca] = useState("");

  useEffect(() => {
    buscarImpressoras();
  }, []);

  async function buscarImpressoras() {
    const { data } = await supabase
      .from("impressoras")
      .select("*")
      .order("local")
      .order("nome");

    if (data) setImpressoras(data);
  }

  async function excluirImpressora(id: number) {
    const confirmar = confirm(
      "Deseja realmente excluir esta impressora?"
    );

    if (!confirmar) return;

    await supabase
      .from("impressoras")
      .delete()
      .eq("id", id);

    buscarImpressoras();
  }

  const impressorasFiltradas = impressoras.filter((item) =>
    item.nome?.toLowerCase().includes(busca.toLowerCase()) ||
    item.modelo?.toLowerCase().includes(busca.toLowerCase()) ||
    item.local?.toLowerCase().includes(busca.toLowerCase()) ||
    item.numero_serie?.toLowerCase().includes(busca.toLowerCase())
  );

  const totalImpressoras = impressoras.length;
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
              className="bg-white text-blue-700 hover:bg-blue-50 px-5 py-3 rounded-2xl font-bold transition flex items-center justify-center gap-2"
            >
              <Plus size={20} />
              Nova Impressora
            </Link>

          </div>

          <div className="h-7 bg-white rounded-t-[100%] opacity-95" />
        </div>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">

        <div className="bg-white border border-gray-200 rounded-[1.8rem] p-5 shadow-sm">
          <p className="text-sm text-gray-500">
            Impressoras cadastradas
          </p>

          <h2 className="text-4xl font-extrabold mt-2">
            {totalImpressoras}
          </h2>

          <p className="text-xs text-gray-400 mt-2">
            equipamentos
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-[1.8rem] p-5 shadow-sm">
          <label className="block text-sm font-medium mb-2">
            Buscar
          </label>

          <div className="relative">

            <Search
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              placeholder="Nome, modelo, local ou número de série..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="w-full border border-gray-300 rounded-2xl pl-12 pr-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            />

          </div>
        </div>

      </section>
            <section className="space-y-4">

        {impressorasFiltradas.map((item) => (
          <div
            key={item.id}
            className="bg-white border border-gray-200 rounded-[2rem] p-5 shadow-sm hover:shadow-md transition"
          >

            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

              <div className="space-y-3">

                <h2 className="text-2xl font-extrabold">
                  {item.nome}
                </h2>

                <div className="flex flex-wrap gap-3 text-sm text-gray-600">

                  <span className="flex items-center gap-2">
                    <Printer size={16} />
                    {item.modelo}
                  </span>

                  <span className="flex items-center gap-2">
                    <MapPin size={16} />
                    {item.local}
                  </span>

                  <span className="flex items-center gap-2">
                    <Hash size={16} />
                    {item.numero_serie || "-"}
                  </span>

                </div>

                <div className="flex flex-wrap gap-6">

                  <div>
                    <p className="text-xs text-gray-500">
                      Contador
                    </p>

                    <p className="font-bold text-lg">
                      {item.contador || 0}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">
                      Observações
                    </p>

                    <p className="font-medium">
                      {item.observacoes || "-"}
                    </p>
                  </div>

                </div>

              </div>

              <div className="flex gap-3">

                <Link
                  href={`/impressoras/editar/${item.id}`}
                  className="bg-yellow-50 text-yellow-700 px-5 py-3 rounded-2xl hover:bg-yellow-100 transition flex items-center gap-2 font-bold"
                >
                  <Pencil size={18} />
                  Editar
                </Link>

                <button
                  onClick={() => excluirImpressora(item.id)}
                  className="bg-red-50 text-red-600 px-5 py-3 rounded-2xl hover:bg-red-100 transition flex items-center gap-2 font-bold"
                >
                  <Trash2 size={18} />
                  Excluir
                </button>

              </div>

            </div>

          </div>
        ))}

        {impressorasFiltradas.length === 0 && (
          <div className="bg-white border border-dashed border-gray-300 rounded-[2rem] p-10 text-center text-gray-500">
            Nenhuma impressora encontrada.
          </div>
        )}

      </section>

    </div>
  );
}