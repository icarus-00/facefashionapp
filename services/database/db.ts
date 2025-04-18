import { Databases, Client, Models, Functions } from "react-native-appwrite";
import storageService from "@/services/config/files";
import outfit from "../../app/(auth)/(tabs)/outfit";
import { getPresignedUrls } from "../generation/gen";
import { Outfit, OutfitWithImage, OutfitAdd } from "@/interfaces/outfitDB";
import useAttireStore from "@/store/cayegoryStore";
// Define types for actor data
interface Actor extends Models.Document {
  fileID: string;
  actorName: string;
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
      };
      return result;
    } catch (error) {
      console.error("Error getting actor:", error);
      throw error;
    }
  }

  async addActor<T>(
    actorname: string,
    file: { name: string; type: string; size: number; uri: string }
  ): Promise<Models.Document> {
    try {
      console.log("adding");
      console.log(file);
      const createdFile = await storageService.createFile(file);
      console.log(createdFile);
      const fileID = createdFile;
      const response = await this.database.createDocument(
        this.databaseId,
        this.collectionId,
        "unique()",
        { actorName: actorname, fileID: fileID }
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
    file?: { name: string; type: string; size: number; uri: string }
  ): Promise<void> {
    try {
      if (file) {
        const updatedFile = await storageService.updateFile(fileid!, file);
        const response = await this.database.updateDocument(
          this.databaseId,
          this.collectionId,
          documentId,
          { actorName: actorname, fileID: updatedFile }
        );
      } else {
        const response = await this.database.updateDocument(
          this.databaseId,
          this.collectionId,
          documentId,
          { actorName: actorname }
        );
      }
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
      } catch (error) {}
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
      } catch (error) {}
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
