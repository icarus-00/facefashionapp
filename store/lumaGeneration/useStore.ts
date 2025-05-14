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
  outfitName: string;
  brand: string;
  size: string;
  material: string;
  garmentType: string;
  attireTheme: string;
};
type ActorItem = {
  imageID: string;
  imageUrl: string;
  actorName: string;
  age: number;
  width: number;
  height: number;
  bio: string;
  gender: string;
  genre: string;
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
    imageUrl: string,
    outfitName: string,
    brand: string,
    size: string,
    material: string,
    garmentType: string,
    attireTheme: string
  ) => void;
  removeOutfitItem: (category: OutfitCategory) => void;
  clearOutfitItems: () => void;
  initializeUserId: (id: string) => void;
  getLength: () => number;
  hasFullOutfit: () => boolean;
  updateActorImageUrl: (imageUrl: string) => void;
  setOutfitImageUrls: (urls: string[]) => void;
  updateActorItems: (imageID: string, imageUrl: string, actorName: string, age: number, width: number, height: number, bio: string, gender: string, genre: string) => void;
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
      actorItems: { imageID: "", imageUrl: "", actorName: "", age: 0, width: 0, height: 0, bio: "", gender: "", genre: "" },

      initializeUserId: (id) => {
        set({ userId: id });
      },

      updateActorImageID: (imageID, imageUrl) =>
        set({ actorImageID: imageID, actorImageUrl: imageUrl }),
      updateActorItems: (imageID, imageUrl, actorName, age, width, height, bio, gender, genre) => {
        console.log(imageUrl);
        set({ actorItems: { imageID: imageID, imageUrl: imageUrl, actorName, age, width, height, bio, gender, genre } })
      },
      removeActorItems: () =>
        set({ actorItems: { imageID: "", imageUrl: "", actorName: "", age: 0, width: 0, height: 0, bio: "", gender: "", genre: "" } }),

      addOutfitItem: (imageID, category, imageUrl, outfitName, brand, size, material, garmentType, attireTheme) => {
        const { outfitItems } = get();

        // If adding a full outfit, clear all other items
        if (category === "full") {
          set({
            outfitItems: [{ imageID, category, imageUrl, outfitName, brand, size, material, garmentType, attireTheme }],
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
        updatedItems.push({ imageID, category, imageUrl, outfitName, brand, size, material, garmentType, attireTheme });

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
