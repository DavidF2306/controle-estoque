import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const admin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  return NextResponse.json({
    ok: true,
    rota: "criar-usuario",
  });
}

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");

    if (!authHeader) {
      return NextResponse.json(
        { error: "Usuário não autenticado." },
        { status: 401 }
      );
    }

    const token = authHeader.replace("Bearer ", "");

    const {
      data: { user },
      error: erroSessao,
    } = await admin.auth.getUser(token);

    if (erroSessao || !user?.email) {
      return NextResponse.json(
        { error: "Sessão inválida." },
        { status: 401 }
      );
    }

    const { data: usuarioAdmin } = await admin
      .from("usuarios_autorizados")
      .select("admin")
      .eq("email", user.email.toLowerCase())
      .maybeSingle();

    if (!usuarioAdmin?.admin) {
      return NextResponse.json(
        { error: "Apenas administradores podem criar usuários." },
        { status: 403 }
      );
    }

    const { nome, email, senha } = await req.json();

    if (!nome || !email || !senha) {
      return NextResponse.json(
        { error: "Preencha nome, email e senha." },
        { status: 400 }
      );
    }

    if (senha.length < 6) {
      return NextResponse.json(
        { error: "A senha precisa ter no mínimo 6 caracteres." },
        { status: 400 }
      );
    }

    const nomeFormatado = nome.trim();
    const emailFormatado = email.trim().toLowerCase();

    let authId = "";

    const { data: usuarioCriado, error: erroCriar } =
      await admin.auth.admin.createUser({
        email: emailFormatado,
        password: senha,
        email_confirm: true,
      });

    if (usuarioCriado?.user?.id) {
      authId = usuarioCriado.user.id;
    }

    if (erroCriar) {
      const { data: listaUsuarios, error: erroListar } =
        await admin.auth.admin.listUsers();

      if (erroListar) {
        return NextResponse.json(
          { error: erroListar.message },
          { status: 400 }
        );
      }

      const usuarioExistente = listaUsuarios.users.find(
        (u) => u.email?.toLowerCase() === emailFormatado
      );

      if (!usuarioExistente) {
        return NextResponse.json(
          { error: erroCriar.message },
          { status: 400 }
        );
      }

      authId = usuarioExistente.id;

      const { error: erroAtualizarSenha } =
        await admin.auth.admin.updateUserById(authId, {
          password: senha,
          email_confirm: true,
        });

      if (erroAtualizarSenha) {
        return NextResponse.json(
          { error: erroAtualizarSenha.message },
          { status: 400 }
        );
      }
    }

    const { error: erroSalvar } = await admin
      .from("usuarios_autorizados")
      .upsert(
        {
          nome: nomeFormatado,
          email: emailFormatado,
          admin: false,
          auth_id: authId,
        },
        {
          onConflict: "email",
        }
      );

    if (erroSalvar) {
      return NextResponse.json(
        { error: erroSalvar.message },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Erro interno ao criar usuário." },
      { status: 500 }
    );
  }
}