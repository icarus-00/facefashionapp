import { ThemedView } from "@/components/ThemedView";
import { useState } from "react";
import { Button, ButtonText } from "@/components/ui/button";
import { useUser } from "@/context/authcontext";
import { View, Button as ReactButton } from "react-native";
import { account } from "@/services/config/appwrite";

import { ToastGlue } from "@/context/toastContext";
import { SafeAreaView } from "react-native-safe-area-context";
import { Box } from "@/components/ui/box";
import { Center } from "@/components/ui/center";
import { Text } from "@/components/ui/text";
import { Input, InputField } from "@/components/ui/input";
import { router, useRouter } from "expo-router";
export default function LoginScreen() {
  const [color, setColor] = useState("red");
  const router = useRouter();
  const { current: user, login, logout, register } = useUser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const handleSubmit = async () => {
    setIsLoading(true);
    setError("");
    try {
      await login(email, password);
      router.replace("/(app)/(auth)/(tabs)");
      console.log("Login successful");
    } catch (error: any) {
      setError(error.message);
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 w-full p-5 justify-center ">
        <Center className="flex-1">
          <Box className="flex-1 justify-center align-middle">
            <Text size="6xl">RenderWear</Text>
          </Box>
          <View className="w-full flex-[2] justify-center py-5">
            <View className="w-full  justify-center  border border-primary-500 rounded-xl p-5 gap-5">
              <Input
                variant="rounded"
                size="2xl"
                isDisabled={false}
                isInvalid={false}
                isReadOnly={false}
              >
                <InputField
                  placeholder="email"
                  onChangeText={(value) => {
                    setEmail(value);
                  }}
                />
              </Input>
              <Input
                variant="rounded"
                size="2xl"
                isDisabled={false}
                isInvalid={false}
                isReadOnly={false}
              >
                <InputField
                  placeholder="password"
                  type="password"
                  onChangeText={(value) => setPassword(value)}
                />
              </Input>
            </View>
          </View>
          <Box className="w-full flex-1">
            <Button size="full" action="primary" onPress={handleSubmit}>
              <ButtonText>Login</ButtonText>
            </Button>
          </Box>
        </Center>
      </View>
    </SafeAreaView>
  );
}
