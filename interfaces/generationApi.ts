import { useUser } from "@/context/authcontext";

import { account } from "@/services/config/appwrite";

/*image jso body
{
    // HTTP body
    "userId": "",
    "actorRef": "",
    "outfitRefs": [""],
    "type": "image",
    "prompt": ""
}
*/

/*video body
{
    // HTTP body
    "userId": "",
    "documentId": "",
    "type": "video",
    "videoprompt": ""
}
    */
interface ImageApi {
  userId: string;
  actorRef: string;
  outfitRefs: string[];
  type: string | "image";
  prompt: string;
}
interface VideoApi {
  userId: string;
  documentId: string;
  type: string | "video";
  videoprompt: string;
}
interface ImageGenInput {
  actorRef: string;
  outfitRefs: string[];
  prompt: string;
}
interface VideoGenInput {
  documentId: string;
  videoprompt: string;
}

async function generateVideoApi(
  documentId: string,
  videoprompt: string
): Promise<VideoApi> {
  return {
    userId: await account.get().then((res) => res.$id),
    documentId: documentId,
    type: "video",
    videoprompt: videoprompt,
  };
}
async function generateImageApi(
  actorRef: string,
  outfitRefs: string[],
  prompt: string
): Promise<ImageApi> {
  return {
    userId: await account.get().then((res) => res.$id),
    actorRef: actorRef,
    outfitRefs: outfitRefs,
    type: "image",
    prompt: prompt,
  };
}
export { generateVideoApi, generateImageApi, ImageGenInput, VideoGenInput };
