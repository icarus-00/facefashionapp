import { Badge, BadgeText } from "@/components/ui/badge";
import { VStack } from "@/components/ui/vstack";
import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";


export default function RootNav({
  name,
  onPress,
}: {
  name: string;
  onPress: () => void;
}) {
  return (
    <View className="flex-row items-center  h-16">
      

      <View className="flex-1 items-center">
        <Text className="text-lg font-bold ">{name}</Text>
      </View>
    </View>
  );
}
