import { Databases, Functions } from "@icarus00x/react-native-appwrite-expo-newarch";
import {account , client} from "@/services/config/appwrite";
import { Query } from "react-native-appwrite";

export default async function OPTIN()
{
    const userId = await account.get()
    const functions = new Functions(client);
    const promise = functions.createExecution("683e898f002f55f0d110", JSON.stringify({ userId: userId.$id }));
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

export {grabUserStatus , updateUserStatus}