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
  Crown,
  Users,
  LockKeyhole,
  CheckCircle,
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

    if (data) setUsuarios(data);
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
          admin: false,
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

  async function removerUsuario(usuario: any) {
    if (usuario.admin) {
      alert("Este usuário é administrador e não pode ser removido.");
      return;
    }

    const confirmar = confirm(`Remover o acesso de ${usuario.email}?`);

    if (!confirmar) return;

    const { error } = await supabase
      .from("usuarios_autorizados")
      .delete()
      .eq("id", usuario.id);

    if (error) {
      alert("Erro ao remover usuário: " + error.message);
      return;
    }

    buscarUsuarios();
  }

  const totalUsuarios = usuarios.length;
  const totalAdmins = usuarios.filter((u) => u.admin).length;
  const totalComuns = totalUsuarios - totalAdmins;

  return (
    <div className="text-gray-900 w-full overflow-x-hidden space-y-8">

      <section className="pt-14 md:pt-0">
        <div className="relative overflow-hidden rounded-[2.2rem] bg-gradient-to-br from-slate-900 via-indigo-700 to-blue-600 text-white shadow-lg">
          <div className="absolute -top-24 -right-20 w-80 h-80 bg-white/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-cyan-300/20 rounded-full blur-3xl" />

          <div className="relative p-6 md:p-10 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-8">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-[2rem] bg-white/20 border border-white/30 flex items-center justify-center">
                <Settings size={40} />
              </div>

              <div>
                <p className="text-blue-50 text-sm font-medium mb-1">
                  Estoque Copystar
                </p>

                <h1 className="text-4xl md:text-6xl font-extrabold">
                  Configurações
                </h1>

                <p className="text-blue-50 mt-2 max-w-2xl">
                  Gerencie usuários autorizados, proteja administradores e faça backup dos dados do sistema.
                </p>
              </div>
            </div>

            <div className="bg-white/15 border border-white/20 backdrop-blur rounded-[2rem] p-5 min-w-[240px]">
              <p className="text-blue-50 text-sm">
                Acesso autorizado
              </p>

              <p className="text-4xl font-extrabold mt-2">
                {totalUsuarios}
              </p>

              <p className="text-blue-50 text-sm mt-1">
                usuário(s) no sistema
              </p>

              <p className="text-xs text-blue-50 mt-3">
                {totalAdmins} administrador(es) protegido(s)
              </p>
            </div>
          </div>

          <div className="h-7 bg-white rounded-t-[100%] opacity-95" />
        </div>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-[1.8rem] p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Usuários</p>
              <h2 className="text-4xl font-extrabold mt-2">
                {totalUsuarios}
              </h2>
              <p className="text-xs text-gray-400 mt-2">
                com acesso
              </p>
            </div>

            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center">
              <Users size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-[1.8rem] p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Administradores</p>
              <h2 className="text-4xl font-extrabold mt-2">
                {totalAdmins}
              </h2>
              <p className="text-xs text-gray-400 mt-2">
                protegidos
              </p>
            </div>

            <div className="w-12 h-12 rounded-2xl bg-violet-50 text-violet-700 flex items-center justify-center">
              <Crown size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-[1.8rem] p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Usuários comuns</p>
              <h2 className="text-4xl font-extrabold mt-2">
                {totalComuns}
              </h2>
              <p className="text-xs text-gray-400 mt-2">
                removíveis
              </p>
            </div>

            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <CheckCircle size={24} />
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        <form
          onSubmit={adicionarUsuario}
          className="bg-white border border-gray-200 rounded-[2rem] p-4 md:p-6 shadow-sm h-fit"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center">
              <UserPlus size={22} />
            </div>

            <div>
              <h2 className="text-xl md:text-2xl font-extrabold">
                Novo usuário
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Autorize uma pessoa para acessar o sistema
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

          <div className="mt-5 bg-blue-50 border border-blue-100 rounded-3xl p-4">
            <p className="font-bold text-blue-800">
              Atenção
            </p>

            <p className="text-sm text-blue-700/80 mt-1">
              O email precisa estar autorizado aqui para conseguir cadastrar e acessar o Estoque Copystar.
            </p>
          </div>

          <button className="w-full mt-5 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-bold transition flex items-center justify-center gap-2">
            <UserPlus size={20} />
            Adicionar usuário
          </button>
        </form>

        <div className="bg-white border border-gray-200 rounded-[2rem] p-4 md:p-6 shadow-sm h-fit">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-11 h-11 rounded-2xl bg-violet-50 text-violet-700 flex items-center justify-center">
              <DatabaseBackup size={22} />
            </div>

            <div>
              <h2 className="text-xl md:text-2xl font-extrabold">
                Backup do sistema
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Baixe uma cópia completa dos dados
              </p>
            </div>
          </div>

          <div className="bg-violet-50 border border-violet-100 rounded-3xl p-4 mb-5">
            <p className="font-bold text-violet-800">
              Proteção de dados
            </p>

            <p className="text-sm text-violet-700/80 mt-1">
              O backup exporta produtos, entradas, saídas, locais e usuários autorizados.
            </p>
          </div>

          <BotaoBackup />
        </div>

      </section>

      <section className="bg-white border border-gray-200 rounded-[2rem] p-4 md:p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <ShieldCheck size={22} />
          </div>

          <div>
            <h2 className="text-xl md:text-2xl font-extrabold">
              Usuários autorizados
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              {usuarios.length} usuário(s) com acesso ao sistema
            </p>
          </div>
        </div>

        {usuarios.length === 0 ? (
          <div className="border border-dashed border-gray-200 rounded-3xl p-6 text-center text-gray-500">
            Nenhum usuário autorizado.
          </div>
        ) : (
          <div className="space-y-3">
            {usuarios.map((usuario) => (
              <div
                key={usuario.id}
                className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border border-gray-100 rounded-3xl p-4 hover:bg-blue-50/40 transition"
              >
                <div className="flex items-start gap-3">
                  <div
                    className={
                      usuario.admin
                        ? "w-12 h-12 rounded-2xl bg-violet-50 text-violet-700 flex items-center justify-center shrink-0"
                        : "w-12 h-12 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0"
                    }
                  >
                    {usuario.admin ? (
                      <Crown size={22} />
                    ) : (
                      <Users size={22} />
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-extrabold text-gray-900">
                        {usuario.nome || "Sem nome"}
                      </p>

                      {usuario.admin ? (
                        <span className="bg-violet-50 text-violet-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                          <Crown size={14} />
                          Administrador
                        </span>
                      ) : (
                        <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">
                          Usuário
                        </span>
                      )}
                    </div>

                    <p className="text-sm text-gray-500 break-all mt-1">
                      {usuario.email}
                    </p>
                  </div>
                </div>

                {usuario.admin ? (
                  <button
                    disabled
                    className="bg-gray-100 text-gray-400 px-4 py-3 rounded-2xl flex items-center justify-center gap-2 cursor-not-allowed font-bold"
                  >
                    <LockKeyhole size={16} />
                    Protegido
                  </button>
                ) : (
                  <button
                    onClick={() => removerUsuario(usuario)}
                    className="bg-red-50 text-red-600 hover:bg-red-100 px-4 py-3 rounded-2xl transition flex items-center justify-center gap-2 font-bold"
                  >
                    <Trash2 size={16} />
                    Remover
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

    </div>
  );
}