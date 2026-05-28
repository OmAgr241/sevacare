# SevaCare Rural 🏥

**SevaCare Rural** is a healthcare technology platform designed to bring modern, queue-less appointment booking to rural and underserved regions (with a focus on India). It solves the problem of rural patients waiting hours in crowded Primary Health Centers (PHCs) by providing live wait-time predictions, offline-first booking, and multilingual support.

---

## 🚀 Key Features

### 1. Smart Clinic Discovery
* **Geolocation Integration:** The app uses the user's browser location to find the nearest health centers.
* **Global Demo Mode:** If the app is tested by someone hundreds of kilometers away from the real clinics, the backend intelligently bypasses the radius limits and mocks realistic, local distances (e.g., "1.4 km away") so the app can be demoed anywhere in the world seamlessly.

### 2. Live Wait-Time Predictions
* Instead of showing static availability, the system calculates estimated wait times dynamically.
* **The Math:** It multiplies the number of active patients currently in the queue by the average consultation time to give the user a highly accurate prediction of when they will actually see the doctor.

### 3. Low-Connectivity & Offline Support (PWA)
* Rural areas often have spotty internet. SevaCare is built as a **Progressive Web App (PWA)** with Service Workers.
* **Offline Queue:** If a user tries to book an appointment while their internet drops, the request is saved to a local offline queue. A background `SyncManager` automatically pushes the booking to the backend once the internet connection is restored.

### 4. Vernacular / Multi-language Support
* To cater to rural populations, the app features a robust translation system.
* It supports multiple regional languages including **English, Hindi, Kannada, Telugu, and Tamil**.

### 5. Phone & OTP Authentication
* Rural users are less likely to have email addresses. The app utilizes a seamless Phone Number + OTP authentication flow to log users in quickly and securely.

---

## 💻 Tech Stack & Architecture

### **Frontend (The User Interface)**
* **Next.js 16 (React):** The core framework, utilizing the App Router and Server-Side Rendering (SSR) for blazing-fast load times.
* **TypeScript:** Ensures the code is strictly typed and bug-free.
* **Tailwind CSS:** Used for the highly-responsive, premium "glassmorphic" user interface. The UI dynamically adapts from mobile screens up to wide desktop displays.
* **Zustand (`useSevaStore.ts`):** A lightweight state management tool used to keep track of the user's selected language, authentication state, and session details.

### **Backend (The Server & API)**
* **FastAPI (Python):** An incredibly fast, modern Python web framework used to build the API endpoints that the frontend talks to.
* **SQLAlchemy (ORM):** Manages the database interactions smoothly. 
* **SQLite:** Used as the primary database to store Clinics, Queues, Users, and Appointments.
* **Uvicorn:** The lightning-fast ASGI server that runs the Python backend.

---

## 🛠️ How It All Connects (The User Flow)

1. **Authentication:** The user opens the app (or installs it as a PWA) and enters their phone number. The Python backend generates an OTP, and once verified, logs the user in.
2. **Dashboard:** The Next.js frontend asks the browser for GPS coordinates. It sends these coordinates to the `/clinics/nearby` FastAPI endpoint.
3. **Filtering:** The backend calculates the Haversine distance to all known clinics in the SQLite database. It filters out far ones (or applies the demo mock logic) and returns the nearby clinics along with live queue data.
4. **Booking:** The user selects a clinic, views the live wait-time, and clicks "Book Now".
5. **Confirmation:** The booking request is sent. If the internet fails, the frontend catches it, saves it locally, and retries automatically later. Otherwise, it confirms instantly and reserves the slot in the database!
