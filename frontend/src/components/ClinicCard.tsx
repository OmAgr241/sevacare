import Link from "next/link";
import Image from "next/image";
import { Clinic, LanguageCode } from "@/types";
import { t } from "@/lib/translations";

const specialtyIcons: Record<string, string> = {
  "General Medicine": "/clinic_general.png",
  "Pediatrics": "/clinic_pediatric.png",
  "Gynecology": "/clinic_gynecology.png",
  "Eye Care": "/clinic_general.png",
  "Dental Care": "/clinic_general.png",
};

export default function ClinicCard({ clinic, lang }: { clinic: Clinic; lang: LanguageCode }) {
  const thumbnail = specialtyIcons[clinic.specialty] || "/clinic_general.png";

  // Dynamic wait time badge color
  let waitTimeColor = "bg-emerald-50 text-emerald-700 border-emerald-100/50";
  if (clinic.wait_time_mins > 30) {
    waitTimeColor = "bg-rose-50 text-rose-700 border-rose-100/50 animate-pulse";
  } else if (clinic.wait_time_mins > 15) {
    waitTimeColor = "bg-amber-50 text-amber-700 border-amber-100/50";
  }

  return (
    <article className="rounded-3xl border border-slate-100 bg-white p-4 shadow-md shadow-slate-100/50 hover:shadow-lg hover:shadow-slate-200/50 transition-all duration-300 flex flex-col justify-between relative overflow-hidden group">
      <div className="flex gap-4">
        {/* Specialty Thumbnail */}
        <div className="relative h-16 w-16 rounded-2xl overflow-hidden bg-slate-50 border border-slate-100 flex-shrink-0">
          <Image
            src={thumbnail}
            alt={clinic.specialty}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Info */}
        <div className="flex-1">
          <div className="flex items-start justify-between gap-1">
            <h4 className="text-base font-extrabold text-slate-900 group-hover:text-teal-600 transition-colors leading-snug">
              {clinic.name}
            </h4>
            <span className={`inline-flex items-center gap-1 text-[10px] font-bold rounded-md px-1.5 py-0.5 border uppercase tracking-wider ${
              clinic.is_available 
                ? "bg-emerald-50 text-emerald-600 border-emerald-100/50" 
                : "bg-slate-50 text-slate-400 border-slate-100"
            }`}>
              {clinic.is_available ? "Open" : "Closed"}
            </span>
          </div>

          <p className="text-xs font-semibold text-slate-500 mt-0.5">{clinic.specialty}</p>
          <p className="mt-1 text-xs font-medium text-slate-600">
            {clinic.available_doctor_count} doctor{clinic.available_doctor_count === 1 ? "" : "s"} available
          </p>
          <p className="mt-1 text-xs font-bold text-teal-700">Fees from Rs. {clinic.consultation_fee}</p>

          <div className="mt-3.5 flex flex-wrap gap-2 text-xs font-bold">
            <span className="inline-flex items-center gap-1 rounded-xl bg-blue-50/70 border border-blue-100/50 px-3 py-1 text-blue-700">
              📍 {clinic.distance_km.toFixed(1)} km
            </span>
            <span className={`inline-flex items-center gap-1 rounded-xl border px-3 py-1 ${waitTimeColor}`}>
              ⏱️ {t(lang, "waitTime")}: {clinic.wait_time_mins}m
            </span>
          </div>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <Link 
          href={`/wait-time/${clinic.id}`} 
          className="rounded-2xl border border-slate-100 bg-slate-50/70 hover:bg-slate-100 px-3 py-3 text-center text-xs font-bold text-slate-700 transition-all active:scale-[0.98]"
        >
          {t(lang, "waitTime")} Prediction
        </Link>
        <Link 
          href={`/clinics/${clinic.id}/book`} 
          className="rounded-2xl bg-teal-600 hover:bg-teal-700 px-3 py-3 text-center text-xs font-extrabold text-white shadow-md shadow-teal-500/10 transition-all active:scale-[0.98]"
        >
          {t(lang, "bookNow")}
        </Link>
      </div>
    </article>
  );
}
