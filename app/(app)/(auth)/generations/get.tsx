//app/(app)/(auth)/generations/get.tsx
import GetGeneration from "@/components/pages/generatePage/actions/get";
import { useLocalSearchParams } from "expo-router";

export default function Get() {
  const { id } = useLocalSearchParams();
  return <GetGeneration id={id?.toString() || ""} />;
}
