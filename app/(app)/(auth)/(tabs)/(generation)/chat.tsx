import { useState } from "react"
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    Pressable,
    Image,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
    Modal,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"
import SafeAreaView from "@/components/atoms/safeview/safeview"
import { useRouter } from "expo-router"
import useStore from "@/store/lumaGeneration/useStore"
import { generateImage, generateVideo } from "@/services/generation/gen"
import { VideoGenInput } from "@/interfaces/generationApi"

const generateVideoAwaitable = (videoApi: VideoGenInput) => {
    return new Promise((resolve, reject) => {
        try {
            const data = require('@/services/generation/gen').generateVideoApi(videoApi.documentId, videoApi.videoprompt);
            fetch(require('@/services/generation/gen').videoGenEndpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            })
                .then((res) => res.json())
                .then((data) => {
                    console.log(data);
                    resolve(data);
                })
                .catch((err) => {
                    console.log(err);
                    reject(err);
                });
        } catch (err) {
            reject(err);
        }
    });
};

export default function ChatScreen() {
    const [prompt, setPrompt] = useState("")
    const [isGenerating, setIsGenerating] = useState(false)
    const router = useRouter()
    const { outfitItems, actorItems, getLength, clearOutfitItems, removeActorItems, videoGenInput, clearVideoGenInput } = useStore()

    const totalItems = getLength()
    const hasActor = actorItems?.imageUrl && actorItems?.actorName
    const hasOutfits = outfitItems && outfitItems.length > 0
    const hasVideoGenInput = !!videoGenInput

    // Helper: get preview image for videoGenInput (if available)
    const getVideoInputPreview = () => {
        // Try to use a preview image if your app provides one, otherwise fallback to a placeholder
        // If you store a preview image URL in videoGenInput, use it here. Otherwise, just show an icon.
        return null // No image field in VideoGenInput
    }

    const handleGenerate = async () => {
        if (hasVideoGenInput) {
            if (prompt.trim() === "") {
                alert("Please enter a prompt")
                return
            }
            try {
                setIsGenerating(true)
                // Await the POST request to finish (not just the function call)
                await generateVideoAwaitable({ ...videoGenInput, videoprompt: prompt.trim() })
                clearVideoGenInput()
                router.push("/(app)/(auth)/(tabs)/(generation)/generations")
            } catch (error) {
                console.error("Video generation failed:", error)
                alert("Failed to generate video. Please try again.")
            } finally {
                setIsGenerating(false)
            }
            return
        }
        // Image generation flow
        if (!hasActor || !hasOutfits) {
            alert("Please select both an actor and at least one outfit item")
            return
        }
        if (prompt.trim() === "") {
            alert("Please enter a prompt")
            return
        }
        try {
            setIsGenerating(true)
            generateImage({
                actorRef: actorItems.imageID,
                outfitRefs: outfitItems.map((item) => item.imageID),
                prompt: prompt.trim(),
            })
            clearOutfitItems()
            removeActorItems()
            router.push("/(app)/(auth)/(tabs)/(generation)/generations")
        } catch (error) {
            console.error("Generation failed:", error)
            alert("Failed to generate image. Please try again.")
        } finally {
            setIsGenerating(false)
        }
    }

    return (
        <View style={styles.container}>
            {/* Loading Modal for Video Gen */}
            <Modal
                visible={isGenerating && hasVideoGenInput}
                transparent
                animationType="fade"
                onRequestClose={() => { }}
            >
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.25)' }}>
                    <View style={{ backgroundColor: '#fff', borderRadius: 16, padding: 32, alignItems: 'center', elevation: 4, minWidth: 220 }}>
                        <ActivityIndicator size="large" color="#000" />
                        <Text style={{ marginTop: 16, fontSize: 16, fontWeight: '600', color: '#333', textAlign: 'center' }}>Sending video generation request...</Text>
                    </View>
                </View>
            </Modal>

            {/* Background gradient circles */}
            <LinearGradient
                colors={["rgba(255, 165, 0, 0.1)", "rgba(255, 165, 0, 0)"]}
                style={[styles.gradientCircle, { top: "10%", left: "5%", width: 200, height: 200 }]}
                start={{ x: 0.1, y: 0.1 }}
                end={{ x: 0.9, y: 0.9 }}
            />
            <LinearGradient
                colors={["rgba(0, 0, 0, 0.05)", "rgba(0, 0, 0, 0)"]}
                style={[styles.gradientCircle, { top: "30%", right: "5%", width: 150, height: 150 }]}
                start={{ x: 0.1, y: 0.1 }}
                end={{ x: 0.9, y: 0.9 }}
            />
            <LinearGradient
                colors={["rgba(128, 128, 128, 0.1)", "rgba(128, 128, 128, 0)"]}
                style={[styles.gradientCircle, { bottom: "20%", left: "20%", width: 180, height: 180 }]}
                start={{ x: 0.1, y: 0.1 }}
                end={{ x: 0.9, y: 0.9 }}
            />

            <View style={styles.header}>
 <View style={{ flexDirection: 'row', alignItems: 'center' }}>
 <Text style={styles.headerTitle}>Selected Items</Text>
 <Pressable onPress={() => router.push('/(app)/(auth)/help/helpPage')} style={{ marginLeft: 8 }}>
 <Ionicons name="help-circle-outline" size={24} color="#000" />
 </Pressable>
 </View>
 <Text style={styles.headerSubtitle}>
 {hasVideoGenInput ? "Video input selected" : `${totalItems} items selected`}
 </Text>
            </View>
            <ScrollView bounces={false} style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
                {/* VideoGenInput Section */}
                {hasVideoGenInput && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Video Input</Text>
                        <View style={[styles.actorContainer, { alignItems: 'center', justifyContent: 'center' }]}>
                            {/* Show the selected generation image to the left of the ID */}
                            <Image
                                source={{ uri: videoGenInput && (videoGenInput as any).generationImageUrl ? (videoGenInput as any).generationImageUrl : "/placeholder.svg?height=100&width=100" }}
                                style={[styles.actorImage, { margin: 16 }]}
                                resizeMode="cover"
                            />
                            <View style={styles.actorInfo}>
                                <Text style={styles.actorName}>Video Generation Input</Text>
                                <Text style={styles.actorDescription} numberOfLines={2}>
                                    Video will be generated from the selected document.
                                </Text>
                                <Text style={styles.actorDescription} numberOfLines={2}>
                                    Document ID: {videoGenInput.documentId}
                                </Text>
                            </View>
                        </View>
                    </View>
                )}
                {/* Actor/Outfit Section */}
                {!hasVideoGenInput && hasActor && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Actor</Text>
                        <View style={styles.actorContainer}>
                            <Image
                                source={{ uri: actorItems.imageUrl || "/placeholder.svg?height=200&width=200" }}
                                style={styles.actorImage}
                                resizeMode="cover"
                            />
                            <View style={styles.actorInfo}>
                                <Text style={styles.actorName}>{actorItems.actorName || "Selected Actor"}</Text>
                                {actorItems.bio && (
                                    <Text style={styles.actorDescription} numberOfLines={2}>
                                        {actorItems.bio}
                                    </Text>
                                )}
                            </View>
                        </View>
                    </View>
                )}
                {/* Outfit Items Section */}
                {!hasVideoGenInput && hasOutfits && (
                    <View style={styles.section}>
                        <View style={styles.outfitGrid}>
                            {outfitItems.map((item, index) => (
                                <View key={item.imageID || index} style={styles.outfitItem}>
                                    <Image
                                        source={{ uri: item.imageUrl || "/placeholder.svg?height=100&width=100" }}
                                        style={styles.outfitImage}
                                        resizeMode="cover"
                                    />
                                    <Text style={styles.outfitName} numberOfLines={1}>
                                        {item.outfitName || `Item ${index + 1}`}
                                    </Text>
                                </View>
                            ))}
                        </View>
                    </View>
                )}
                {/* Empty State */}
                {!hasVideoGenInput && !hasActor && !hasOutfits && (
                    <View style={styles.emptyState}>
                        <Ionicons name="shirt-outline" size={64} color="#ccc" />
                        <Text style={styles.emptyStateText}>No items selected</Text>
                        <Text style={styles.emptyStateSubtext}>Select an actor and outfit items or a video input to generate</Text>
                    </View>
                )}
            </ScrollView>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "padding"}
                keyboardVerticalOffset={100}
                style={styles.inputContainer}
            >
                <TextInput
                    style={styles.input}
                    placeholder="Enter your prompt here..."
                    value={prompt}
                    onChangeText={setPrompt}
                    multiline
                    editable={!isGenerating}
                />
                <Pressable
                    style={[styles.generateButton, isGenerating && styles.generatingButton]}
                    onPress={handleGenerate}
                    disabled={isGenerating || (!hasVideoGenInput && (!hasActor || !hasOutfits)) || prompt.trim() === ""}
                >
                    {isGenerating ? (
                        <Text style={styles.buttonText}>Generating...</Text>
                    ) : (
                        <>
                            <Ionicons name="sparkles-outline" size={20} color="#fff" style={styles.buttonIcon} />
                            <Text style={styles.buttonText}>Generate</Text>
                        </>
                    )}
                </Pressable>
            </KeyboardAvoidingView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        marginBottom: 50

    },
    gradientCircle: {
        position: "absolute",
        borderRadius: 100,
        opacity: 0.7,
    },
    header: {
        paddingHorizontal: 16,
        paddingVertical: 0,
        borderBottomWidth: 1,
        borderBottomColor: "#eaeaea",
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#000",
    },
    headerSubtitle: {
        fontSize: 14,
        color: "#666",
        marginTop: 4,
    },
    scrollView: {
        flex: 1,

    },
    scrollContent: {
        padding: 16,

    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "600",
        marginBottom: 12,
        color: "#000",
    },
    actorContainer: {
        flexDirection: "row",
        backgroundColor: "#f5f5f5",
        borderRadius: 12,
        overflow: "hidden",
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    actorImage: {
        width: 100,
        height: 100,
    },
    actorInfo: {
        flex: 1,
        padding: 12,
        justifyContent: "center",
    },
    actorName: {
        fontSize: 16,
        fontWeight: "600",
        marginBottom: 4,
    },
    actorDescription: {
        fontSize: 14,
        color: "#666",
    },
    outfitGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        marginHorizontal: -8,
    },
    outfitItem: {
        width: "33.33%",
        padding: 8,
    },
    outfitImage: {
        width: "100%",
        aspectRatio: 1,
        borderRadius: 8,
        backgroundColor: "#f0f0f0",
    },
    outfitName: {
        fontSize: 12,
        textAlign: "center",
        marginTop: 4,
        color: "#333",
    },
    emptyState: {
        alignItems: "center",
        justifyContent: "center",
        padding: 32,
        marginTop: 40,
    },
    emptyStateText: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#666",
        marginTop: 16,
    },
    emptyStateSubtext: {
        fontSize: 14,
        color: "#999",
        textAlign: "center",
        marginTop: 8,
    },
    inputContainer: {

        backgroundColor: "#fff",
        borderTopWidth: 1,
        borderTopColor: "#eaeaea",
        padding: 16,
        marginBottom: 50
    },
    input: {
        backgroundColor: "#f5f5f5",
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 16,
        marginBottom: 12,
        minHeight: 100,
        textAlignVertical: "top",
    },
    generateButton: {
        backgroundColor: "#000",
        borderRadius: 12,
        paddingVertical: 14,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
    },
    generatingButton: {
        backgroundColor: "#666",
    },
    buttonIcon: {
        marginRight: 8,
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },
})
