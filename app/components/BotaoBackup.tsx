"use client";

import { supabase } from "@/lib/supabase";
import { Download } from "lucide-react";

export default function BotaoBackup() {
  async function fazerBackup() {
    const confirmar = confirm(
      "Deseja gerar um backup completo do sistema?"
    );

    if (!confirmar) return;

    const { data: produtos } = await supabase
      .from("produtos")
      .select("*");

    const { data: entradas } = await supabase
      .from("entradas")
      .select("*");

    const { data: saidas } = await supabase
      .from("saidas")
      .select("*");

    const { data: locais } = await supabase
      .from("locais")
      .select("*");

    const { data: usuariosAutorizados } = await supabase
      .from("usuarios_autorizados")
      .select("*");

    const backup = {
      gerado_em: new Date().toISOString(),
      produtos: produtos || [],
      entradas: entradas || [],
      saidas: saidas || [],
      locais: locais || [],
      usuarios_autorizados: usuariosAutorizados || [],
    };

    const arquivo = new Blob(
      [JSON.stringify(backup, null, 2)],
      { type: "application/json" }
    );

    const url = URL.createObjectURL(arquivo);

    const link = document.createElement("a");
    link.href = url;
    link.download = `backup-estoquepro-${new Date()
      .toISOString()
      .slice(0, 10)}.json`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);

    alert("Backup gerado com sucesso!");
  }

  return (
    <button
      type="button"
      onClick={fazerBackup}
      className="
        w-full
        bg-gray-900
        hover:bg-black
        text-white
        px-6 py-3
        rounded-2xl
        font-medium
        transition
        flex items-center
        justify-center
        gap-2
      "
    >
      <Download size={20} />
      Fazer backup
    </button>
  );
}