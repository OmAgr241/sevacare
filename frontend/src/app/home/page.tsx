"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { fetchNearbyClinics } from "@/lib/api";
import { t } from "@/lib/translations";
import { useSevaStore } from "@/store/useSevaStore";
import TopBar from "@/components/TopBar";
import ClinicCard from "@/components/ClinicCard";
import { Clinic } from "@/types";

const fallbackLocation = { lat: 13.1362, lng: 78.129 };

const categories = [
  { id: "all", label: "All Clinics", icon: "🏥" },
  { id: "General Medicine", label: "General", icon: "🩺" },
  { id: "Pediatrics", label: "Pediatrics", icon: "🧸" },
  { id: "Gynecology", label: "Gynecology", icon: "🌸" },
  { id: "Dental Care", label: "Dentist", icon: "🦷" },
  { id: "Eye Care", label: "Eye Care", icon: "👁️" },
];

export default function HomePage() {
  const language = useSevaStore((s) => s.language);
  const userId = useSevaStore((s) => s.userId);
  const phoneNumber = useSevaStore((s) => s.phoneNumber);
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    if (!userId) {
      window.location.href = "/login";
      return;
    }
    const run = async () => {
      setLoading(true);
      setError("");
      const load = async (lat: number, lng: number) => {
        const list = await fetchNearbyClinics(lat, lng);
        setClinics(list);
      };
      try {
        if ("geolocation" in navigator) {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              try {
                await load(position.coords.latitude, position.coords.longitude);
              } catch {
                setError("Unable to connect to service. Showing cached clinics.");
                await load(fallbackLocation.lat, fallbackLocation.lng);
              } finally {
                setLoading(false);
              }
            },
            async () => {
              try {
                await load(fallbackLocation.lat, fallbackLocation.lng);
              } catch {
                setError("Could not load clinics.");
              } finally {
                setLoading(false);
              }
            },
            { enableHighAccuracy: false, timeout: 8000 }
          );
          return;
        }
        await load(fallbackLocation.lat, fallbackLocation.lng);
      } catch {
        setError("Could not load clinics.");
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [userId]);

  // Filter logic: match search query and category tab
  const filtered = clinics.filter((clinic) => {
    const normalizedQuery = query.toLowerCase();
    const matchesSearch =
      clinic.name.toLowerCase().includes(normalizedQuery) ||
      clinic.specialty.toLowerCase().includes(normalizedQuery) ||
      clinic.doctor_name.toLowerCase().includes(normalizedQuery);
    const matchesCategory = selectedCategory === "all" || clinic.specialty === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <>
      <TopBar />
      <main className="mx-auto min-h-[calc(100vh-65px)] w-full max-w-md md:max-w-4xl lg:max-w-5xl bg-slate-50 px-4 py-6 shadow-2xl shadow-teal-900/5 pb-20">
        
        {/* Welcome Section */}
        <section className="bg-gradient-to-r from-teal-700 to-teal-600 rounded-3xl p-5 text-white shadow-xl shadow-teal-700/10 mb-6 relative overflow-hidden flex flex-col md:flex-row md:items-center">
          <div className="absolute right-[-10%] top-[-20%] text-7xl opacity-10 md:hidden">🏥</div>
          <div className="flex-1">
            <p className="text-xs font-semibold text-teal-200 uppercase tracking-wider">Welcome back</p>
            <h2 className="text-xl md:text-3xl font-bold mt-1">
              {phoneNumber ? `+91 ${phoneNumber.slice(0,5)}-${phoneNumber.slice(5)}` : "SevaCare User"}
            </h2>
            <p className="text-xs md:text-sm text-teal-100 mt-2 md:mt-4 font-medium max-w-sm">
              Find nearby rural clinics and book instant appointments without queues.
            </p>
          </div>
          <div className="hidden md:block w-48 shrink-0 relative z-10 -my-4 ml-4">
            <Image
              src="/hero_illustration.png"
              alt="Healthcare illustration" 
              width={192}
              height={144}
              priority
              className="w-full h-auto drop-shadow-2xl rounded-2xl"
            />
          </div>
        </section>

        {/* Search Bar */}
        <div className="relative mb-6">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg">🔍</span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search clinic or specialty..."
            className="w-full rounded-2xl border border-slate-200 bg-white pl-11 pr-4 py-3.5 text-base outline-none shadow-sm transition-all focus:border-teal-500 focus:ring-4 focus:ring-teal-500/5"
          />
          {query && (
            <button 
              onClick={() => setQuery("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-sm font-semibold"
            >
              Clear
            </button>
          )}
        </div>

        {/* Category Carousel / Tabs */}
        <section className="mb-6">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Specialty Filters</h3>
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 -mx-4 px-4">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex items-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-semibold whitespace-nowrap transition-all ${
                    isSelected
                      ? "bg-teal-600 text-white shadow-md shadow-teal-600/15"
                      : "bg-white border border-slate-200 text-slate-600 hover:border-slate-300"
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Nearby Clinics List */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-black text-slate-900">{t(language, "nearbyClinics")}</h1>
            <span className="text-xs font-bold text-slate-400 bg-slate-200/50 rounded-md px-2 py-1">
              {filtered.length} found
            </span>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 pt-2">
              <div className="h-32 animate-pulse rounded-3xl bg-white border border-slate-100" />
              <div className="h-32 animate-pulse rounded-3xl bg-white border border-slate-100" />
              <div className="h-32 animate-pulse rounded-3xl bg-white border border-slate-100" />
            </div>
          ) : null}

          {!loading && filtered.length === 0 ? (
            <div className="text-center py-12 rounded-3xl border border-dashed border-slate-200 bg-white/50">
              <span className="text-4xl block mb-2">🔍</span>
              <p className="text-sm font-semibold text-slate-500">{t(language, "noClinics")}</p>
            </div>
          ) : null}

          {!loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 pt-2">
              {filtered.map((clinic) => (
                <ClinicCard key={clinic.id} clinic={clinic} lang={language} />
              ))}
            </div>
          )}

          {error ? (
            <p className="rounded-2xl bg-rose-50 border border-rose-100 px-4 py-3 text-sm font-semibold text-rose-700">
              ⚠️ {error}
            </p>
          ) : null}
        </section>
      </main>
    </>
  );
}
