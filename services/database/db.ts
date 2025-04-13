import { Databases, Client, Models, Functions } from "react-native-appwrite";
import storageService from "@/services/config/files";

// Define types for actor data
interface Actor extends Models.Document {
  fileID: string;
  actorName: string;
  // Add other actor properties as needed
}
interface Outfit extends Models.Document {
  fileID: string;
  outfitName: string;
  // Add other outfit properties as needed
}
interface OutfitWithImage extends Outfit {
  imageUrl: string;
}
// Interface for the actor with image URL
interface ActorWithImage extends Actor {
  imageUrl: string;
}

class DatabaseService {
  client: Client;
  database: Databases;
  projectId: string;
  databaseId: string;
  collectionId: string; //actor collection id backlog: change name
  loading: boolean;
  outfitCollectionId: string;

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
        }))
      );
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
      };
      return result;
    } catch (error) {
      console.error("Error getting outfit:", error);
      throw error;
    }
  }

  async addOutfit<T>(
    outfitname: string,
    file: { name: string; type: string; size: number; uri: string }
  ): Promise<Models.Document> {
    try {
      const createdFile = await storageService.createFile(file);
      const fileID = createdFile;
      const response = await this.database.createDocument(
        this.databaseId,
        this.outfitCollectionId,
        "unique()",
        { outfitName: outfitname, fileID: fileID }
      );
      return response;
    } catch (error) {
      console.error("Error adding outfit:", error);
      throw error;
    }
  }
  async editOutfit(
    documentId: string,
    outfitname: string,
    fileid?: string,
    file?: { name: string; type: string; size: number; uri: string }
  ): Promise<void> {
    try {
      if (file) {
        const updatedFile = await storageService.updateFile(fileid!, file);
        const response = await this.database.updateDocument(
          this.databaseId,
          this.outfitCollectionId,
          documentId,
          { outfitName: outfitname, fileID: updatedFile }
        );
      } else {
        const response = await this.database.updateDocument(
          this.databaseId,
          this.outfitCollectionId,
          documentId,
          { outfitName: outfitname }
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
}

const databaseService = new DatabaseService();

export default databaseService;
export type { Actor, ActorWithImage, Outfit, OutfitWithImage };
