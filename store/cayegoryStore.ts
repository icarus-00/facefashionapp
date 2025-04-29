// src/stores/attireStore.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

type AttireStore = {
  themes: string[];
  setThemes: (themes: string[]) => void;
  updateFromOutfits: (outfits: { attireTheme: string }[]) => void;
};

const useAttireStore = create<AttireStore>()(
  persist(
    (set, get) => ({
      themes: ["streetwear" , "casual" , "retro" , "classic"],
      setThemes: (themes) => set({ themes }),
      updateFromOutfits: (outfits) => {
        const unique = Array.from(
          new Set(outfits.map((o) => o.attireTheme).filter(Boolean))
        );
        set({ themes: unique });
      },
    }),
    {
      name: "attire-themes", // key in AsyncStorage :contentReference[oaicite:0]{index=0}
      storage: createJSONStorage(() => AsyncStorage), // uses AsyncStorage under the hood :contentReference[oaicite:1]{index=1}
    }
  )
);
export default useAttireStore;
export { AttireStore };
