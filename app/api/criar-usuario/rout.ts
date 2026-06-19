import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const admin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

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
    } = await admin.auth.getUser(token);

    if (!user?.email) {
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

    const emailFormatado = email.trim().toLowerCase();

    const { data: usuarioCriado, error: erroCriar } =
      await admin.auth.admin.createUser({
        email: emailFormatado,
        password: senha,
        email_confirm: true,
      });

    if (erroCriar) {
      return NextResponse.json(
        { error: erroCriar.message },
        { status: 400 }
      );
    }

    const { error: erroSalvar } = await admin
      .from("usuarios_autorizados")
      .upsert(
        {
          nome: nome.trim(),
          email: emailFormatado,
          admin: false,
          auth_id: usuarioCriado.user.id,
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