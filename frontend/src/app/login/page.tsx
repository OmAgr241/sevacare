"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { sendOtp, verifyOtp } from "@/lib/api";
import { t } from "@/lib/translations";
import { useSevaStore } from "@/store/useSevaStore";

export default function LoginPage() {
  const router = useRouter();
  const language = useSevaStore((s) => s.language);
  const setSession = useSevaStore((s) => s.setSession);
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [sent, setSent] = useState(false);
  const [message, setMessage] = useState("");
  const [devOtpCode, setDevOtpCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSendOtp = async () => {
    setLoading(true);
    setMessage("");
    setDevOtpCode(null);
    try {
      const data = await sendOtp(phone);
      if (data.success) {
        setSent(true);
        const code = data.dev_otp ?? "123456";
        setDevOtpCode(code);
        setMessage("OTP verification code simulated below.");
      } else {
        setMessage(data.message ?? "Could not send OTP.");
      }
    } catch {
      setMessage("Connection error. Could not send OTP.");
    } finally {
      setLoading(false);
    }
  };

  const onVerify = async () => {
    setLoading(true);
    setMessage("");
    try {
      const data = await verifyOtp(phone, otp, language);
      if (data.success && data.user_id) {
        setSession(data.user_id, phone);
        router.push("/home");
        return;
      }
      setMessage(data.message ?? "Verification failed.");
    } catch {
      setMessage("Verification failed. Please check your internet connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto min-h-screen w-full max-w-md md:max-w-lg bg-gradient-to-b from-teal-50/20 via-white to-white px-6 py-8 shadow-2xl shadow-teal-900/10 flex flex-col justify-between relative overflow-hidden">
      {/* Decorative background blur shapes */}
      <div className="absolute top-[-10%] left-[-10%] w-72 h-72 rounded-full bg-teal-200/20 blur-3xl" />
      <div className="absolute bottom-[-15%] right-[-15%] w-72 h-72 rounded-full bg-blue-200/20 blur-3xl" />

      <div className="z-10 flex-1 flex flex-col justify-center">
        {/* Header/Brand Section */}
        <section className="text-center pb-6">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-600 shadow-lg shadow-teal-500/20">
            <span className="text-2xl text-white">🔐</span>
          </div>
          <h1 className="mt-4 text-2xl font-black text-slate-900">{t(language, "verifyOtp")}</h1>
          <p className="mt-2 text-sm text-slate-500">
            {sent ? "Enter the validation code sent to your phone" : "Log in using your phone number"}
          </p>
        </section>

        {/* Form Container */}
        <section className="mt-4 rounded-3xl border border-slate-100 bg-white/70 p-5 shadow-xl shadow-slate-100/50 backdrop-blur-md">
          {!sent ? (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Phone Number</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-base">🇮🇳 +91</span>
                  <input
                    type="tel"
                    value={phone}
                    maxLength={10}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                    placeholder={t(language, "phoneNumber")}
                    className="w-full rounded-2xl border border-slate-200 bg-white/90 pl-18 pr-4 py-4 text-lg font-medium outline-none transition-all focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-500/5"
                  />
                </div>
              </div>
              <button
                disabled={loading || phone.length < 10}
                onClick={onSendOtp}
                className="group relative flex w-full items-center justify-center rounded-2xl bg-teal-600 px-4 py-4 text-center text-lg font-bold text-white shadow-lg shadow-teal-500/20 hover:from-teal-700 hover:to-teal-600 transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none overflow-hidden"
              >
                {loading ? (
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  <span>{t(language, "sendOtp")}</span>
                )}
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Verification Code</label>
                <input
                  type="text"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  placeholder={t(language, "otpCode")}
                  className="w-full rounded-2xl border border-slate-200 bg-white/90 px-4 py-4 text-center text-2xl font-bold tracking-widest outline-none transition-all focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-500/5 placeholder:tracking-normal placeholder:text-lg placeholder:font-normal"
                />
              </div>
              <button
                disabled={loading || otp.length < 4}
                onClick={onVerify}
                className="group relative flex w-full items-center justify-center rounded-2xl bg-slate-900 px-4 py-4 text-center text-lg font-bold text-white shadow-lg shadow-slate-950/20 hover:bg-slate-800 transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none overflow-hidden"
              >
                {loading ? (
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  <span>{t(language, "verifyOtp")}</span>
                )}
              </button>

              <button
                onClick={() => setSent(false)}
                className="w-full text-center text-sm font-semibold text-teal-600 hover:text-teal-700 mt-2 block"
              >
                ← Back to Phone Number
              </button>
            </div>
          )}
        </section>

        {/* Mock SMS Alert Panel */}
        {sent && devOtpCode && (
          <div className="mt-6 rounded-2xl bg-amber-50 border border-amber-200/50 p-4 shadow-md shadow-amber-500/5 animate-fade-in relative overflow-hidden">
            <div className="absolute right-0 top-0 text-3xl opacity-10">💬</div>
            <div className="flex items-start gap-3">
              <span className="text-xl">📱</span>
              <div>
                <p className="text-xs font-bold text-amber-800 uppercase tracking-wide leading-none mb-1">Simulated SMS Inbox</p>
                <p className="text-sm font-medium text-amber-900">
                  Your verification code is <strong className="text-base font-extrabold text-teal-700 bg-white px-2 py-0.5 rounded-md border border-teal-100 shadow-sm mx-1">{devOtpCode}</strong>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Global Messages */}
        {message && !devOtpCode ? (
          <p className="mt-4 rounded-xl bg-slate-100 px-4 py-3 text-center text-sm font-medium text-slate-700 border border-slate-200/50">
            {message}
          </p>
        ) : null}
      </div>

      <footer className="mt-8 z-10 text-center text-xs text-slate-400 font-medium">
        Secured connection • Works offline
      </footer>
    </main>
  );
}
