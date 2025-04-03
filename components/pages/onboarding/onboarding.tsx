import Slider from "@/components/atoms/slider/slider";
import data from "./constants";

import { View } from "react-native";
import { Button, ButtonText } from "@/components/ui/button";

export default function OnboardingScreen() {
  return (
    <View className="flex-1">
      <Slider data={data} />
      <View className="p-5 items-center justify-center">
        <Button className="bg-blue-500 w-full h-20 " variant="solid" size="xl">
          <ButtonText>Next</ButtonText>
        </Button>
      </View>
    </View>
  );
}
