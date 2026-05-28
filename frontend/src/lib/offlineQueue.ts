import { openDB } from "idb";
import { bookAppointment } from "./api";
import { PendingBooking } from "@/types";

const DB_NAME = "sevacare-offline";
const STORE = "bookings";

async function db() {
  return openDB(DB_NAME, 1, {
    upgrade(database) {
      if (!database.objectStoreNames.contains(STORE)) {
        database.createObjectStore(STORE, { keyPath: "id" });
      }
    },
  });
}

export async function addPendingBooking(item: PendingBooking) {
  const database = await db();
  await database.put(STORE, item);
}

export async function getPendingBookings(): Promise<PendingBooking[]> {
  const database = await db();
  return database.getAll(STORE);
}

export async function removePendingBooking(id: string) {
  const database = await db();
  await database.delete(STORE, id);
}

export async function syncPendingBookings() {
  const pending = await getPendingBookings();
  if (!pending.length || !navigator.onLine) {
    return { synced: 0, remaining: pending.length };
  }

  let synced = 0;
  for (const item of pending) {
    try {
      await bookAppointment({
        user_id: item.user_id,
        clinic_id: item.clinic_id,
        appointment_time: item.appointment_time,
        client_request_id: item.id,
      });
      await removePendingBooking(item.id);
      synced += 1;
    } catch {
      // Keep in queue for next retry
    }
  }
  const remaining = (await getPendingBookings()).length;
  return { synced, remaining };
}
