"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { bookAppointment } from "@/lib/api";
import { addPendingBooking, getPendingBookings } from "@/lib/offlineQueue";
import { useSevaStore } from "@/store/useSevaStore";
import { t } from "@/lib/translations";
import TopBar from "@/components/TopBar";

declare global {
  interface Window {
    webkitSpeechRecognition?: new () => {
      lang: string;
      onresult: ((event: { results?: { 0?: { 0?: { transcript?: string } } } }) => void) | null;
      onerror?: (() => void) | null;
      onend?: (() => void) | null;
      start: () => void;
    };
    SpeechRecognition?: new () => {
      lang: string;
      onresult: ((event: { results?: { 0?: { 0?: { transcript?: string } } } }) => void) | null;
      onerror?: (() => void) | null;
      onend?: (() => void) | null;
      start: () => void;
    };
  }
}

function toDatetimeLocalValue(date: Date) {
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(
    date.getMinutes()
  )}`;
}

export default function BookingPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const clinicId = Number(params.id);
  const language = useSevaStore((s) => s.language);
  const userId = useSevaStore((s) => s.userId);
  const setPendingSync = useSevaStore((s) => s.setPendingSync);
  const isOnline = useSevaStore((s) => s.isOnline);
  const [slot, setSlot] = useState(() => {
    const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000);
    tomorrow.setHours(10, 0, 0, 0);
    return toDatetimeLocalValue(tomorrow);
  });
  const [message, setMessage] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [loading, setLoading] = useState(false);

  const onVoice = () => {
    const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Recognition) {
      setMessage("Voice input is not supported in this browser.");
      return;
    }
    const recognition = new Recognition();
    recognition.lang = language === "hi" ? "hi-IN" : "en-IN";
    setIsListening(true);
    setMessage("Listening... speak your slot (e.g. tomorrow morning)");

    recognition.onresult = (event) => {
      const transcript = event.results?.[0]?.[0]?.transcript?.toLowerCase() ?? "";
      if (transcript.includes("tomorrow") || transcript.includes("कल")) {
        const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000);
        tomorrow.setHours(11, 0, 0, 0);
        setSlot(toDatetimeLocalValue(tomorrow));
      }
      setMessage(`${t(language, "bookForTomorrow")}: ${transcript}`);
      setIsListening(false);
    };
    recognition.onerror = () => {
      setMessage("Voice error. Try selecting manually.");
      setIsListening(false);
    };
    recognition.onend = () => setIsListening(false);
    recognition.start();
  };

  const onBook = async () => {
    if (!userId) {
      router.push("/login");
      return;
    }
    setLoading(true);
    try {
      const offlineId = crypto.randomUUID();
      if (!navigator.onLine) {
        await addPendingBooking({
          id: offlineId,
          user_id: userId,
          clinic_id: clinicId,
          appointment_time: new Date(slot).toISOString(),
          created_at: new Date().toISOString(),
        });
        const pending = await getPendingBookings();
        setPendingSync(pending.length);
        setMessage(t(language, "offlineSaved"));
        router.push(`/confirmation/${offlineId}`);
        return;
      }

      const result = await bookAppointment({
        user_id: userId,
        clinic_id: clinicId,
        appointment_time: new Date(slot).toISOString(),
        client_request_id: offlineId,
      });
      router.push(`/confirmation/${result.appointment_id}`);
    } catch {
      setMessage("Unable to complete booking.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <TopBar />
      <main className="mx-auto min-h-[calc(100vh-65px)] w-full max-w-md bg-slate-50 px-4 py-6 md:max-w-2xl">
        <button onClick={() => router.back()} className="mb-5 flex items-center gap-1 text-sm font-bold text-slate-500 hover:text-slate-700">
          Back
        </button>
        <h1 className="mb-5 text-xl font-black text-slate-900">{t(language, "bookNow")}</h1>
        <section className="space-y-5 rounded-3xl border border-slate-100 bg-white p-5 shadow-xl shadow-slate-100/50">
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-500">Select Date &amp; Time</label>
            <input type="datetime-local" value={slot} onChange={(event) => setSlot(event.target.value)} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-base font-semibold outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-500/5" />
          </div>
          <div className="grid grid-cols-2 gap-3 pt-2">
            <button onClick={onVoice} disabled={loading} className={`rounded-2xl border px-3 py-4 text-sm font-bold ${isListening ? "border-rose-400 bg-rose-50 text-rose-700" : "border-slate-200 bg-slate-50 text-slate-700"}`}>
              {isListening ? "Listening..." : t(language, "useVoice")}
            </button>
            <button disabled={loading} onClick={onBook} className="rounded-2xl bg-teal-600 px-3 py-4 text-sm font-extrabold text-white hover:bg-teal-700">
              {loading ? "Booking..." : t(language, "bookNow")}
            </button>
          </div>
          {message ? <p className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 text-center text-xs font-semibold text-slate-600">{message}</p> : null}
        </section>
        {!isOnline ? <article className="mt-5 rounded-3xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-800">Offline mode is active. Your appointment will be saved locally and synced when the connection returns.</article> : null}
      </main>
    </>
  );
}
