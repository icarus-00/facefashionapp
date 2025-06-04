import { Databases, Functions, Permission, Role, ID } from "@icarus00x/react-native-appwrite-expo-newarch";
import {account , client} from "@/services/config/appwrite";
import { Query } from "react-native-appwrite";
import storageService from "./files";
const encoreOPting = process.env.EXPO_PUBLIC_ENCORE_API_ENDPOINT + "/optin"
export default async function OPTIN()
{
    const userId = await account.get()
    const functions = new Functions(client);
    const promise =await fetch(encoreOPting, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            userId: userId.$id,
        }),
    });
    return promise
}

async function grabUserStatus()
{
    const userId = await account.get()
    const database = new Databases(client);
    const user_meta = await database.listDocuments("67e8539c000662f5f358", "683dc86d0029087d2d9d" , [Query.equal("userId",userId.$id)]);
    return user_meta;
}
async function updateUserStatus(optin: boolean)
{
    const userId = await account.get()
    const database = new Databases(client);
    const user_meta = await database.listDocuments("67e8539c000662f5f358", "683dc86d0029087d2d9d" , [Query.equal("userId",userId.$id)]);
    const updatedDocument =database.updateDocument(
        "67e8539c000662f5f358",
        "683dc86d0029087d2d9d",
        user_meta.documents[0].$id,
        {
            opt_in: optin,
            "finished-sign-in": "done",
        }
    );
    return user_meta;
}
async function ensureUserMeta() {
    const userId = await account.get();
    const database = new Databases(client);
    const user_meta = await database.listDocuments(
        "67e8539c000662f5f358",
        "683dc86d0029087d2d9d",
        [Query.equal("userId", userId.$id)]
    );
    if (!user_meta.documents || user_meta.documents.length === 0) {
        // Create user meta with permissions
        await database.createDocument(
            "67e8539c000662f5f358",
            "683dc86d0029087d2d9d",
            ID.unique(),
            {
                userId: userId.$id,
                opt_in: false,
                "finished-sign-in": "not-yet",
            },
            [
                Permission.read(Role.user(userId.$id)),
                Permission.write(Role.user(userId.$id)),
                Permission.delete(Role.user(userId.$id)),
            ]
        );
        // Fetch again after creation
        return await database.listDocuments(
            "67e8539c000662f5f358",
            "683dc86d0029087d2d9d",
            [Query.equal("userId", userId.$id)]
        );
    }
    return user_meta;
}
async function createAvatar(file: { name: string; type: string; size: number; uri: string }){
    const createdFile = await storageService.createFile(file);
    const fileId = createdFile;
    const userId = await account.get()
    const database = new Databases(client);
    const user_meta = await database.listDocuments("67e8539c000662f5f358", "683dc86d0029087d2d9d" , [Query.equal("userId",userId.$id)]);
    const updatedDocument =database.updateDocument(
        "67e8539c000662f5f358",
        "683dc86d0029087d2d9d",
        user_meta.documents[0].$id,
        {
            avatar_file_id: fileId,
        }
    );
    return user_meta;
}

export { grabUserStatus, updateUserStatus, ensureUserMeta , createAvatar }