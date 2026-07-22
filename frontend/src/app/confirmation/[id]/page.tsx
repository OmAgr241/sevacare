"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import TopBar from "@/components/TopBar";

export default function ConfirmationPage() {
  const params = useParams<{ id: string }>();
  const isOfflineId = Boolean(params.id && params.id.length > 8 && params.id.includes("-"));

  return (
    <>
      <TopBar />
      <main className="mx-auto flex min-h-[calc(100vh-65px)] w-full max-w-md flex-col justify-center bg-slate-50 px-4 py-6 md:max-w-2xl">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-emerald-100 bg-emerald-50 text-4xl text-emerald-600">OK</div>
        <article className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-xl shadow-slate-100/50">
          <div className="bg-teal-700 p-6 text-center text-white">
            <h1 className="text-lg font-bold">Booking Request Sent</h1>
            <p className="mt-1 text-xs font-medium text-teal-100">{isOfflineId ? "Queued offline" : "Confirmed by clinic"}</p>
          </div>
          <div className="space-y-4 p-6">
            <div className="flex justify-between border-b border-slate-100 pb-3 text-sm"><span className="font-semibold text-slate-400">Appointment status</span><span className="font-bold text-emerald-600">{isOfflineId ? "Pending sync" : "Confirmed"}</span></div>
            <div className="flex justify-between gap-4 border-b border-slate-100 pb-3 text-sm"><span className="font-semibold text-slate-400">Ticket ID</span><span className="break-all font-mono font-bold text-slate-800">{params.id ?? "N/A"}</span></div>
            <p className="text-center text-xs font-semibold leading-relaxed text-slate-500">{isOfflineId ? "This booking is saved on this device and will be submitted when the connection returns." : "A confirmation SMS has been sent to your mobile number."}</p>
            <Link href="/home" className="flex w-full items-center justify-center rounded-2xl bg-slate-900 px-4 py-3.5 text-base font-bold text-white hover:bg-slate-800">Back to Home Dashboard</Link>
          </div>
        </article>
      </main>
    </>
  );
}
