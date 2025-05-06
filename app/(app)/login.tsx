import { ThemedView } from "@/components/ThemedView";
import { useState } from "react";
import { Button, ButtonText } from "@/components/ui/button";
import { useUser } from "@/context/authcontext";
import { View, Button as ReactButton } from "react-native";
import { account } from "@/services/config/appwrite";

import { ToastGlue } from "@/context/toastContext";

import SafeAreaView from "@/components/atoms/safeview/safeview";
import { Box } from "@/components/ui/box";
import { Center } from "@/components/ui/center";
import { Text } from "@/components/ui/text";
import { Input, InputField } from "@/components/ui/input";
import { router, useRouter } from "expo-router";
import LoginPage from "@/components/pages/loginPage/loginPage";


export default function LoginScreen() {
  const [color, setColor] = useState("red");
  const router = useRouter();
  const { current: user, login, logout, register, verifyOtp } = useUser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [token, setToken] = useState("");
  const redirectTo = "test"
  const handleSubmit = async () => {
    setIsLoading(true);
    setError("");
    try {
      await login({ email, password });
      router.replace("/(app)/(auth)/(tabs)/home");
      console.log("Login successful");
    } catch (error: any) {
      setError(error.message);
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtp = async () => {
    setIsLoading(true);
    setError("");
    try {
      console.log("sending otp")
      const loginT = await login({ email, redirectUrl: redirectTo }, true);
      console.log("otp sent")
      console.log(loginT)
    } catch (error: any) {
      setError(error.message);
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };
  const handleOtpSubmit = async () => {
    setIsLoading(true);
    try {
      await verifyOtp(email, token, "email");
    } catch (error: any) {
      setError(error.message);
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  }
  console.log(token)

  return (
    <SafeAreaView className="flex-1 bg-white">
      <LoginPage
        email={email}
        password={password}
        setEmail={setEmail}
        setPassword={setPassword}
        emailError={emailError}
        passwordError={passwordError}
        setEmailError={setEmailError}
        setPasswordError={setPasswordError}
        setError={setError}
        error={error}
        handleSubmit={handleSubmit}
        handleOtpRequest={handleOtp}
        handleOTPSubmit={handleOtpSubmit}
        setToken={setToken}
      />
    </SafeAreaView>
  );
}
