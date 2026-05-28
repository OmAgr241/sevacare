"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { fetchClinicDetail } from "@/lib/api";
import { ClinicDetail } from "@/types";
import TopBar from "@/components/TopBar";

export default function ClinicDetailPage() {
  const params = useParams<{ id: string }>();
  const [clinic, setClinic] = useState<ClinicDetail | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchClinicDetail(Number(params.id));
        setClinic(data);
      } catch {
        setError("Could not load clinic details.");
      }
    };
    if (params.id) load();
  }, [params.id]);

  return (
    <>
      <TopBar />
      <main className="mx-auto w-full max-w-md px-4 py-4">
        {!clinic && !error ? <div className="h-40 animate-pulse rounded-2xl bg-white" /> : null}
        {error ? <p className="rounded-xl bg-rose-100 px-3 py-2 text-sm text-rose-700">{error}</p> : null}
        {clinic ? (
          <article className="rounded-2xl border border-teal-100 bg-white p-4">
            <h1 className="text-2xl font-bold">{clinic.name}</h1>
            <p className="mt-1 text-slate-600">{clinic.specialty}</p>
            <div className="mt-4 space-y-2 text-sm text-slate-700">
              <p>Average wait: {clinic.avg_wait_time} mins</p>
              <p>Active patients: {clinic.active_patients}</p>
              <p>Avg consultation: {clinic.avg_consultation_time} mins</p>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <Link href={`/wait-time/${clinic.id}`} className="rounded-xl bg-slate-100 px-3 py-3 text-center">
                Wait Time
              </Link>
              <Link href={`/clinics/${clinic.id}/book`} className="rounded-xl bg-teal-600 px-3 py-3 text-center text-white">
                Book
              </Link>
            </div>
          </article>
        ) : null}
      </main>
    </>
  );
}
