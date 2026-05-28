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
        const data = await fetchWaitPrediction(Number(params.id));
        setPrediction(data);
      } catch {
        setError("Could not load wait time prediction.");
      }
    };
    if (params.id) load();
  }, [params.id]);

  // Determine styling based on crowd level
  let crowdBadgeColor = "bg-emerald-50 text-emerald-700 border-emerald-100/50";
  let gaugeColor = "from-emerald-500 to-teal-500";
  if (prediction?.crowd_level === "High") {
    crowdBadgeColor = "bg-rose-50 text-rose-700 border-rose-100/50";
    gaugeColor = "from-rose-500 to-orange-500";
  } else if (prediction?.crowd_level === "Medium") {
    crowdBadgeColor = "bg-amber-50 text-amber-700 border-amber-100/50";
    gaugeColor = "from-amber-500 to-yellow-500";
  }

  return (
    <>
      <TopBar />
      <main className="mx-auto w-full max-w-md md:max-w-2xl px-4 py-6 bg-slate-50 min-h-[calc(100vh-65px)]">
        {/* Back navigation */}
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-1 text-sm font-bold text-slate-500 hover:text-slate-700 mb-5 transition-colors"
        >
          ← Back to Clinic Details
        </button>

        {!prediction && !error ? (
          <div className="space-y-4">
            <div className="h-64 animate-pulse rounded-3xl bg-white border border-slate-100" />
            <div className="h-20 animate-pulse rounded-2xl bg-white border border-slate-100" />
          </div>
        ) : null}

        {error ? (
          <p className="rounded-2xl bg-rose-50 border border-rose-100 px-4 py-3 text-sm font-semibold text-rose-700">
            ⚠️ {error}
          </p>
        ) : null}

        {prediction ? (
          <div className="space-y-4">
            {/* Main wait time gauge card */}
            <article className="rounded-3xl border border-slate-100 bg-white p-6 shadow-xl shadow-slate-100/50 relative overflow-hidden text-center">
              <div className="absolute right-[-10%] top-[-10%] text-9xl opacity-[0.03] pointer-events-none">⏱️</div>
              
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Estimated Wait Time</h2>
              
              {/* Animated Circle Gauge mockup */}
              <div className="my-6 relative flex items-center justify-center">
                <div className={`w-40 h-40 rounded-full bg-gradient-to-tr ${gaugeColor} p-2 shadow-lg flex items-center justify-center`}>
                  <div className="w-full h-full rounded-full bg-white flex flex-col items-center justify-center relative">
                    <span className="text-4xl font-black text-slate-900 leading-none">
                      {prediction.estimated_wait_mins}
                    </span>
                    <span className="text-xs font-bold text-slate-400 uppercase mt-1">mins</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-center gap-2 mt-4">
                <span className="text-sm font-semibold text-slate-500">Crowd Level:</span>
                <span className={`inline-flex items-center rounded-xl border px-3 py-1 text-xs font-bold ${crowdBadgeColor}`}>
                  {prediction.crowd_level}
                </span>
              </div>
            </article>

            {/* Recommendation Card */}
            <article className="rounded-3xl border border-slate-100 bg-white p-5 shadow-md shadow-slate-100/50 flex gap-4 items-center">
              <div className="h-12 w-12 rounded-2xl bg-amber-50 border border-amber-100/40 flex items-center justify-center text-2xl flex-shrink-0">
                💡
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Visit Recommendation</p>
                <p className="text-base font-bold text-slate-800 mt-0.5">
                  Best visit time is <span className="text-teal-600 font-extrabold">{prediction.best_visit_time}</span>
                </p>
              </div>
            </article>

            {/* Booking Call to Action */}
            <Link
              href={`/clinics/${prediction.clinic_id}/book`}
              className="group relative flex w-full items-center justify-center rounded-2xl bg-teal-600 px-4 py-4 text-center text-lg font-bold text-white shadow-lg shadow-teal-500/20 hover:bg-teal-700 transition-all duration-200 active:scale-[0.98] overflow-hidden"
            >
              <span className="relative z-10">Proceed to Book Appointment</span>
            </Link>
          </div>
        ) : null}
      </main>
    </>
  );
}
