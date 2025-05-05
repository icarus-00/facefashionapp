import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import ActorPageComp from "@/components/pages/actorPage/view";

export default function Actor(): React.JSX.Element {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <ActorPageComp />
    </SafeAreaView>
  );
}
