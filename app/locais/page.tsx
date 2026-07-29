"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

import {
  MapPin,
  Plus,
  Trash2,
  Building2,
  CheckCircle,
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

    const { error } = await supabase
      .from("locais")
      .insert([
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
  const confirmar = confirm(
    "Deseja realmente excluir este local?"
  );

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

  const { error } = await supabase
    .from("locais")
    .delete()
    .eq("id", id);

  if (error) {
    alert(error.message);
    return;
  }

  buscarLocais();
}


  return (
    <div className="text-gray-900 w-full overflow-x-hidden space-y-8">

      <section className="pt-14 md:pt-0">
        <div className="relative overflow-hidden rounded-[2.2rem] bg-gradient-to-br from-blue-500 via-sky-500 to-cyan-500 text-white shadow-lg">

          <div className="relative p-6 md:p-10 flex items-center gap-4">

            <div className="w-20 h-20 rounded-[2rem] bg-white/20 border border-white/30 flex items-center justify-center">
              <MapPin size={38}/>
            </div>

            <div>

              <p className="text-blue-50 text-sm font-medium mb-1">
                Estoque Copystar
              </p>

              <h1 className="text-4xl md:text-6xl font-extrabold">
                Locais
              </h1>

              <p className="text-blue-50 mt-2">
                Cadastre os locais disponíveis para utilização nas impressoras.
              </p>

            </div>

          </div>

          <div className="h-7 bg-white rounded-t-[100%] opacity-95"/>

        </div>
      </section>

      <section className="grid md:grid-cols-2 gap-4">

        <div className="bg-white border rounded-[2rem] p-6 shadow-sm">

          <div className="flex items-center gap-3 mb-6">

            <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center">
              <Plus size={22}/>
            </div>

            <div>

              <h2 className="text-2xl font-extrabold">
                Novo Local
              </h2>

              <p className="text-gray-500 text-sm">
                Esse local ficará disponível na tela de Impressoras.
              </p>

            </div>

          </div>

          <form
            onSubmit={salvarLocal}
            className="space-y-5"
          >
            <div>
              <label className="block text-sm font-medium mb-2">
                Nome do Local
              </label>

              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Ex: FIEMA"
                className="w-full border border-gray-300 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-2xl py-3 font-bold flex items-center justify-center gap-2 transition"
            >
              <Plus size={20} />
              Cadastrar Local
            </button>

            <div className="bg-emerald-50 border border-emerald-100 rounded-3xl p-4 flex items-start gap-3">

              <CheckCircle
                className="text-emerald-700 shrink-0 mt-0.5"
                size={20}
              />

              <div>

                <p className="font-bold text-emerald-800">
                  Integração automática
                </p>

                <p className="text-sm text-emerald-700 mt-1">
                  Todo local cadastrado aparecerá automaticamente na tela
                  de cadastro e edição de impressoras.
                </p>

              </div>

            </div>

          </form>

        </div>

        <div className="bg-white border rounded-[2rem] p-6 shadow-sm">

          <div className="flex items-center gap-3 mb-6">

            <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center">
              <Building2 size={22}/>
            </div>

            <div>

              <h2 className="text-2xl font-extrabold">
                Locais cadastrados
              </h2>

              <p className="text-sm text-gray-500">
                Estes locais são utilizados pelas impressoras.
              </p>

            </div>

          </div>

          <div className="space-y-3">

            {locais.length === 0 ? (

              <div className="border border-dashed rounded-3xl p-6 text-center text-gray-500">
                Nenhum local cadastrado.
              </div>

            ) : (

              locais.map((local) => (

                <div
                  key={local.id}
                  className="flex items-center justify-between border border-gray-200 rounded-3xl p-4 hover:bg-gray-50 transition"
                >

                  <div>

                    <h3 className="font-bold text-lg">
                      {local.nome}
                    </h3>

                    <p className="text-sm text-gray-500">
                      ID: {local.id}
                    </p>

                  </div>

                  <button
                    onClick={() => excluirLocal(local.id)}
                    className="bg-red-50 hover:bg-red-100 text-red-600 rounded-2xl px-4 py-3 transition flex items-center gap-2 font-bold"
                  >
                    <Trash2 size={18} />
                    Excluir
                  </button>

                </div>

              ))

            )}

          </div>

        </div>

      </section>

    </div>
  );
}