import Link from "next/link";

export default function OfflinePage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col items-center justify-center bg-white px-5 text-center">
      <h1 className="text-2xl font-bold text-slate-900">You are offline</h1>
      <p className="mt-3 text-slate-600">You can still check cached clinics and save appointment requests.</p>
      <Link href="/home" className="mt-5 rounded-xl bg-teal-600 px-4 py-3 font-semibold text-white">
        Go to Home
      </Link>
    </main>
  );
}
