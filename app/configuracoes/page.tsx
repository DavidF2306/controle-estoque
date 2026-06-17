"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import BotaoBackup from "../components/BotaoBackup";
import {
  Settings,
  UserPlus,
  Trash2,
  ShieldCheck,
  DatabaseBackup,
} from "lucide-react";

export default function Configuracoes() {
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    buscarUsuarios();
  }, []);

  async function buscarUsuarios() {
    const { data } = await supabase
      .from("usuarios_autorizados")
      .select("*")
      .order("email");

    if (data) {
      setUsuarios(data);
    }
  }

  async function adicionarUsuario(e: React.FormEvent) {
    e.preventDefault();

    const nomeFormatado = nome.trim();
    const emailFormatado = email.trim().toLowerCase();

    if (!nomeFormatado || !emailFormatado) return;

    const { error } = await supabase
      .from("usuarios_autorizados")
      .insert([
        {
          nome: nomeFormatado,
          email: emailFormatado,
        },
      ]);

    if (error) {
      alert("Erro ao adicionar usuário: " + error.message);
      return;
    }

    setNome("");
    setEmail("");
    buscarUsuarios();

    alert("Usuário autorizado!");
  }

  async function removerUsuario(id: number, emailUsuario: string) {
    const confirmar = confirm(
      `Remover o acesso de ${emailUsuario}?`
    );

    if (!confirmar) return;

    await supabase
      .from("usuarios_autorizados")
      .delete()
      .eq("id", id);

    buscarUsuarios();
  }

  return (
    <div className="text-gray-900 w-full overflow-x-hidden">

      <div className="pt-14 md:pt-0 mb-8 flex items-center gap-3">
        <div className="w-11 h-11 rounded-2xl bg-blue-600 text-white flex items-center justify-center">
          <Settings size={22} />
        </div>

        <div>
          <h1 className="text-3xl md:text-4xl font-bold">
            Configurações
          </h1>

          <p className="text-gray-500 mt-1">
            Gerencie os usuários autorizados do sistema
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        <form
          onSubmit={adicionarUsuario}
          className="bg-white border border-gray-200 rounded-3xl p-4 md:p-6 shadow-sm h-fit"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <UserPlus size={20} />
            </div>

            <div>
              <h2 className="text-xl font-bold">
                Novo usuário
              </h2>

              <p className="text-sm text-gray-500">
                Autorize uma pessoa para acessar
              </p>
            </div>
          </div>

          <div className="space-y-4">

            <div>
              <label className="block text-sm font-medium mb-2">
                Nome
              </label>

              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Ex: David Lucas"
                className="w-full border border-gray-300 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Email
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@empresa.com"
                className="w-full border border-gray-300 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

          </div>

          <button
            className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-medium transition flex items-center justify-center gap-2"
          >
            <UserPlus size={20} />
            Adicionar usuário
          </button>
        </form>

        <div className="bg-white border border-gray-200 rounded-3xl p-4 md:p-6 shadow-sm h-fit">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-2xl bg-gray-100 text-gray-700 flex items-center justify-center">
              <DatabaseBackup size={20} />
            </div>

            <div>
              <h2 className="text-xl font-bold">
                Backup do sistema
              </h2>

              <p className="text-sm text-gray-500">
                Baixe uma cópia completa dos dados
              </p>
            </div>
          </div>

          <BotaoBackup />
        </div>

        <div className="xl:col-span-2 bg-white border border-gray-200 rounded-3xl p-4 md:p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-2xl bg-green-50 text-green-600 flex items-center justify-center">
              <ShieldCheck size={20} />
            </div>

            <div>
              <h2 className="text-xl font-bold">
                Usuários autorizados
              </h2>

              <p className="text-sm text-gray-500">
                {usuarios.length} usuário(s) com acesso ao sistema
              </p>
            </div>
          </div>

          {usuarios.length === 0 ? (
            <p className="text-gray-500">
              Nenhum usuário autorizado.
            </p>
          ) : (
            <div className="space-y-3">
              {usuarios.map((usuario) => (
                <div
                  key={usuario.id}
                  className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 border border-gray-100 rounded-2xl p-4 hover:bg-gray-50 transition"
                >
                  <div>
                    <p className="font-semibold text-gray-900">
                      {usuario.nome || "Sem nome"}
                    </p>

                    <p className="text-sm text-gray-500 break-all">
                      {usuario.email}
                    </p>
                  </div>

                  <button
                    onClick={() =>
                      removerUsuario(usuario.id, usuario.email)
                    }
                    className="bg-red-50 text-red-600 hover:bg-red-100 px-4 py-2 rounded-xl transition flex items-center justify-center gap-2"
                  >
                    <Trash2 size={16} />
                    Remover
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
}