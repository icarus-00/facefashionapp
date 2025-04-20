import ActorScreen from "@/components/pages/actorPage/actions/edit";
import { useLocalSearchParams } from "expo-router";
import { Text } from "react-native";
export default function CreateActor() {
  const { id } = useLocalSearchParams();
  console.log(id);
  return <ActorScreen id={id.toString()} />;
}
