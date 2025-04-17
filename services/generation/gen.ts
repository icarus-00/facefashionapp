import {
  generateImageApi,
  generateVideoApi,
  ImageGenInput,
  VideoGenInput,
} from "@/interfaces/generationApi";
import { useUser } from "@/context/authcontext";
import { useEffect, useState } from "react";
import data from "../../components/pages/onboarding/constants";

const imageGenEndpoint =
  process.env.EXPO_PUBLIC_ENCORE_API_ENDPOINT + "/generations";

const imageCachedInput =
  process.env.EXPO_PUBLIC_ENCORE_API_ENDPOINT + "/getPresignedUrls";
const videoGenEndpoint =
  process.env.EXPO_PUBLIC_ENCORE_API_ENDPOINT + "/videogen";

function generateImage(imageApi: ImageGenInput) {
  const data = generateImageApi(
    imageApi.actorRef,
    imageApi.outfitRefs,
    imageApi.prompt
  );
  fetch(imageGenEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
    })
    .catch((err) => {
      console.log(err);
    });
}

function generateVideo(videoApi: VideoGenInput) {
  const data = generateVideoApi(videoApi.documentId, videoApi.videoprompt);
  fetch(videoGenEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
    })
    .catch((err) => {
      console.log(err);
    });
}
/*{
    // Query string
    "actorCachedKey": "",
    "outfitCachedKey": [""]
}*/
interface ImagePresignedUrl {
  actorCachedKey: string;
  outfitCachedKey: string[];
}

async function getPresignedUrls(
  imagePresignedUrl: ImagePresignedUrl
): Promise<{ actorUrl: string; outfitUrls: string[] }> {
  console.log(imagePresignedUrl);

  const params = new URLSearchParams({
    actorCachedKey: imagePresignedUrl.actorCachedKey,
    ...imagePresignedUrl.outfitCachedKey.reduce(
      (acc, key, index) => ({ ...acc, [`outfitCachedKey[${index}]`]: key }),
      {}
    ),
  });
  console.log("params", params.toString());

  const response = await fetch(imageCachedInput + "?" + params.toString(), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = (await response.json()) as {
    actorUrl: string;
    outfitUrls: string[];
  };
  return data;
}
export { generateImage, generateVideo, getPresignedUrls };
