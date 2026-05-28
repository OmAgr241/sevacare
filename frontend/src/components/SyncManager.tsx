"use client";

import { useEffect } from "react";
import { getPendingBookings, syncPendingBookings } from "@/lib/offlineQueue";
import { useSevaStore } from "@/store/useSevaStore";

export default function SyncManager() {
  const setOnlineStatus = useSevaStore((s) => s.setOnlineStatus);
  const setPendingSync = useSevaStore((s) => s.setPendingSync);

  useEffect(() => {
    const refreshPending = async () => {
      const pending = await getPendingBookings();
      setPendingSync(pending.length);
    };

    const runSync = async () => {
      setOnlineStatus(navigator.onLine);
      await syncPendingBookings();
      await refreshPending();
    };

    runSync();
    const online = () => {
      setOnlineStatus(true);
      runSync();
    };
    const offline = () => setOnlineStatus(false);

    window.addEventListener("online", online);
    window.addEventListener("offline", offline);
    const timer = window.setInterval(runSync, 15000);

    return () => {
      window.removeEventListener("online", online);
      window.removeEventListener("offline", offline);
      window.clearInterval(timer);
    };
  }, [setOnlineStatus, setPendingSync]);

  return null;
}
