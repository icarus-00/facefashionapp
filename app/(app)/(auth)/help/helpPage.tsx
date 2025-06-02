import SafeAreaView from "@/components/atoms/safeview/safeview"
import { Pressable, Text, View } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { helpPagesContent } from "@/constants/helpPages"
import { Colors } from "@/constants/Colors"
import { useRouter } from "expo-router"
import { ReactElement, JSXElementConstructor, ReactNode, ReactPortal, Key } from "react"
import { FlatList } from "react-native-gesture-handler"

export default function HelpPage() {
    const router = useRouter()
    return (
        <SafeAreaView>

            <FlatList
                data={Object.values(helpPagesContent)}
                renderItem={({ item, index }) => (
                    <Pressable
                        onPress={() => router.push({ pathname: `/(app)/(auth)/help/(pages)/help${index + 1}` as any })}
                        style={{ width: "100%", flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 15, paddingHorizontal: 20, borderBottomWidth: 1, borderColor: Colors.light.background }}
                    >
                        <Text style={{ color: Colors.light.primary[500] }}>{item.header}</Text>
                        <Ionicons
                            name="arrow-forward"
                            size={24}
                            color={Colors.light.primary[500]}
                        />
                    </Pressable>
                )}
            />
        </SafeAreaView>
    )
}