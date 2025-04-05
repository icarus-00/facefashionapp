import { Databases ,Client } from "react-native-appwrite";
class DatabaseService {
    private client: Client;
    private database: Databases;
    private projectId: string = process.env.EXPO_PUBLIC_Appwrite_Project_ID || "your-project-id"; 
    private databaseId: string = process.env.EXPO_PUBLIC_Database_ID || "your-database-id";
    private collectionId: string = process.env.EXPO_PUBLIC_Appwrite_Collection_Actor_ID || "your-collection-id";

    constructor() {
        this.client = new Client();
        this.database = new Databases(this.client);

        this.client
            .setEndpoint(process.env.EXPO_PUBLIC_Appwrite_Client_Endpoint ||"") // Replace with your Appwrite endpoint
            .setProject(this.projectId);

        
    }
    public init() {
        console.log("DatabaseService initialized with projectId:", this.projectId);
        console.log("DatabaseService initialized with databaseId:", this.databaseId);
        console.log("DatabaseService initialized with collectionId:", this.collectionId);
        console.log("DatabaseService initialized with endpoint:", process.env.EXPO_PUBLIC_Appwrite_Client_Endpoint);
    }

    public async listActors(collectionId: string): Promise<any> {
        try {
            const response = await this.database.listDocuments(this.databaseId, collectionId);
            return response.documents;
        } catch (error) {
            console.error("Error listing actors:", error);
            throw error;
        }
    }

    public async getActor(collectionId: string, documentId: string): Promise<any> {
        try {
            const response = await this.database.getDocument(this.databaseId, collectionId, documentId);
            return response;
        } catch (error) {
            console.error("Error getting actor:", error);
            throw error;
        }
    }

    public async addActor(collectionId: string, data: any): Promise<any> {
        try {
            const response = await this.database.createDocument(this.databaseId, collectionId, "unique()", data);
            return response;
        } catch (error) {
            console.error("Error adding actor:", error);
            throw error;
        }
    }

    public async deleteActor(collectionId: string, documentId: string): Promise<void> {
        try {
            await this.database.deleteDocument(this.databaseId, collectionId, documentId);
        } catch (error) {
            console.error("Error deleting actor:", error);
            throw error;
        }
    }
}

const databaseService = new DatabaseService();

export default databaseService;
