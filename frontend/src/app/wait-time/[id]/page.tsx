"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { fetchWaitPrediction } from "@/lib/api";
import { WaitPrediction } from "@/types";
import TopBar from "@/components/TopBar";

export default function WaitTimePage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [prediction, setPrediction] = useState<WaitPrediction | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setPrediction(await fetchWaitPrediction(Number(params.id)));
      } catch {
        setError("Could not load wait time prediction.");
      }
    };
    if (params.id) load();
  }, [params.id]);

  const crowdClass = prediction?.crowd_level === "High" ? "bg-rose-50 text-rose-700" : prediction?.crowd_level === "Medium" ? "bg-amber-50 text-amber-700" : "bg-emerald-50 text-emerald-700";

  return (
    <>
      <TopBar />
      <main className="mx-auto min-h-[calc(100vh-65px)] w-full max-w-md bg-slate-50 px-4 py-6 md:max-w-2xl">
        <button onClick={() => router.back()} className="mb-5 text-sm font-bold text-slate-500 hover:text-slate-700">Back</button>
        {!prediction && !error ? <div className="h-64 animate-pulse rounded-3xl border border-slate-100 bg-white" /> : null}
        {error ? <p className="rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">{error}</p> : null}
        {prediction ? (
          <div className="space-y-4">
            <article className="rounded-3xl border border-slate-100 bg-white p-6 text-center shadow-xl shadow-slate-100/50">
              <h1 className="text-xs font-bold uppercase tracking-widest text-slate-400">Estimated Wait Time</h1>
              <p className="mt-5 text-5xl font-black text-slate-900">{prediction.estimated_wait_mins}<span className="ml-2 text-base text-slate-500">mins</span></p>
              <p className="mt-5 text-sm font-semibold text-slate-500">Crowd level: <span className={`rounded-xl px-3 py-1 text-xs font-bold ${crowdClass}`}>{prediction.crowd_level}</span></p>
            </article>
            <article className="rounded-3xl border border-slate-100 bg-white p-5 shadow-md shadow-slate-100/50">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-400">Visit Recommendation</p>
              <p className="mt-1 text-base font-bold text-slate-800">Best visit time: <span className="text-teal-600">{prediction.best_visit_time}</span></p>
            </article>
            <Link href={`/clinics/${prediction.clinic_id}/book`} className="flex w-full items-center justify-center rounded-2xl bg-teal-600 px-4 py-4 text-lg font-bold text-white hover:bg-teal-700">Proceed to Book Appointment</Link>
          </div>
        ) : null}
      </main>
    </>
  );
}
