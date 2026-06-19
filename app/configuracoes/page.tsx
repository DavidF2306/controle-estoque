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
  KeyRound,
} from "lucide-react";

export default function Configuracoes() {
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [usuarioLogado, setUsuarioLogado] = useState<any>(null);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    iniciar();
  }, []);

  async function iniciar() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user?.email) {
      const { data } = await supabase
        .from("usuarios_autorizados")
        .select("*")
        .eq("email", user.email.toLowerCase())
        .maybeSingle();

      setUsuarioLogado(data);
    }

    buscarUsuarios();
  }

  async function buscarUsuarios() {
    const { data } = await supabase
      .from("usuarios_autorizados")
      .select("*")
      .order("email");

    if (data) setUsuarios(data);
  }

  function verificarAdmin() {
    if (!usuarioLogado?.admin) {
      alert("Apenas administradores podem fazer esta ação.");
      return false;
    }

    return true;
  }

  async function adicionarUsuario(e: React.FormEvent) {
    e.preventDefault();

    if (!verificarAdmin()) return;

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

    alert("Usuário autorizado! Agora ele pode criar a conta na tela de cadastro.");
  }

  async function removerUsuario(usuario: any) {
    if (!verificarAdmin()) return;

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

  async function redefinirSenha(usuario: any) {
    if (!verificarAdmin()) return;

    if (!usuario.auth_id) {
      alert(
        "Este usuário ainda não possui auth_id vinculado. Rode a correção no banco ou peça para ele criar a conta."
      );
      return;
    }

    const novaSenha = prompt(
      `Digite a nova senha para ${usuario.nome || usuario.email}:`
    );

    if (!novaSenha) return;

    if (novaSenha.length < 6) {
      alert("A senha precisa ter no mínimo 6 caracteres.");
      return;
    }

    const confirmar = confirm(
      `Confirmar redefinição de senha para ${usuario.email}?`
    );

    if (!confirmar) return;

    const {
      data: { session },
    } = await supabase.auth.getSession();

    const resposta = await fetch("/api/redefinir-senha", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.access_token}`,
      },
      body: JSON.stringify({
        userId: usuario.auth_id,
        novaSenha,
      }),
    });

    const resultado = await resposta.json();

    if (!resposta.ok) {
      alert("Erro ao redefinir senha: " + resultado.error);
      return;
    }

    alert("Senha redefinida com sucesso!");
  }

  const ehAdmin = usuarioLogado?.admin === true;
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
                  Gerencie usuários autorizados, redefina senhas e faça backup do sistema.
                </p>
              </div>
            </div>

            <div className="bg-white/15 border border-white/20 backdrop-blur rounded-[2rem] p-5 min-w-[240px]">
              <p className="text-blue-50 text-sm">Seu acesso</p>

              <p className="text-3xl font-extrabold mt-2">
                {ehAdmin ? "Admin" : "Usuário"}
              </p>

              <p className="text-blue-50 text-sm mt-1 break-all">
                {usuarioLogado?.email || "-"}
              </p>
            </div>
          </div>

          <div className="h-7 bg-white rounded-t-[100%] opacity-95" />
        </div>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-[1.8rem] p-5 shadow-sm">
          <p className="text-sm text-gray-500">Usuários</p>
          <h2 className="text-4xl font-extrabold mt-2">{totalUsuarios}</h2>
          <p className="text-xs text-gray-400 mt-2">com acesso</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-[1.8rem] p-5 shadow-sm">
          <p className="text-sm text-gray-500">Administradores</p>
          <h2 className="text-4xl font-extrabold mt-2">{totalAdmins}</h2>
          <p className="text-xs text-gray-400 mt-2">protegidos</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-[1.8rem] p-5 shadow-sm">
          <p className="text-sm text-gray-500">Usuários comuns</p>
          <h2 className="text-4xl font-extrabold mt-2">{totalComuns}</h2>
          <p className="text-xs text-gray-400 mt-2">removíveis</p>
        </div>
      </section>

      {ehAdmin && (
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
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Nome"
                className="w-full border border-gray-300 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                required
              />

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@empresa.com"
                className="w-full border border-gray-300 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="mt-5 bg-blue-50 border border-blue-100 rounded-3xl p-4">
              <p className="font-bold text-blue-800">Atenção</p>

              <p className="text-sm text-blue-700/80 mt-1">
                Depois de autorizado, o usuário deve criar conta na tela de cadastro.
                Se ele já existia no Auth, rode a correção de auth_id no banco.
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

            <BotaoBackup />
          </div>
        </section>
      )}

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
                  {usuario.admin ? <Crown size={22} /> : <Users size={22} />}
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

                    {!usuario.auth_id && (
                      <span className="bg-orange-50 text-orange-700 px-3 py-1 rounded-full text-xs font-bold">
                        Sem auth_id
                      </span>
                    )}
                  </div>

                  <p className="text-sm text-gray-500 break-all mt-1">
                    {usuario.email}
                  </p>
                </div>
              </div>

              {ehAdmin ? (
                <div className="flex flex-col sm:flex-row gap-2">
                  <button
                    onClick={() => redefinirSenha(usuario)}
                    className="bg-blue-50 text-blue-700 hover:bg-blue-100 px-4 py-3 rounded-2xl transition flex items-center justify-center gap-2 font-bold"
                  >
                    <KeyRound size={16} />
                    Redefinir senha
                  </button>

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
              ) : (
                <span className="bg-gray-100 text-gray-500 px-4 py-3 rounded-2xl font-bold">
                  Somente visualização
                </span>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}