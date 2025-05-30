import { Models } from "@icarus00x/react-native-appwrite-expo-newarch";
import { generationsWithImage } from "@/services/database/db";

export const generationsConstants: generationsWithImage[] = [
    {
        $id: "gen_12345",
        $createdAt: "2023-10-27T10:00:00.000+00:00",
        $updatedAt: "2023-10-27T10:05:00.000+00:00",
        $permissions: [],
        $collectionId: "generation_collection",
        $databaseId: "my_database",
        outfitRefs: ["outfit_abc1", "outfit_def2"],
        generatedFileId: "gen_file_1",
        actorRef: "actor_xyz9",
        state: "generating",
        has_Motion: false,
        videoId: "",
        cachedActorRef: "actor_xyz9",
        cachedOutfitRef: ["outfit_abc1", "outfit_def2"],
        videoGeneration: "no-video",
        generationImageUrl: "",
        cachedActorImageUrl: "https://placehold.co/540x960/33FF57/FFFFFF?text=Actor+A",
        cachedOutfitImageUrls: [
            "https://placehold.co/540x960/3357FF/FFFFFF?text=Outfit+1A",
            "https://placehold.co/540x960/FFFF33/000000?text=Outfit+1B",
        ],
        videoUrl: undefined,
    },
    {
        $id: "gen_67890",
        $createdAt: "2023-10-27T10:10:00.000+00:00",
        $updatedAt: "2023-10-27T10:15:00.000+00:00",
        $permissions: [],
        $collectionId: "generation_collection",
        $databaseId: "my_database",
        outfitRefs: ["outfit_ghi3"],
        generatedFileId: "gen_file_2",
        actorRef: "actor_uvw8",
        state: "completed",
        has_Motion: true,
        videoId: "video_123",
        cachedActorRef: "actor_uvw8",
        cachedOutfitRef: ["outfit_ghi3"],
        videoGeneration: "completed",
        generationImageUrl: "https://images.unsplash.com/photo-1580518337843-f959e992563b?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        cachedActorImageUrl: "https://placehold.co/540x960/FF33FF/FFFFFF?text=Actor+B",
        cachedOutfitImageUrls: [
            "https://placehold.co/540x960/33FFFF/000000?text=Outfit+2A",
        ],
        videoUrl: "https://videos.pexels.com/video-files/2795405/2795405-uhd_1440_2560_25fps.mp4",
    },
    {
        $id: "gen_abcde",
        $createdAt: "2023-10-27T10:20:00.000+00:00",
        $updatedAt: "2023-10-27T10:25:00.000+00:00",
        $permissions: [],
        $collectionId: "generation_collection",
        $databaseId: "my_database",
        outfitRefs: ["outfit_jkl4", "outfit_mno5"],
        generatedFileId: "gen_file_3",
        actorRef: "actor_pqr7",
        state: "failed",
        has_Motion: false,
        videoId: "",
        cachedActorRef: "actor_pqr7",
        cachedOutfitRef: ["outfit_jkl4", "outfit_mno5"],
        videoGeneration: "no-video",
        generationImageUrl: "https://placehold.co/540x960/FF33FF/FFFFFF?text=Generation+3",
        cachedActorImageUrl: "https://placehold.co/540x960/FFFF33/000000?text=Actor+C",
        cachedOutfitImageUrls: [
            "https://placehold.co/540x960/FF5733/FFFFFF?text=Outfit+3A",
            "https://placehold.co/540x960/33FF57/FFFFFF?text=Outfit+3B",
        ],
        videoUrl: undefined,
    },
    {
        $id: "gen_fghij",
        $createdAt: "2023-10-27T10:30:00.000+00:00",
        $updatedAt: "2023-10-27T10:35:00.000+00:00",
        $permissions: [],
        $collectionId: "generation_collection",
        $databaseId: "my_database",
        outfitRefs: ["outfit_stu6"],
        generatedFileId: "gen_file_4",
        actorRef: "actor_vwx6",
        state: "completed",
        has_Motion: true,
        videoId: "video_456",
        cachedActorRef: "actor_vwx6",
        cachedOutfitRef: ["outfit_stu6"],
        videoGeneration: "failed",
        generationImageUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        cachedActorImageUrl: "https://placehold.co/540x960/FF5733/FFFFFF?text=Actor+D",
        cachedOutfitImageUrls: [
            "https://placehold.co/540x960/33FF57/FFFFFF?text=Outfit+4A",
        ],
        videoUrl: "https://file-examples-com.github.io/uploads/2017/04/file_example_MP4_480_1_5MG.mp4",
    },
    {
        $id: "gen_klmno",
        $createdAt: "2023-10-27T10:40:00.000+00:00",
        $updatedAt: "2023-10-27T10:45:00.000+00:00",
        $permissions: [],
        $collectionId: "generation_collection",
        $databaseId: "my_database",
        outfitRefs: ["outfit_yz07", "outfit_1238", "outfit_4569"],
        generatedFileId: "gen_file_5",
        actorRef: "actor_zab5",
        state: "completed",
        has_Motion: false,
        videoId: "",
        cachedActorRef: "actor_zab5",
        cachedOutfitRef: ["outfit_yz07", "outfit_1238", "outfit_4569"],
        videoGeneration: "no-video",
        generationImageUrl: "https://placehold.co/540x960/FFFF33/000000?text=Generation+5",
        cachedActorImageUrl: "https://placehold.co/540x960/3357FF/FFFFFF?text=Actor+E",
        cachedOutfitImageUrls: [
            "https://placehold.co/540x960/FF33FF/FFFFFF?text=Outfit+5A",
            "https://placehold.co/540x960/33FFFF/000000?text=Outfit+5B",
            "https://placehold.co/540x960/FF5733/FFFFFF?text=Outfit+5C",
        ],
        videoUrl: undefined,
    },
];