import { Image } from "expo-image";
import { Text } from "@/components/ui/text";
import { View } from "react-native";

export default function HeaderWithBgImage() {
  return (
    <View className="flex-1 bg-white">
      <Image
        source={require("@/assets/images/background.png")}
        style={{ width: "100%", height: 200 }}
        contentFit="cover"
      />
      <Text className="text-center text-lg font-bold mt-4">
        Header with Background Image
      </Text>
    </View>
  );
}
