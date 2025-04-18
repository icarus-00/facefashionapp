import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { account } from "@/services/config/appwrite";
import { images } from "../../constants/images";

// Define outfit category types
type OutfitCategory = "full" | "top" | "bottom" | "accessory";

// Define structure for outfit items
type OutfitItem = {
  imageID: string;
  category: OutfitCategory;
  imageUrl: string;
};
type ActorItem = {
  imageID: string;
  imageUrl: string;
};
type Data = {
  actorImageID: string;
  actorImageUrl: string;
  outfitItems: OutfitItem[];
  actorItems: ActorItem;
  userId: string;
  length: number;
  outfitImageUrls: string[];
};

type Actions = {
  updateActorImageID: (imageID: string, imagesUrl: string) => void;
  addOutfitItem: (
    imageID: string,
    category: OutfitCategory,
    imageUrl: string
  ) => void;
  removeOutfitItem: (category: OutfitCategory) => void;
  clearOutfitItems: () => void;
  initializeUserId: (id: string) => void;
  getLength: () => number;
  hasFullOutfit: () => boolean;
  updateActorImageUrl: (imageUrl: string) => void;
  setOutfitImageUrls: (urls: string[]) => void;
  updateActorItems: (imageID: string, imageUrl: string) => void;
  removeActorItems: () => void;
};

const useStore = create<Data & Actions>()(
  persist(
    (set, get) => ({
      actorImageID: "",
      actorImageUrl: "",
      outfitItems: [],
      userId: "",
      length: 0,
      outfitImageUrls: [],
      actorItems: { imageID: "", imageUrl: "" },

      initializeUserId: (id) => {
        set({ userId: id });
      },

      updateActorImageID: (imageID, imageUrl) =>
        set({ actorImageID: imageID, actorImageUrl: imageUrl }),
      updateActorItems: (imageID, imageUrl) =>
        set({ actorItems: { imageID: imageID, imageUrl: imageUrl } }),
      removeActorItems: () =>
        set({ actorItems: { imageID: "", imageUrl: "" } }),

      addOutfitItem: (imageID, category, imageUrl) => {
        const { outfitItems } = get();

        // If adding a full outfit, clear all other items
        if (category === "full") {
          set({
            outfitItems: [{ imageID, category, imageUrl }],
          });
          return;
        }

        // If we already have a full outfit, remove it
        let updatedItems = outfitItems.filter(
          (item) => item.category !== "full"
        );

        // Remove any existing item of the same category
        updatedItems = updatedItems.filter(
          (item) => item.category !== category
        );

        // Add the new item
        updatedItems.push({ imageID, category, imageUrl });

        set({ outfitItems: updatedItems });
      },

      removeOutfitItem: (category) => {
        const { outfitItems } = get();
        set({
          outfitItems: outfitItems.filter((item) => item.category !== category),
        });
      },

      clearOutfitItems: () => {
        set({ outfitItems: [] });
      },

      getLength: () => {
        const { actorItems, outfitItems } = get();
        return (
          (actorItems.imageID === "" && actorItems.imageUrl === "" ? 0 : 1) +
          (outfitItems.length === 0 ? 0 : 1)
        );
      },

      hasFullOutfit: () => {
        const { outfitItems } = get();
        return outfitItems.some((item) => item.category === "full");
      },

      updateActorImageUrl: (imageUrl) => set({ actorImageUrl: imageUrl }),
      setOutfitImageUrls: (urls) => set({ outfitImageUrls: urls }),
    }),
    {
      name: "app-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export default useStore;
