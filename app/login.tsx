import { ThemedView } from "@/components/ThemedView"
import { useState } from "react";
import { Button, ButtonText } from "@/components/ui/button";
import {useUser} from "@/context/authcontext"
import { View } from "react-native";

export default function LoginScreen() {
    const { current: user, login, logout, register } = useUser();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
  return (
    <ThemedView className="flex-1">
      <View className="p-5 items-center justify-center">
        <Button
          className="bg-blue-500 w-full h-20 "
          variant="solid"
          size="xl"
          onPress={async () => {
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
            }
            finally {
              setIsLoading(false);
            }
          }}
          disabled={isLoading}
        >
          <ButtonText>{isLoading ? "Loading..." : "Register"}</ButtonText>
        </Button>

        <Button
          className="bg-blue-500 w-full h-20 mt-4 bg-red"
          variant="solid"
          size="xl"
          onPress={async () => {
            setIsLoading(true);
            setError("");
            try {
              await logout();
            } catch (err) {
              setError("Logout failed. Please try again.");
            }
            finally {
              setIsLoading(false);
            }
          }}
          disabled={isLoading}
        >
          <ButtonText>{isLoading ? "Loading..." : "Logout"}</ButtonText>
        </Button>
        
      </View>
      
    </ThemedView>
  );
}