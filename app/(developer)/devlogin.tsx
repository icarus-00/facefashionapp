import { ThemedView } from "@/components/ThemedView";
import { useState } from "react";
import { Button, ButtonText } from "@/components/ui/button";
import { useUser } from "@/context/authcontext";
import { View, Button as ReactButton, Text } from "react-native";
import { account } from "@/services/config/appwrite";

import { ToastGlue } from "@/context/toastContext";
import SafeAreaView from "@/components/atoms/safeview/safeview";export default function LoginScreen() {
  const [color, setColor] = useState("red");
  const { current: user, login, logout, register } = useUser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  return (
    <SafeAreaView className="flex-1 bg-white">
      <ThemedView className="flex-1">
        <View className="p-5 items-center flex-1 justify-center">
          <View className="h-15 w-full bg-black" />
          {user && (
            <View className="p-5">
              <Text>{`Welcome ${user.email}`}</Text>
            </View>
          )}
          {!user && (
            <View className="p-5">
              <Text>{`Please login`}</Text>
            </View>
          )}
          <Button
            className="bg-blue-500 w-full h-20 "
            variant="solid"
            size="xl"
            onPress={async () => {
              console.log("Login");
              setIsLoading(true);
              setError("");
              try {
                await login("icarus00x@gmail.com", "password");
              } catch (err) {
                setError("Login failed. Please check your credentials.");
              } finally {
                setIsLoading(false);
              }
            }}
            disabled={isLoading}
          >
            <ButtonText>{isLoading ? "Loading..." : "Login"}</ButtonText>
          </Button>

          <Button
            className="bg-blue-500 w-full h-20 mt-4"
            variant="solid"
            size="xl"
            onPress={async () => {
              setIsLoading(true);
              setError("");
              try {
                await register("omar@gmail.com", "password");
              } catch (err) {
                setError("Registration failed. Please check your credentials.");
              } finally {
                setIsLoading(false);
              }
            }}
            disabled={isLoading}
          >
            <ButtonText>{isLoading ? "Loading..." : "Register"}</ButtonText>
          </Button>

          <Button
            className="bg-blue-500 w-full h-20 mt-4 "
            variant="solid"
            size="xl"
            onPress={async () => {
              setIsLoading(true);
              setError("");
              try {
                await logout();
              } catch (err) {
                setError("Logout failed. Please try again.");
              } finally {
                setIsLoading(false);
              }
            }}
            disabled={isLoading}
          >
            <ButtonText>{isLoading ? "Loading..." : "Logout"}</ButtonText>
          </Button>
          <Button
            onPress={async () => {
              const user = await account.get();
              console.log(user);
            }}
          >
            <ButtonText>test appwrite</ButtonText>
          </Button>

          <ReactButton
            title="appwrite test"
            onPress={() => {
              console.log("appwrite test");
              account
                .get()
                .then((user) => {
                  console.log(user);
                })
                .catch((error) => {
                  console.error(error);
                });
            }}
          />
          <ReactButton
            title="test toast"
            onPress={() => {
              ToastGlue("test toast");
            }}
          />
        </View>
      </ThemedView>
    </SafeAreaView>
  );
}
