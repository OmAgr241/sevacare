"use client";

import { useCallback, useEffect, useState } from "react";
import TopBar from "@/components/TopBar";
import { getPendingBookings, syncPendingBookings } from "@/lib/offlineQueue";
import { useSevaStore } from "@/store/useSevaStore";
import { t } from "@/lib/translations";

export default function SyncStatusPage() {
  const language = useSevaStore((s) => s.language);
  const isOnline = useSevaStore((s) => s.isOnline);
  const pendingSync = useSevaStore((s) => s.pendingSync);
  const setPendingSync = useSevaStore((s) => s.setPendingSync);
  const [statusMessage, setStatusMessage] = useState("");

  const refresh = useCallback(async () => {
    const pending = await getPendingBookings();
    setPendingSync(pending.length);
  }, [setPendingSync]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const syncNow = async () => {
    const result = await syncPendingBookings();
    setPendingSync(result.remaining);
    setStatusMessage(`Synced ${result.synced}, remaining ${result.remaining}.`);
  };

  return (
    <>
      <TopBar />
      <main className="mx-auto w-full max-w-md px-4 py-4">
        <article className="rounded-2xl border border-slate-200 bg-white p-4">
          <h1 className="text-xl font-bold text-slate-900">{t(language, "syncStatus")}</h1>
          <p className="mt-3 text-slate-700">Network: {isOnline ? "Online" : "Offline"}</p>
          <p className="mt-1 text-slate-700">
            {t(language, "pendingSync")}: {pendingSync}
          </p>
          <button
            onClick={syncNow}
            className="mt-4 w-full rounded-xl bg-teal-600 px-3 py-3 font-semibold text-white disabled:bg-teal-300"
            disabled={!isOnline}
          >
            Sync now
          </button>
          {statusMessage ? <p className="mt-3 rounded-xl bg-slate-100 px-3 py-2 text-sm">{statusMessage}</p> : null}
        </article>
      </main>
    </>
  );
}
