import { Client, Storage, Models, ID } from "react-native-appwrite";
import { account } from "@/services/config/appwrite";

class StorageService {
  private client: Client;
  private storage: Storage;
  private projectId: string;
  private bucketId: string;

  constructor() {
    this.client = new Client();
    this.storage = new Storage(this.client);
    this.projectId =
      process.env.EXPO_PUBLIC_Appwrite_Project_ID || "your-project-id";
    this.bucketId =
      process.env.EXPO_PUBLIC_Appwrite_Bucket_ID || "your-bucket-id";

    this.client
      .setEndpoint(process.env.EXPO_PUBLIC_Appwrite_Client_Endpoint || "") // Replace with your Appwrite endpoint
      .setProject(this.projectId);
  }

  init(): void {
    console.log("StorageService initialized with projectId:", this.projectId);
    console.log("StorageService initialized with bucketId:", this.bucketId);
    console.log(
      "StorageService initialized with endpoint:",
      process.env.EXPO_PUBLIC_Appwrite_Client_Endpoint
    );
  }

  getfileview(fileId: string): string {
    return this.storage.getFileView(this.bucketId, fileId).toString();
  }

  listFiles(): Promise<Models.FileList> {
    return this.storage.listFiles(this.bucketId);
  }
  async createFile(file: File): Promise<string> {
    const fileWithUri = {
      name: file.name,
      type: file.type,
      size: file.size,
      uri: (file as any).uri || "", // Ensure `uri` is provided
    };
    const result = await this.storage.createFile(
      this.bucketId,
      ID.unique(),
      fileWithUri
    );
    return result.$id;
  }

  /* createFile(file: File): Promise<Models.File> {
        return this.storage.createFile(this.bucketId, file);
    }

    deleteFile(fileId: string): Promise<void> {
        return this.storage.deleteFile(this.bucketId, fileId);
    }*/
}

const storageService = new StorageService();

export default storageService;
