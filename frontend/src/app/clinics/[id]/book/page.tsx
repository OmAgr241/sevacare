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
    const Recognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;
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

    recognition.onend = () => {
      setIsListening(false);
    };

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
      <main className="mx-auto w-full max-w-md md:max-w-2xl px-4 py-6 bg-slate-50 min-h-[calc(100vh-65px)]">
        {/* Back Button */}
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-1 text-sm font-bold text-slate-500 hover:text-slate-700 mb-5 transition-colors"
        >
          ← Back
        </button>

        <h1 className="text-xl font-black text-slate-900 mb-5">{t(language, "bookNow")}</h1>

        <section className="rounded-3xl border border-slate-100 bg-white p-5 shadow-xl shadow-slate-100/50 backdrop-blur-md space-y-5">
          {/* Appointment Slot Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Select Date & Time</label>
            <input
              type="datetime-local"
              value={slot}
              onChange={(e) => setSlot(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-white/90 px-4 py-3.5 text-base font-semibold outline-none transition-all focus:border-teal-500 focus:ring-4 focus:ring-teal-500/5"
            />
          </div>

          {/* Action buttons */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              onClick={onVoice}
              disabled={loading}
              className={`rounded-2xl border px-3 py-4 text-sm font-bold transition-all active:scale-[0.98] flex items-center justify-center gap-2 ${
                isListening 
                  ? "border-rose-400 bg-rose-50 text-rose-700 animate-pulse" 
                  : "border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700"
              }`}
            >
              <span className="text-lg">{isListening ? "🔴" : "🎙️"}</span>
              <span>{isListening ? "Listening..." : t(language, "useVoice")}</span>
            </button>
            <button
              disabled={loading}
              onClick={onBook}
              className="rounded-2xl bg-teal-600 hover:bg-teal-700 px-3 py-4 text-sm font-extrabold text-white shadow-md shadow-teal-500/10 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            >
              {loading ? (
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <>
                  <span>📅</span>
                  <span>{t(language, "bookNow")}</span>
                </>
              )}
            </button>
          </div>

          {/* Status Message */}
          {message ? (
            <p className="rounded-2xl bg-slate-50 border border-slate-150 px-4 py-3 text-center text-xs font-semibold text-slate-600 animate-fade-in">
              💡 {message}
            </p>
          ) : null}
        </section>

        {/* Offline Warning Banner */}
        {!isOnline && (
          <article className="mt-5 rounded-3xl bg-amber-50 border border-amber-200/50 p-5 shadow-md shadow-amber-500/5 animate-fade-in flex gap-4">
            <span className="text-3xl">📶</span>
            <div>
              <h4 className="text-sm font-bold text-amber-800 leading-none mb-1.5">Offline Mode Active</h4>
              <p className="text-xs text-amber-700 leading-relaxed font-medium">
                Your appointment will be securely saved locally on this device using IndexedDB and will automatically sync once your connection is restored.
              </p>
            </div>
          </article>
        )}
      </main>
    </>
  );
}
