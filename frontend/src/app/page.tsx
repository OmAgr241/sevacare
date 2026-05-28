import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md md:max-w-5xl flex-col md:flex-row md:items-center md:justify-between gap-10 bg-gradient-to-b from-teal-50/50 via-white to-white px-6 py-8 md:py-16 shadow-2xl shadow-teal-900/10 relative overflow-hidden">
      {/* Decorative background blur shapes */}
      <div className="absolute top-[-20%] left-[-20%] w-72 h-72 rounded-full bg-teal-200/30 blur-3xl" />
      <div className="absolute bottom-[-10%] right-[-10%] w-72 h-72 rounded-full bg-blue-200/20 blur-3xl" />

      {/* Left Column: Text & CTA */}
      <section className="pt-4 z-10 flex-1 flex flex-col justify-center max-w-lg">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-teal-50 px-3 py-1.5 text-xs font-semibold text-teal-700 border border-teal-100/50 self-start animate-fade-in">
          <span className="h-1.5 w-1.5 rounded-full bg-teal-500 animate-pulse" />
          SevaCare Rural
        </div>

        <h1 className="mt-5 text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
          Rural Healthcare <br />
          <span className="bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
            Optimizer
          </span>
        </h1>
        
        <p className="mt-4 text-base md:text-lg leading-relaxed text-slate-600">
          Find nearby clinics, check live wait times, and book appointments even on weak 2G/3G internet.
        </p>

        {/* Features badges */}
        <div className="mt-6 grid grid-cols-3 gap-2.5">
          <div className="rounded-2xl border border-slate-100 bg-white/75 p-3 text-center backdrop-blur-sm">
            <span className="block text-lg">📶</span>
            <span className="mt-1 block text-xs font-medium text-slate-500">Offline-First</span>
          </div>
          <div className="rounded-2xl border border-slate-100 bg-white/75 p-3 text-center backdrop-blur-sm">
            <span className="block text-lg">⏱️</span>
            <span className="mt-1 block text-xs font-medium text-slate-500">Live Wait</span>
          </div>
          <div className="rounded-2xl border border-slate-100 bg-white/75 p-3 text-center backdrop-blur-sm">
            <span className="block text-lg">🗣️</span>
            <span className="mt-1 block text-xs font-medium text-slate-500">7 Languages</span>
          </div>
        </div>

        <div className="mt-8 space-y-3">
          <Link 
            href="/language" 
            className="group relative flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-teal-600 to-teal-500 px-4 py-4 text-center text-lg font-bold text-white shadow-lg shadow-teal-500/20 hover:from-teal-700 hover:to-teal-600 transition-all duration-200 active:scale-[0.98] overflow-hidden"
          >
            <span className="relative z-10">Get Started</span>
            <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          </Link>
          <p className="text-center text-xs font-medium text-slate-400">
            Made for weak connections • Auto-sync queue
          </p>
        </div>
      </section>

      {/* Right Column: Hero Illustration (desktop only or top of mobile) */}
      <section className="z-10 flex-1 w-full max-w-md md:max-w-xl">
        <div className="relative w-full aspect-video md:aspect-[4/3] rounded-3xl overflow-hidden border border-teal-100/40 bg-white shadow-2xl shadow-teal-600/5 hover:scale-[1.01] transition-transform duration-300">
          <Image
            src="/hero_illustration.png"
            alt="Rural Healthcare SevaCare"
            fill
            className="object-cover"
            priority
          />
        </div>
      </section>
    </main>
  );
}
