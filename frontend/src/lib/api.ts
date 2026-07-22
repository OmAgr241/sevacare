import { Clinic, ClinicDetail, WaitPrediction } from "@/types";

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL && process.env.NEXT_PUBLIC_API_BASE_URL !== "" ? process.env.NEXT_PUBLIC_API_BASE_URL : "http://localhost:8000";

export async function sendOtp(phone_number: string) {
  const res = await fetch(`${baseUrl}/auth/send-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone_number }),
  });
  return res.json();
}

export async function verifyOtp(phone_number: string, otp: string, language: string) {
  const res = await fetch(`${baseUrl}/auth/verify-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone_number, otp, language }),
  });
  return res.json();
}

export async function fetchNearbyClinics(lat: number, lng: number): Promise<Clinic[]> {
  const query = new URLSearchParams({ lat: String(lat), lng: String(lng), radius_km: "30" });
  const res = await fetch(`${baseUrl}/clinics/nearby?${query.toString()}`, {
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error("Unable to load clinics");
  }
  return res.json();
}

export async function fetchClinicDetail(id: number): Promise<ClinicDetail> {
  const res = await fetch(`${baseUrl}/clinics/${id}`, { cache: "no-store" });
  if (!res.ok) {
    throw new Error("Unable to load clinic");
  }
  return res.json();
}

export async function fetchWaitPrediction(clinicId: number): Promise<WaitPrediction> {
  const res = await fetch(`${baseUrl}/predictions/wait-time?clinic_id=${clinicId}`, { cache: "no-store" });
  if (!res.ok) {
    throw new Error("Unable to load prediction");
  }
  return res.json();
}

export async function bookAppointment(payload: {
  user_id: number;
  clinic_id: number;
  doctor_id: number;
  appointment_time: string;
  client_request_id?: string;
}) {
  const res = await fetch(`${baseUrl}/appointments/book`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    throw new Error("Unable to book appointment");
  }
  return res.json();
}
