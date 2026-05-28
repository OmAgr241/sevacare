"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { LanguageCode } from "@/types";

type SevaState = {
  language: LanguageCode;
  userId: number | null;
  phoneNumber: string;
  isOnline: boolean;
  pendingSync: number;
  setLanguage: (language: LanguageCode) => void;
  setSession: (userId: number, phoneNumber: string) => void;
  setOnlineStatus: (isOnline: boolean) => void;
  setPendingSync: (count: number) => void;
};

export const useSevaStore = create<SevaState>()(
  persist(
    (set) => ({
      language: "en",
      userId: null,
      phoneNumber: "",
      isOnline: true,
      pendingSync: 0,
      setLanguage: (language) => set({ language }),
      setSession: (userId, phoneNumber) => set({ userId, phoneNumber }),
      setOnlineStatus: (isOnline) => set({ isOnline }),
      setPendingSync: (pendingSync) => set({ pendingSync }),
    }),
    { name: "sevacare-app-store" }
  )
);
