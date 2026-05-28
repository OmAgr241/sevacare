"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import TopBar from "@/components/TopBar";

export default function ConfirmationPage() {
  const params = useParams<{ id: string }>();
  const isOfflineId = params.id && params.id.length > 8 && params.id.includes("-"); // UUID for offline mode

  return (
    <>
      <TopBar />
      <main className="mx-auto flex min-h-[calc(100vh-65px)] w-full max-w-md md:max-w-2xl flex-col justify-center px-4 py-6 bg-slate-50">
        
        {/* Animated Checkmark Circle */}
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 border border-emerald-100 shadow-lg shadow-emerald-500/10 animate-bounce">
          <span className="text-4xl text-emerald-600">✓</span>
        </div>

        {/* Ticket Layout Card */}
        <article className="rounded-3xl border border-slate-100 bg-white shadow-xl shadow-slate-100/50 relative overflow-hidden">
          
          {/* Header section of ticket */}
          <div className="bg-gradient-to-r from-teal-700 to-teal-600 p-6 text-white text-center">
            <h2 className="text-lg font-bold">Booking Request Sent</h2>
            <p className="text-xs text-teal-100 mt-1 font-medium">
              {isOfflineId ? "Queued Offline (Pending connection)" : "Confirmed by Clinic"}
            </p>
          </div>

          {/* Ticket Body */}
          <div className="p-6 space-y-4">
            <div className="flex justify-between items-center text-sm border-b border-slate-100 pb-3">
              <span className="font-semibold text-slate-400">Appointment Status</span>
              <span className={`inline-flex items-center gap-1 text-[10px] font-extrabold rounded-full px-2.5 py-1 border uppercase tracking-wider ${
                isOfflineId 
                  ? "bg-amber-50 text-amber-600 border-amber-100" 
                  : "bg-emerald-50 text-emerald-600 border-emerald-100"
              }`}>
                {isOfflineId ? "Pending Sync" : "Confirmed"}
              </span>
            </div>

            <div className="flex justify-between items-center text-sm border-b border-slate-100 pb-3">
              <span className="font-semibold text-slate-400">Ticket ID</span>
              <span className="font-mono text-sm font-bold text-slate-800 break-all select-all">
                {params.id ? `${params.id.slice(0, 18)}...` : "N/A"}
              </span>
            </div>

            <div className="text-xs font-semibold text-slate-500 leading-relaxed text-center pt-2">
              {isOfflineId 
                ? "This ticket is saved in your offline browser queue. It will automatically sync and confirm as soon as you reconnect to the internet."
                : "A confirmation SMS message has been dispatched to your mobile phone number. Please present this ticket at the clinic desk."}
            </div>
          </div>

          {/* Dash separator with notches */}
          <div className="relative flex items-center justify-between px-3">
            <div className="w-4 h-8 rounded-r-full bg-slate-50 border-y border-r border-slate-100 absolute left-0" />
            <div className="w-full border-t-2 border-dashed border-slate-150 mx-4" />
            <div className="w-4 h-8 rounded-l-full bg-slate-50 border-y border-l border-slate-100 absolute right-0" />
          </div>

          {/* Ticket Footer Action */}
          <div className="p-6">
            <Link 
              href="/home" 
              className="group relative flex w-full items-center justify-center rounded-2xl bg-slate-900 px-4 py-3.5 text-center text-base font-bold text-white shadow-lg shadow-slate-950/20 hover:bg-slate-800 transition-all duration-200 active:scale-[0.98] overflow-hidden"
            >
              <span>Back to Home Dashboard</span>
            </Link>
          </div>
        </article>
      </main>
    </>
  );
}
