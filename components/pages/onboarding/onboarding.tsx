import Slider from "@/components/atoms/slider/slider";
import data from "./constants"

import { View } from "react-native";

export default function OnboardingScreen() {
  return (
    <View className="flex-1">
      <Slider data={data} />
    </View>
  );
}