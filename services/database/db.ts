import { Databases, Client, Models, Functions } from "@icarus00x/react-native-appwrite-expo-newarch";
import storageService from "@/services/config/files";
import outfit from "../../app/(app)/(auth)/(tabs)/outfit";
import { getPresignedUrls } from "../generation/gen";
import { Outfit, OutfitWithImage, OutfitAdd } from "@/interfaces/outfitDB";
import useAttireStore from "@/store/cayegoryStore";
// Define types for actor data
interface Actor extends Models.Document {
  fileID: string;
  actorName: string;
  age: number;
  height: number;
  weight: number;
  bio: string;
  gender: string;
  genre: string;
  // Add other actor properties as needed
}

// Interface for the actor with image URL
interface ActorWithImage extends Actor {
  imageUrl: string;
}
interface generations extends Models.Document {
  outfitRefs: string[];
  generatedFileId: string;
  actorRef: string;
  state: string | "generating" | "completed" | "failed";
  has_Motion: boolean;
  videoId: string;
  cachedActorRef: string;
  cachedOutfitRef: string[];
  videoGeneration: string | "no-video" | "generating" | "completed" | "failed";
}
interface generationsWithImage extends generations {
  generationImageUrl: string;
  cachedActorImageUrl: string;
  cachedOutfitImageUrls: string[];
  videoUrl?: string;
}
class DatabaseService {
  client: Client;
  database: Databases;
  projectId: string;
  databaseId: string;
  collectionId: string; //actor collection id backlog: change name
  loading: boolean;
  outfitCollectionId: string;
  generationsCollectionId: string;

  constructor() {
    this.client = new Client();
    this.database = new Databases(this.client);
    this.projectId =
      process.env.EXPO_PUBLIC_Appwrite_Project_ID || "your-project-id";
    this.databaseId = process.env.EXPO_PUBLIC_Database_ID || "your-database-id";
    this.outfitCollectionId = "67f5d91b0011d03e42f3";
    this.collectionId =
      process.env.EXPO_PUBLIC_Appwrite_Collection_Actor_ID ||
      "your-collection-id";

    this.client
      .setEndpoint(process.env.EXPO_PUBLIC_Appwrite_Client_Endpoint || "") // Replace with your Appwrite endpoint
      .setProject(this.projectId);

    this.loading = false;
    this.generationsCollectionId =
      process.env.EXPO_PUBLIC_APPWRITE_GENERATION_COLLECTION_ID ||
      "your-collection-id";
  }

  init(): void {
    // Initialization logic if needed
  }

  async listActors(): Promise<ActorWithImage[]> {
    try {
      const response = await this.database.listDocuments<Actor>(
        this.databaseId,
        this.collectionId
      );

      const actorsWithImages = await Promise.all(
        response.documents.map(async (actor) => ({
          $id: actor.$id,
          $createdAt: actor.$createdAt,
          $updatedAt: actor.$updatedAt,
          $permissions: actor.$permissions,
          $collectionId: actor.$collectionId,
          $databaseId: actor.$databaseId,
          actorName: actor.actorName,
          imageUrl: await storageService.getfileview(actor.fileID),
          fileID: actor.fileID,
          age: actor.age,
          height: actor.height,
          weight: actor.weight,
          bio: actor.bio,
          gender: actor.gender,
          genre: actor.genre, // Include the genre field 
        }))
      );

      return actorsWithImages;
    } catch (error) {
      console.error("Error listing actors:", error);
      throw error;
    } finally {
      this.loading = false;
    }
  }

  async getActor<T extends Models.Document>(
    documentId: string
  ): Promise<ActorWithImage> {
    const functions = new Functions(this.client);

    try {
      const response = await this.database.getDocument<T>(
        this.databaseId,
        this.collectionId,
        documentId
      );
      const result: ActorWithImage = {
        $id: response.$id,
        actorName: response.actorName,
        imageUrl: storageService.getfileview(response.fileID),
        fileID: response.fileID,
        $createdAt: response.$createdAt,
        $collectionId: response.$collectionId,
        $databaseId: response.$databaseId,
        $permissions: response.$permissions,
        $updatedAt: response.$updatedAt,
        age: response.age,
        height: response.height,
        weight: response.weight,
        bio: response.bio,
        gender: response.gender,
        genre: response.genre,
      };
      return result;
    } catch (error) {
      console.error("Error getting actor:", error);
      throw error;
    }
  }

  async addActor<T>(
    actorname: string,
    file: { name: string; type: string; size: number; uri: string },
    additionalDetails?: {
      age?: number;
      height?: number;
      weight?: number;
      bio?: string;
      gender?: string;
      genre?: string;
    }
  ): Promise<Models.Document> {
    try {
      console.log("adding");
      console.log(file);
      const createdFile = await storageService.createFile(file);
      console.log(createdFile);
      const fileID = createdFile;

      // Prepare actor data with required fields
      const actorData: any = { actorName: actorname, fileID: fileID };

      // Add optional fields if provided
      if (additionalDetails) {
        if (additionalDetails.age) actorData.age = additionalDetails.age;
        if (additionalDetails.height) actorData.height = additionalDetails.height;
        if (additionalDetails.weight) actorData.weight = additionalDetails.weight;
        if (additionalDetails.bio) actorData.bio = additionalDetails.bio;
        if (additionalDetails.gender) actorData.gender = additionalDetails.gender;
        if (additionalDetails.genre) actorData.genre = additionalDetails.genre;
      }

      const response = await this.database.createDocument(
        this.databaseId,
        this.collectionId,
        "unique()",
        actorData
      );
      return response;
    } catch (error) {
      console.error("Error adding actor:", error);
      throw error;
    }
  }
  async editActor(
    documentId: string,
    actorname: string,
    fileid?: string,
    file?: { name: string; type: string; size: number; uri: string },
    additionalDetails?: {
      age?: number | string;
      height?: number | string;
      weight?: number | string;
      bio?: string;
      gender?: string;
      genre?: string;
    }
  ): Promise<void> {
    try {
      console.log("Editing actor with ID:", documentId);

      // First, get the current document to understand what fields are available
      const currentActor = await this.database.getDocument(
        this.databaseId,
        this.collectionId,
        documentId
      );

      // Start with just the name since that definitely exists
      const actorData: any = { actorName: actorname };

      // Only include additional fields if they already exist in the document
      if (additionalDetails) {
        if ('gender' in currentActor && additionalDetails.gender) {
          actorData.gender = additionalDetails.gender;
        }

        if ('genre' in currentActor && additionalDetails.genre) {
          actorData.genre = additionalDetails.genre;
        }

        // Only include these if they exist in schema
        if ('bio' in currentActor && additionalDetails.bio) {
          actorData.bio = additionalDetails.bio;
        }

        if ('age' in currentActor && additionalDetails.age) {
          actorData.age = Number(additionalDetails.age) || 0;
        }

        // Add height field if it exists in the database schema
        if ('height' in currentActor && additionalDetails.height) {
          actorData.height = Number(additionalDetails.height) || 0;
        }

        // Add weight field if it exists in the database schema
        if ('weight' in currentActor && additionalDetails.weight) {
          actorData.weight = Number(additionalDetails.weight) || 0;
        }
      }

      // Update file if needed
      if (file) {
        const updatedFile = await storageService.updateFile(fileid!, file);
        actorData.fileID = updatedFile;
      }

      console.log("Updating actor with fields:", actorData);

      // Update the document with allowed fields
      const response = await this.database.updateDocument(
        this.databaseId,
        this.collectionId,
        documentId,
        actorData
      );

      console.log("Actor updated successfully");
    } catch (error) {
      console.error("Error editing actor:", error);
      throw error;
    }
  }

  async deleteActor(documentId: string, imageID: string): Promise<void> {
    try {
      await this.database.deleteDocument(
        this.databaseId,
        this.collectionId,
        documentId
      );
      try {
        await storageService.deleteFile(imageID);
      } catch (error) { }
    } catch (error) {
      console.error("Error deleting actor:", error);
      throw error;
    }
  }

  async ListOutfits(): Promise<OutfitWithImage[]> {
    try {
      const response = await this.database.listDocuments<Outfit>(
        this.databaseId,
        this.outfitCollectionId
      );
      const outfitsWithImages = await Promise.all(
        response.documents.map(async (outfit) => ({
          $id: outfit.$id,
          $createdAt: outfit.$createdAt,
          $updatedAt: outfit.$updatedAt,
          $permissions: outfit.$permissions,
          $collectionId: outfit.$collectionId,
          $databaseId: outfit.$databaseId,
          outfitName: outfit.outfitName,
          imageUrl: await storageService.getfileview(outfit.fileID),
          fileID: outfit.fileID,
          brand: outfit.brand,
          size: outfit.size,
          attireTheme: outfit.attireTheme,
          material: outfit.material,
          garmentType: outfit.garmentType,
        }))
      );
      const rawThemes = outfitsWithImages.map((o: OutfitWithImage) => ({
        attireTheme: o.attireTheme,
      }));

      useAttireStore.getState().updateFromOutfits(rawThemes);
      return outfitsWithImages;
    } catch (error) {
      console.error("Error getting outfits:", error);
      throw error;
    }
  }
  async getOutfit<T extends Models.Document>(
    documentId: string
  ): Promise<OutfitWithImage> {
    try {
      const response = await this.database.getDocument<T>(
        this.databaseId,
        this.outfitCollectionId,
        documentId
      );
      const result: OutfitWithImage = {
        $id: response.$id,
        outfitName: response.outfitName,
        imageUrl: storageService.getfileview(response.fileID),
        fileID: response.fileID,
        $createdAt: response.$createdAt,
        $collectionId: response.$collectionId,
        $databaseId: response.$databaseId,
        $permissions: response.$permissions,
        $updatedAt: response.$updatedAt,
        brand: response.brand,
        size: response.size,
        attireTheme: response.attireTheme,
        material: response.material,
        garmentType: response.garmentType,
      };

      return result;
    } catch (error) {
      console.error("Error getting outfit:", error);
      throw error;
    }
  }

  async addOutfit<T>(data: OutfitAdd): Promise<Models.Document> {
    try {
      const createdFile = await storageService.createFile(data.file);
      data.fileID = createdFile;
      const response = await this.database.createDocument(
        this.databaseId,
        this.outfitCollectionId,
        "unique()",
        {
          outfitName: data.outfitName,
          fileID: data.fileID,
          brand: data.brand,
          size: data.size,
          attireTheme: data.attireTheme,
          material: data.material,
          garmentType: data.garmentType,
        }
      );
      return response;
    } catch (error) {
      console.error("Error adding outfit:", error);
      throw error;
    }
  }
  async editOutfit(documentId: string, data: OutfitAdd): Promise<void> {
    try {
      if (data.file) {
        const updatedFile = await storageService.updateFile(
          data.fileID!,
          data.file
        );
        const response = await this.database.updateDocument(
          this.databaseId,
          this.outfitCollectionId,
          documentId,
          {
            outfitName: data.outfitName,
            fileID: updatedFile,
            brand: data.brand,
            size: data.size,
            attireTheme: data.attireTheme,
            material: data.material,
            garmentType: data.garmentType,
          }
        );
      } else {
        const response = await this.database.updateDocument(
          this.databaseId,
          this.outfitCollectionId,
          documentId,
          {
            outfitName: data.outfitName,
            brand: data.brand,
            size: data.size,
            attireTheme: data.attireTheme,
            material: data.material,
            garmentType: data.garmentType,
          }
        );
      }
    } catch (error) {
      console.error("Error editing outfit:", error);
      throw error;
    }
  }
  async deleteOutfit(documentId: string, imageID: string): Promise<void> {
    try {
      await this.database.deleteDocument(
        this.databaseId,
        this.outfitCollectionId,
        documentId
      );
      try {
        await storageService.deleteFile(imageID);
      } catch (error) { }
    } catch (error) {
      console.error("Error deleting outfit:", error);
      throw error;
    }
  }

  async listGenerations(): Promise<generationsWithImage[]> {
    try {
      const response = await this.database.listDocuments<generations>(
        this.databaseId,
        this.generationsCollectionId
      );
      console.log("fetching");
      console.log(response);
      const generationsWithImages = await Promise.all(
        response.documents.map(async (generation) => ({
          $id: generation.$id,
          $createdAt: generation.$createdAt,
          $updatedAt: generation.$updatedAt,
          $permissions: generation.$permissions,
          $collectionId: generation.$collectionId,
          $databaseId: generation.$databaseId,
          outfitRefs: generation.outfitRefs,
          generatedFileId: generation.generatedFileID,
          actorRef: generation.actorRef,
          state: generation.state,
          has_Motion: generation.has_Motion,
          videoId: generation.videoId,
          cachedActorRef: generation.cachedActorRef,
          cachedOutfitRef: generation.cachedOutfitRefs,
          videoGeneration: generation.videoGeneration,
          generationImageUrl:
            generation.state === "completed"
              ? await storageService.getfileview(generation.generatedFileID)
              : "",
          cachedActorImageUrl: "",
          cachedOutfitImageUrls: [],
        }))
      );
      console.log(generationsWithImages);
      return generationsWithImages;
    } catch (error) {
      console.error("Error getting generations:", error);
      throw error;
    }
  }
  async deleteGeneration(documentId: string, imageID: string): Promise<void> {
    try {
      await this.database.deleteDocument(
        this.databaseId,
        this.generationsCollectionId,
        documentId
      );
      try {
        await storageService.deleteFile(imageID);
      } catch (error) { }
    } catch (error) {
      console.error("Error deleting generation:", error);
      throw error;
    }
  }

  async getGeneration(documentId: string): Promise<generationsWithImage> {
    try {
      const generation = await this.database.getDocument<generations>(
        this.databaseId,
        this.generationsCollectionId,
        documentId!
      );
      console.log(generation);
      if (generation.has_Motion) {
        const videoUrl = await storageService.getfileview(generation.videoId);
        console.log(videoUrl);
        return {
          ...generation,
          generationImageUrl: await storageService.getfileview(
            generation.generatedFileID
          ),
          cachedActorImageUrl: "",
          cachedOutfitImageUrls: [],
          videoUrl: videoUrl,
        };
      } else {
        const reuslt: generationsWithImage = {
          ...generation,
          generationImageUrl:
            generation.state === "completed"
              ? await storageService.getfileview(generation.generatedFileID)
              : "",
          cachedActorImageUrl: "",
          cachedOutfitImageUrls: [],
        };

        return reuslt;
      }
    } catch (error) {
      console.error("Error getting generation:", error);
      throw error;
    }
  }
}

const databaseService = new DatabaseService();

export default databaseService;
export type {
  Actor,
  ActorWithImage,
  Outfit,
  OutfitWithImage,
  generations,
  generationsWithImage,
};