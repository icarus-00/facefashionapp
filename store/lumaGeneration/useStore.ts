import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { account } from "@/services/config/appwrite";
import { images } from "../../constants/images";
import { VideoGenInput } from "@/interfaces/generationApi";

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
  weight: number;
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
  // Add for video generation
  videoGenInput: VideoGenInput & {imageUrl:string} | null;
};

type Actions = {
  updateActorImageID: (imageID: string, imagesUrl: string) => void;
  showFullOutfitAlert: () => boolean;
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
  ) => boolean;
  removeOutfitItem: (category: OutfitCategory) => void;
  clearOutfitItems: () => void;
  initializeUserId: (id: string) => void;
  getLength: () => number;
  hasFullOutfit: () => boolean;
  updateActorImageUrl: (imageUrl: string) => void;
  setOutfitImageUrls: (urls: string[]) => void;
  updateActorItems: (imageID: string, imageUrl: string, actorName: string, age: number, weight: number, height: number, bio: string, gender: string, genre: string) => void;
  removeActorItems: () => void;
  setVideoGenInput: (input: VideoGenInput & {imageUrl:string}) => void;
  clearVideoGenInput: () => void;
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

      actorItems: { imageID: "", imageUrl: "", actorName: "", age: 0, weight: 0, height: 0, bio: "", gender: "", genre: ""},

      videoGenInput: null,

      initializeUserId: (id) => {
        set({ userId: id });
      },

      updateActorImageID: (imageID, imageUrl) =>
        set({ actorImageID: imageID, actorImageUrl: imageUrl }),
      updateActorItems: (imageID, imageUrl, actorName, age, weight, height, bio, gender, genre) => {
        // Selecting an actor clears videoGenInput
        set({
          videoGenInput: null,
          actorItems: { imageID: imageID, imageUrl: imageUrl, actorName, age, weight, height, bio, gender, genre }
        })
      },
      removeActorItems: () =>
        set({ actorItems: { imageID: "", imageUrl: "", actorName: "", age: 0, weight: 0, height: 0, bio: "", gender: "", genre: "" } }),

      // Alert message function
      showFullOutfitAlert: () => {
        if (typeof window !== 'undefined' && typeof alert === 'function') {
          alert("You've already selected a full outfit. Please remove it before adding individual items.");
        }
        return false; // Return false to indicate the operation wasn't successful
      },

      addOutfitItem: (imageID, category, imageUrl, outfitName, brand, size, material, garmentType, attireTheme) => {
        // Selecting an outfit clears videoGenInput
        const { outfitItems, showFullOutfitAlert } = get();
        set({ videoGenInput: null });
        
        // Determine the garment type mapping to our categories
        // This is important for validation of selections
        let mappedCategory = category;
        
        // If the garment type is specified, use it to determine the correct category
        if (garmentType) {
          const garmentTypeLower = garmentType.toLowerCase();
          
          if (garmentTypeLower.includes('full') || garmentTypeLower.includes('dress') || garmentTypeLower.includes('suit')) {
            mappedCategory = 'full';
          } else if (garmentTypeLower.includes('top') || garmentTypeLower.includes('shirt') || garmentTypeLower.includes('blouse')) {
            mappedCategory = 'top';
          } else if (garmentTypeLower.includes('bottom') || garmentTypeLower.includes('pant') || garmentTypeLower.includes('skirt')) {
            mappedCategory = 'bottom';
          } else if (garmentTypeLower.includes('accessory') || garmentTypeLower.includes('hat') || garmentTypeLower.includes('jewelry')) {
            mappedCategory = 'accessory';
          }
        }
        
        // Case 1: If adding a full outfit, clear all other items
        if (mappedCategory === "full") {
          set({

            outfitItems: [{ imageID, category: mappedCategory, imageUrl, outfitName, brand, size, material, garmentType, attireTheme}],

          });
          return true; // Operation successful
        }
        
        // Case 2: If we already have a full outfit, don't allow additional items and show alert
        if (outfitItems.some(item => item.category === "full")) {
          // Show alert to inform the user
          return showFullOutfitAlert();
        }
        
        // Create a copy of current items
        let updatedItems = [...outfitItems];
        
        // Remove any existing item of the same category (top/bottom/accessory)
        updatedItems = updatedItems.filter(item => item.category !== mappedCategory);
        
        // Add the new item with the mapped category
        const newItem = { 
          imageID, 
          category: mappedCategory, 
          imageUrl, 
          outfitName, 
          brand, 
          size, 
          material, 
          garmentType, 
          attireTheme
        };
        
        // Add the new item
        updatedItems.push(newItem);
        
        // Maximum 3 items - one of each category (top, bottom, accessory)
        if (updatedItems.length <= 3) {
          set({ outfitItems: updatedItems });
          return true; // Operation successful
        }
        
        return false; // Operation failed
      },

      removeOutfitItem: (category) => {
        const { outfitItems } = get();
        // Always create a new array reference
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
      setVideoGenInput: (input) => {
        // Clear actor and outfit selections when setting videoGenInput
        set({
          videoGenInput: input,
          actorItems: { imageID: "", imageUrl: "", actorName: "", age: 0, weight: 0, height: 0, bio: "", gender: "", genre: "" },
          outfitItems: [],
        });
      },
      clearVideoGenInput: () => set({ videoGenInput: null }),
      
    }),
    {
      name: "app-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export default useStore;
