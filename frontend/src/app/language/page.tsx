"use client";

import { useRouter } from "next/navigation";
import { languageOptions, t } from "@/lib/translations";
import { useSevaStore } from "@/store/useSevaStore";

const languageDetails: Record<string, { nativeName: string; flag: string }> = {
  en: { nativeName: "English", flag: "🇬🇧" },
  hi: { nativeName: "हिंदी", flag: "🇮🇳" },
  kn: { nativeName: "ಕನ್ನಡ", flag: "🇮🇳" },
  ta: { nativeName: "தமிழ்", flag: "🇮🇳" },
  te: { nativeName: "తెలుగు", flag: "🇮🇳" },
  bn: { nativeName: "বাংলা", flag: "🇮🇳" },
  mr: { nativeName: "मराठी", flag: "🇮🇳" },
};

export default function LanguagePage() {
  const router = useRouter();
  const language = useSevaStore((s) => s.language);
  const setLanguage = useSevaStore((s) => s.setLanguage);

  return (
    <main className="mx-auto min-h-screen w-full max-w-md md:max-w-lg bg-gradient-to-b from-teal-50/30 to-white px-6 py-8 shadow-2xl shadow-teal-900/10 flex flex-col justify-between relative overflow-hidden">
      <div className="absolute top-[-10%] right-[-10%] w-64 h-64 rounded-full bg-teal-200/20 blur-3xl" />

      <div className="z-10">
        <section className="text-center pt-4 pb-2">
          <span className="text-4xl">🗣️</span>
          <h1 className="mt-3 text-2xl font-black tracking-tight text-slate-900">
            {t(language, "chooseLanguage")}
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Select your preferred language for the entire app.
          </p>
        </section>

        <section className="mt-8 grid grid-cols-1 gap-3">
          {languageOptions.map((option) => {
            const isSelected = language === option.code;
            const details = languageDetails[option.code] || { nativeName: option.label, flag: "🌐" };
            return (
              <button
                key={option.code}
                onClick={() => setLanguage(option.code)}
                className={`w-full rounded-2xl border px-5 py-4 text-left flex items-center justify-between transition-all duration-200 ${
                  isSelected
                    ? "border-teal-500 bg-teal-50/70 text-teal-900 shadow-md shadow-teal-600/5 font-semibold"
                    : "border-slate-200 bg-white/80 hover:bg-white text-slate-700 hover:border-slate-300 shadow-sm"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{details.flag}</span>
                  <div>
                    <span className="block text-sm text-slate-400 font-medium leading-none mb-1">{option.label}</span>
                    <span className="block text-base leading-none font-bold">{details.nativeName}</span>
                  </div>
                </div>
                {isSelected && (
                  <span className="h-6 w-6 rounded-full bg-teal-600 text-white flex items-center justify-center text-xs font-bold shadow-sm shadow-teal-600/20">
                    ✓
                  </span>
                )}
              </button>
            );
          })}
        </section>
      </div>

      <section className="mt-8 z-10 pb-2">
        <button
          onClick={() => router.push("/login")}
          className="group relative flex w-full items-center justify-center rounded-2xl bg-slate-900 px-4 py-4 text-center text-lg font-bold text-white shadow-lg shadow-slate-950/20 hover:bg-slate-800 transition-all duration-200 active:scale-[0.98] overflow-hidden"
        >
          <span className="relative z-10">{t(language, "start")}</span>
        </button>
      </section>
    </main>
  );
}
