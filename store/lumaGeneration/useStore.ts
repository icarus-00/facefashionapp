import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { account } from "@/services/config/appwrite";

type Data = {
  actorImageID: string;
  outfitImageID: string;
  userId: string;
  length: number;
};

type Actions = {
  updateActorImageID: (imageID: string) => void;
  updateOutfitImageID: (imageID: string) => void;
  initializeUserId: (id: string) => void;
  getLength: () => number;
};

const useStore = create<Data & Actions>()(
  persist(
    (set, get) => ({
      actorImageID: "",
      outfitImageID: "",
      userId: "",
      length: 0,

      initializeUserId: (id) => {
        set({ userId: id });
      },

      updateActorImageID: (imageID) => set({ actorImageID: imageID }),
      updateOutfitImageID: (imageID) => set({ outfitImageID: imageID }),
      getLength: () => {
        const { actorImageID, outfitImageID } = get();
        return (actorImageID === "" ? 0 : 1) + (outfitImageID === "" ? 0 : 1);
      },
    }),
    {
      name: "app-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export default useStore;
