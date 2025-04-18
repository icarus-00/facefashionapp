/*outfitName
string
-
fileID
string
-
brand
string
-
size
string
-
material
string
-
garmentType
enum
-
attire
relationship with attire*/
/*
interface Outfit extends Models.Document {
  fileID: string;
  outfitName: string;
  // Add other outfit properties as needed
}

*/
import { Modal } from "@/components/ui/modal";
import { Model } from "./model";
import { Models } from "react-native-appwrite";

interface Outfit extends Models.Document {
  outfitName: string;
  fileID: string;
  brand: string;
  size: string;
  attireTheme: string;
  material: string;
  garmentType: string | "Tops" | "Bottoms" | "Full" | "Accessories";
}
interface OutfitWithImage extends Outfit {
  imageUrl: string;
}

interface OutfitAdd {
  outfitName: string;
  fileID: string | "";
  brand: string;
  size: string;
  attireTheme: string;
  material: string;
  garmentType: string | "Tops" | "Bottoms" | "Full" | "Accessories";
  file: { name: string; type: string; size: number; uri: string };
}

export { Outfit, OutfitWithImage, OutfitAdd };
