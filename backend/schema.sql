CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  phone_number VARCHAR(20) UNIQUE NOT NULL,
  language VARCHAR(8) NOT NULL DEFAULT 'en',
  location_lat DOUBLE PRECISION,
  location_lng DOUBLE PRECISION,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE clinics (
  id SERIAL PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  specialty VARCHAR(80) NOT NULL,
  avg_wait_time INTEGER NOT NULL DEFAULT 20,
  is_available BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE appointments (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  clinic_id INTEGER NOT NULL REFERENCES clinics(id),
  appointment_time TIMESTAMP NOT NULL,
  booking_status VARCHAR(32) NOT NULL DEFAULT 'confirmed',
  client_request_id VARCHAR(64) UNIQUE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE queue_data (
  clinic_id INTEGER PRIMARY KEY REFERENCES clinics(id),
  active_patients INTEGER NOT NULL DEFAULT 0,
  avg_consultation_time INTEGER NOT NULL DEFAULT 12,
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);
