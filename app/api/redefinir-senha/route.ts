import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const admin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  return NextResponse.json({
    ok: true,
    rota: "redefinir-senha",
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
      error: erroUsuario,
    } = await admin.auth.getUser(token);

    if (erroUsuario || !user?.email) {
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
        { error: "Apenas administradores podem redefinir senhas." },
        { status: 403 }
      );
    }

    const { userId, novaSenha } = await req.json();

    if (!userId || !novaSenha) {
      return NextResponse.json(
        { error: "Dados incompletos." },
        { status: 400 }
      );
    }

    if (novaSenha.length < 6) {
      return NextResponse.json(
        { error: "A senha precisa ter no mínimo 6 caracteres." },
        { status: 400 }
      );
    }

    const { error } = await admin.auth.admin.updateUserById(userId, {
      password: novaSenha,
    });

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
    });
  } catch {
    return NextResponse.json(
      { error: "Erro interno ao redefinir senha." },
      { status: 500 }
    );
  }
}