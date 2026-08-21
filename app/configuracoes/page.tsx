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
  KeyRound,
  Eye,
  EyeOff,
  UserCircle,
} from "lucide-react";

export default function Configuracoes() {
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [usuarioLogado, setUsuarioLogado] = useState<any>(null);

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senhaTemporaria, setSenhaTemporaria] = useState("");
  const [mostrarSenhaTemporaria, setMostrarSenhaTemporaria] = useState(false);

  const [minhaSenha, setMinhaSenha] = useState("");
  const [confirmarMinhaSenha, setConfirmarMinhaSenha] = useState("");
  const [mostrarMinhaSenha, setMostrarMinhaSenha] = useState(false);
  const [mostrarConfirmarMinhaSenha, setMostrarConfirmarMinhaSenha] = useState(false);

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
      alert("Apenas administradores podem realizar esta ação.");
      return false;
    }
    return true;
  }

  async function adicionarUsuario(e: React.FormEvent) {
    e.preventDefault();

    if (!verificarAdmin()) return;

    const nomeFormatado = nome.trim();
    const emailFormatado = email.trim().toLowerCase();

    if (!nomeFormatado || !emailFormatado || !senhaTemporaria) {
      alert("Preencha todos os campos obrigatórios (nome, email e senha).");
      return;
    }

    if (senhaTemporaria.length < 6) {
      alert("A senha temporária precisa ter no mínimo 6 caracteres.");
      return;
    }

    const {
      data: { session },
    } = await supabase.auth.getSession();

    const resposta = await fetch("/api/criar-usuario", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.access_token}`,
      },
      body: JSON.stringify({
        nome: nomeFormatado,
        email: emailFormatado,
        senha: senhaTemporaria,
      }),
    });

    const resultado = await resposta.json();

    if (!resposta.ok) {
      alert("Erro ao criar usuário: " + resultado.error);
      return;
    }

    alert("Usuário criado com sucesso no sistema!");

    setNome("");
    setEmail("");
    setSenhaTemporaria("");
    buscarUsuarios();
  }

  async function removerUsuario(usuario: any) {
    if (!verificarAdmin()) return;

    if (usuario.admin) {
      alert("Este usuário é administrador e não pode ser removido pelo painel.");
      return;
    }

    const confirmar = confirm(`Tem certeza que deseja revogar o acesso de ${usuario.email}?`);
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
      alert("Este usuário está sem ID de Autenticação (auth_id). Será necessário recriar o usuário.");
      return;
    }

    const novaSenha = prompt(
      `Defina uma nova senha temporária para ${usuario.nome || usuario.email}:`
    );

    if (!novaSenha) return;

    if (novaSenha.length < 6) {
      alert("A senha precisa ter no mínimo 6 caracteres de segurança.");
      return;
    }

    const confirmar = confirm(
      `Confirmar a redefinição de senha para a conta ${usuario.email}?`
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

    alert("Senha redefinida com êxito!");
  }

  async function alterarMinhaSenha(e: React.FormEvent) {
    e.preventDefault();

    if (!minhaSenha || !confirmarMinhaSenha) {
      alert("Preencha ambos os campos de senha.");
      return;
    }

    if (minhaSenha !== confirmarMinhaSenha) {
      alert("As senhas informadas não coincidem.");
      return;
    }

    if (minhaSenha.length < 6) {
      alert("Sua nova senha precisa ter no mínimo 6 caracteres.");
      return;
    }

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
        userId: session?.user.id,
        novaSenha: minhaSenha,
      }),
    });

    const resultado = await resposta.json();

    if (!resposta.ok) {
      alert("Erro ao alterar sua senha: " + resultado.error);
      return;
    }

    alert("Sua senha foi atualizada com sucesso!");

    setMinhaSenha("");
    setConfirmarMinhaSenha("");
  }

  const ehAdmin = usuarioLogado?.admin === true;
  const totalUsuarios = usuarios.length;
  const totalAdmins = usuarios.filter((u) => u.admin).length;
  const totalComuns = totalUsuarios - totalAdmins;

  return (
    <div className="text-slate-800 w-full overflow-x-hidden space-y-6">
      
      {/* Hero Section */}
      <section className="pt-14 md:pt-0">
        <div className="relative overflow-hidden rounded-2xl bg-slate-900 text-white shadow-md">
          {/* Elemento de fundo sutil */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
          
          <div className="relative p-6 md:p-10 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-8">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-xl bg-white/10 border border-white/10 backdrop-blur-sm flex items-center justify-center shrink-0">
                <Settings size={32} className="text-blue-400" />
              </div>

              <div>
                <p className="text-slate-400 text-sm font-medium mb-1 tracking-wide uppercase">
                  Administração
                </p>

                <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                  Configurações
                </h1>

                <p className="text-slate-400 mt-2 text-sm md:text-base max-w-2xl">
                  Gerencie credenciais de acesso, crie novos usuários e mantenha a segurança do sistema[cite: 18].
                </p>
              </div>
            </div>

            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5 min-w-[240px]">
              <p className="text-slate-400 text-sm font-medium">Credencial Atual</p>
              
              <div className="flex items-center gap-2 mt-2">
                <UserCircle className={ehAdmin ? "text-violet-400" : "text-blue-400"} size={28} />
                <p className="text-2xl font-bold text-white">
                  {ehAdmin ? "Administrador" : "Usuário Base"}
                </p>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-700">
                <p className="text-xs font-medium text-slate-400">Logado como:</p>
                <p className="text-sm font-semibold text-slate-200 mt-0.5 break-all">
                  {usuarioLogado?.email || "Autenticando..."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cards de Métricas */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Usuários Ativos</p>
            <h2 className="text-3xl font-bold text-slate-800 mt-1">{totalUsuarios}</h2>
            <p className="text-xs text-slate-400 mt-1">com permissão no sistema</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <Users size={20} />
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Administradores</p>
            <h2 className="text-3xl font-bold text-slate-800 mt-1">{totalAdmins}</h2>
            <p className="text-xs text-slate-400 mt-1">acesso irrestrito e seguro</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-violet-50 text-violet-600 flex items-center justify-center">
            <Crown size={20} />
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Usuários Comuns</p>
            <h2 className="text-3xl font-bold text-slate-800 mt-1">{totalComuns}</h2>
            <p className="text-xs text-slate-400 mt-1">acesso padrão revogável</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-slate-50 text-slate-600 flex items-center justify-center">
            <ShieldCheck size={20} />
          </div>
        </div>
      </section>

      {/* Formulários de Senha e Cadastro */}
      <section className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        
        {/* Alterar Minha Senha */}
        <form
          onSubmit={alterarMinhaSenha}
          className="bg-white border border-slate-200 rounded-xl p-5 md:p-6 shadow-sm h-fit"
        >
          <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <KeyRound size={20} />
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-800">
                Credencial Pessoal
              </h2>
              <p className="text-sm text-slate-500">
                Altere sua própria senha de acesso à plataforma
              </p>
            </div>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Nova Senha
              </label>
              <div className="relative">
                <input
                  type={mostrarMinhaSenha ? "text" : "password"}
                  value={minhaSenha}
                  onChange={(e) => setMinhaSenha(e.target.value)}
                  placeholder="Mínimo de 6 caracteres"
                  className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 pr-11 text-sm outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-shadow"
                />
                <button
                  type="button"
                  onClick={() => setMostrarMinhaSenha(!mostrarMinhaSenha)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {mostrarMinhaSenha ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Confirme a Nova Senha
              </label>
              <div className="relative">
                <input
                  type={mostrarConfirmarMinhaSenha ? "text" : "password"}
                  value={confirmarMinhaSenha}
                  onChange={(e) => setConfirmarMinhaSenha(e.target.value)}
                  placeholder="Repita a senha informada"
                  className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 pr-11 text-sm outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-shadow"
                />
                <button
                  type="button"
                  onClick={() => setMostrarConfirmarMinhaSenha(!mostrarConfirmarMinhaSenha)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {mostrarConfirmarMinhaSenha ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button className="w-full mt-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 text-sm shadow-sm">
              <KeyRound size={16} />
              Atualizar Minha Senha
            </button>
          </div>
        </form>

        {/* Criar Usuário (Apenas Admin) */}
        {ehAdmin && (
          <form
            onSubmit={adicionarUsuario}
            className="bg-white border border-slate-200 rounded-xl p-5 md:p-6 shadow-sm h-fit"
          >
            <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
              <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <UserPlus size={20} />
              </div>

              <div>
                <h2 className="text-lg font-bold text-slate-800">
                  Novo Integrante
                </h2>
                <p className="text-sm text-slate-500">
                  Forneça acesso completo ao sistema para a equipe
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Nome do Colaborador</label>
                <input
                  type="text"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Nome completo"
                  className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Endereço de E-mail</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@empresa.com.br"
                  className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Senha Provisória</label>
                <div className="relative">
                  <input
                    type={mostrarSenhaTemporaria ? "text" : "password"}
                    value={senhaTemporaria}
                    onChange={(e) => setSenhaTemporaria(e.target.value)}
                    placeholder="Sugerido mínimo de 6 caracteres"
                    className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 pr-11 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setMostrarSenhaTemporaria(!mostrarSenhaTemporaria)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {mostrarSenhaTemporaria ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            </div>

            <button className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 text-sm shadow-sm">
              <UserPlus size={18} />
              Criar Acesso e Conceder Permissão
            </button>
          </form>
        )}
      </section>

      {/* Backup Section (Apenas Admin) */}
      {ehAdmin && (
        <section className="bg-white border border-slate-200 rounded-xl p-5 md:p-6 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-violet-50 text-violet-600 flex items-center justify-center shrink-0">
                <DatabaseBackup size={24} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-800">
                  Retenção de Dados do Sistema
                </h2>
                <p className="text-sm text-slate-500 mt-0.5">
                  Realize o download seguro de todos os registros armazenados no banco de dados.
                </p>
              </div>
            </div>
            <div className="shrink-0 w-full md:w-auto">
              <BotaoBackup />
            </div>
          </div>
        </section>
      )}

      {/* Lista de Usuários Autorizados */}
      <section className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
        <div className="p-5 md:p-6 border-b border-slate-100 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-slate-50 text-slate-600 flex items-center justify-center shrink-0 border border-slate-100">
            <ShieldCheck size={20} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-800">
              Quadro de Acessos
            </h2>
            <p className="text-sm text-slate-500">
              Controle o privilégio e as permissões de cada integrante.
            </p>
          </div>
        </div>

        <div className="p-5 md:p-6 bg-slate-50/30">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {usuarios.map((usuario) => (
              <div
                key={usuario.id}
                className="flex flex-col justify-between border border-slate-200 bg-white rounded-xl p-5 hover:border-blue-300 hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-start gap-4 mb-5">
                  <div
                    className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 ${
                      usuario.admin
                        ? "bg-gradient-to-br from-violet-500 to-indigo-600 text-white shadow-sm"
                        : "bg-blue-50 text-blue-600 border border-blue-100"
                    }`}
                  >
                    {usuario.admin ? <Crown size={24} /> : <Users size={24} />}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-slate-800 truncate" title={usuario.nome || "Sem nome"}>
                      {usuario.nome || "Sem nome cadastrado"}
                    </h3>
                    <p className="text-[13px] font-medium text-slate-500 truncate" title={usuario.email}>
                      {usuario.email}
                    </p>
                    
                    <div className="flex flex-wrap gap-2 mt-2.5">
                      {usuario.admin ? (
                        <span className="inline-flex items-center gap-1 bg-violet-50 text-violet-700 border border-violet-100 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
                          <Crown size={10} />
                          Admin
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-600 border border-slate-200 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
                          Usuário
                        </span>
                      )}

                      {!usuario.auth_id && (
                        <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
                          Sem Auth_ID
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                  {ehAdmin ? (
                    <>
                      <button
                        onClick={() => redefinirSenha(usuario)}
                        title="Redefinir senha do usuário"
                        className="flex-1 bg-white border border-slate-200 text-slate-600 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 px-3 py-2 rounded-lg transition-colors flex items-center justify-center gap-2 text-xs font-semibold shadow-sm"
                      >
                        <KeyRound size={14} />
                        Senha
                      </button>

                      {usuario.admin ? (
                        <button
                          disabled
                          title="Administradores não podem ser removidos pelo painel"
                          className="flex-1 bg-slate-50 border border-slate-200 text-slate-400 px-3 py-2 rounded-lg flex items-center justify-center gap-2 cursor-not-allowed text-xs font-semibold"
                        >
                          <LockKeyhole size={14} />
                          Protegido
                        </button>
                      ) : (
                        <button
                          onClick={() => removerUsuario(usuario)}
                          title="Revogar acesso"
                          className="flex-1 bg-white border border-slate-200 text-slate-600 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 px-3 py-2 rounded-lg transition-colors flex items-center justify-center gap-2 text-xs font-semibold shadow-sm"
                        >
                          <Trash2 size={14} />
                          Remover
                        </button>
                      )}
                    </>
                  ) : (
                    <div className="w-full text-center py-1.5 bg-slate-50 rounded-md text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Modo Visualização
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}