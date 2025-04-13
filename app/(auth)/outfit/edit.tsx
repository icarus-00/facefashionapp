import OutfitScreen from "@/components/pages/outfitPage/actions/edit";
import { useLocalSearchParams } from "expo-router";
import { Text } from "react-native";
export default function CreateActor() {
  const { id } = useLocalSearchParams();
  console.log(id);
  return <OutfitScreen id={id.toString()} />;
}
