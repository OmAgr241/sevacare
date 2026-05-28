"use client";

import Link from "next/link";
import { useSevaStore } from "@/store/useSevaStore";
import { t } from "@/lib/translations";

export default function TopBar() {
  const language = useSevaStore((s) => s.language);
  const pendingSync = useSevaStore((s) => s.pendingSync);
  const isOnline = useSevaStore((s) => s.isOnline);

  return (
    <header className="sticky top-0 z-30 border-b border-slate-100 bg-white/80 backdrop-blur-md shadow-sm shadow-slate-100/40">
      <div className="mx-auto flex max-w-md md:max-w-4xl lg:max-w-5xl items-center justify-between px-4 py-3.5">
        <Link href="/home" className="font-extrabold text-lg bg-gradient-to-r from-teal-700 to-teal-600 bg-clip-text text-transparent flex items-center gap-1.5 hover:opacity-90 transition-opacity">
          <span>🩺</span>
          <span>{t(language, "appName")}</span>
        </Link>
        
        <Link
          href="/sync-status"
          className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold transition-all border ${
            isOnline 
              ? "bg-emerald-50/70 border-emerald-100 text-emerald-700 shadow-sm shadow-emerald-600/5" 
              : "bg-rose-50/70 border-rose-100 text-rose-700 shadow-sm shadow-rose-600/5 animate-pulse"
          }`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${isOnline ? "bg-emerald-500" : "bg-rose-500"}`} />
          <span>{isOnline ? "Online" : "Offline"}</span>
          {pendingSync > 0 && (
            <span className="ml-0.5 rounded-full bg-slate-900 px-1.5 py-0.2 text-[10px] font-extrabold text-white">
              {pendingSync}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
}
