type OutfitCategory = "full" | "top" | "bottom" | "accessory";

// Define structure for outfit items
type OutfitItem = {
  imageID: string;
  category: OutfitCategory;
  imageUrl: string;
};

type Data = {
  actorImageID: string;
  actorImageUrl: string;
  outfitItems: OutfitItem[];
  userId: string;
  length: number;
  outfitImageUrls: string[];
};

export default Data;
