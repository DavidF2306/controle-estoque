"use client";

import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export default function BotaoTema() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const temaSalvo = localStorage.getItem("tema_vallente");
    if (temaSalvo === "dark") {
      setIsDark(true);
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
      setIsDark(false);
    }
  }, []);

  const alternarTema = () => {
    if (isDark) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("tema_vallente", "light");
      setIsDark(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("tema_vallente", "dark");
      setIsDark(true);
    }
  };

  return (
    <button
      onClick={alternarTema}
      className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors text-sm font-semibold"
    >
      {isDark ? <Sun size={18} className="text-amber-400 shrink-0" /> : <Moon size={18} className="text-slate-600 shrink-0" />}
      <span>{isDark ? "Modo Claro" : "Modo Escuro"}</span>
    </button>
  );
}