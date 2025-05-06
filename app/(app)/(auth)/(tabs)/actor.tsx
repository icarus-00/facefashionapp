import React from "react";
<<<<<<< HEAD
import SafeAreaView from "@/components/atoms/safeview/safeview"; import ActorPageComp from "@/components/pages/actorPage/view";
=======
import { SafeAreaView } from "react-native-safe-area-context";
import ActorPageComp from "@/components/pages/actorPage/view";
>>>>>>> 1f8269efac2356a6a9cf697b823029dd810d29bf

export default function Actor(): React.JSX.Element {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <ActorPageComp />
    </SafeAreaView>
  );
}
