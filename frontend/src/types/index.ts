export type LanguageCode = "en" | "hi" | "kn" | "ta" | "te" | "bn" | "mr";

export type Doctor = {
  id: number;
  name: string;
  consultation_fee: number;
  is_available: boolean;
};

export type Clinic = {
  id: number;
  name: string;
  specialty: string;
  doctor_name: string;
  consultation_fee: number;
  latitude: number;
  longitude: number;
  distance_km: number;
  wait_time_mins: number;
  is_available: boolean;
  available_doctor_count: number;
  doctors: Doctor[];
};

export type ClinicDetail = {
  id: number;
  name: string;
  specialty: string;
  doctor_name: string;
  consultation_fee: number;
  latitude: number;
  longitude: number;
  avg_wait_time: number;
  active_patients: number;
  avg_consultation_time: number;
  is_available: boolean;
  available_doctor_count: number;
  doctors: Doctor[];
};

export type WaitPrediction = {
  clinic_id: number;
  estimated_wait_mins: number;
  crowd_level: string;
  best_visit_time: string;
};

export type PendingBooking = {
  id: string;
  user_id: number;
  clinic_id: number;
  doctor_id: number;
  appointment_time: string;
  created_at: string;
};
