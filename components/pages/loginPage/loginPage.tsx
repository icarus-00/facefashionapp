import { Box } from "@/components/ui/box";
import {
  ButtonIcon,
  ButtonText,
  ThirdPartyButtonIcon,
} from "@/components/ui/button";
import { Center } from "@/components/ui/center";
import { Text } from "@/components/ui/text";
import { Button, ButtonSpinner } from "@/components/ui/button";
import { Ionicons } from "@expo/vector-icons";
import { Input } from "@rneui/themed";
import {
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  Image,
  ActivityIndicator,
  Platform,
} from "react-native";
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
  withSequence,
  withDelay,
  Easing,
  withSpring,
  FadeIn,
  ZoomIn,
  interpolateColor,
} from "react-native-reanimated";
import { useState, useEffect, useRef } from "react";
import { BottomSheetModal, BottomSheetModalProvider, BottomSheetView } from "@gorhom/bottom-sheet";
import { OtpInput } from "react-native-otp-entry";

const RwLogo = require("@/assets/images/rwlogo.png");

export default function LoginPage({
  setEmail,
  setPassword,
  email,
  password,
  setEmailError,
  setPasswordError,
  setError,
  error,
  emailError,
  passwordError,
  handleSubmit,
  handleOtpRequest,
  setToken,
  handleOTPSubmit = (otp) => { },
}: {
  setToken: (value: string) => void;
  setEmail: (value: string) => void;
  setPassword: (value: string) => void;
  email: string;
  password: string;
  setEmailError: (value: string) => void;
  setPasswordError: (value: string) => void;
  setError: (value: string) => void;
  error: string;
  emailError: string;
  passwordError: string;
  handleSubmit: () => void;
  handleOtpRequest: () => void;
  handleOTPSubmit?: (otp: string) => void;
}) {
  const [loading, setLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpTimer, setOtpTimer] = useState(0);
  const [canResend, setCanResend] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [logoLoaded, setLogoLoaded] = useState(false);
  const timerRef = useRef<number | null>(null);
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  // Animation config
  const animConfig = {
    duration: 400,
    easing: Easing.bezier(0.25, 0.1, 0.25, 1),
  };

  // Animation values
  const formProgress = useSharedValue(0);
  const passwordOpacity = useSharedValue(0);
  const passwordHeight = useSharedValue(0);
  const buttonScale = useSharedValue(1);
  const secondaryButtonScale = useSharedValue(1);
  const headerBoxHeight = useSharedValue(240); // Increased for larger logo
  const logoTextSize = useSharedValue(22); // Adjusted text size
  const forgotPasswordOpacity = useSharedValue(0);
  const logoOpacity = useSharedValue(0);
  const logoScale = useSharedValue(0.8);
  const errorMessageOpacity = useSharedValue(0);
  const errorBackgroundColor = useSharedValue(0);
  const taglineOpacity = useSharedValue(0);

  // Form validation
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setEmailError("Email is required");
      return false;
    } else if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email address");
      return false;
    } else {
      setEmailError("");
      return true;
    }
  };

  const validatePassword = (password: string) => {
    if (!password) {
      setPasswordError("Password is required");
      return false;
    } else if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters");
      return false;
    } else {
      setPasswordError("");
      return true;
    }
  };

  // OTP Timer functions
  const startOtpTimer = () => {
    setOtpTimer(60);
    setCanResend(false);

    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    timerRef.current = setInterval(() => {
      setOtpTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    // Clean up timer when component unmounts
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  // Logo animation on mount
  useEffect(() => {
    logoOpacity.value = withTiming(1, { duration: 800 });
    logoScale.value = withTiming(1, {
      duration: 800,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1)
    });
    taglineOpacity.value = withDelay(400, withTiming(1, { duration: 600 }));
  }, [logoLoaded]);

  // Error message handling
  useEffect(() => {
    if (error) {
      setErrorMessage(error);
      errorMessageOpacity.value = withTiming(1, { duration: 300 });
      errorBackgroundColor.value = withTiming(1, { duration: 300 });

      // Auto-hide error after 5 seconds
      const timeout = setTimeout(() => {
        errorMessageOpacity.value = withTiming(0, { duration: 300 });
        setError("");
      }, 5000);

      return () => clearTimeout(timeout);
    }
  }, [error]);

  // Button animations
  const animateButtonPress = () => {
    buttonScale.value = withSequence(
      withSpring(0.95, { mass: 1, stiffness: 100, damping: 10 }),
      withSpring(1, { mass: 2, stiffness: 200, damping: 5 })
    );
  };
  const animateSecondButtonPress = () => {
    secondaryButtonScale.value = withSequence(
      withTiming(0.95, { duration: 100, easing: Easing.bounce }),
      withTiming(1, { duration: 100, easing: Easing.bounce })
    );
  };

  const animateToStep2 = () => {
    // Header animation
    headerBoxHeight.value = withTiming(140, animConfig);
    logoTextSize.value = withTiming(16, animConfig);
    taglineOpacity.value = withTiming(0, { duration: 200 });

    // Password field appearance
    passwordOpacity.value = withTiming(1, animConfig);
    passwordHeight.value = withTiming(80, animConfig);
    forgotPasswordOpacity.value = withDelay(200, withTiming(1, animConfig));

    // Progress indicator
    formProgress.value = withTiming(1, animConfig);
  };

  const animateToStep1 = () => {
    // Header expansion
    headerBoxHeight.value = withTiming(240, animConfig);
    logoTextSize.value = withTiming(22, animConfig);
    taglineOpacity.value = withDelay(200, withTiming(1, animConfig));

    // Hide password field
    forgotPasswordOpacity.value = withTiming(0, { duration: 200 });
    passwordOpacity.value = withDelay(100, withTiming(0, { duration: 200 }));
    passwordHeight.value = withDelay(150, withTiming(0, animConfig));

    // Progress indicator
    formProgress.value = withTiming(0, animConfig);
  };

  const handleContinue = () => {
    if (step === 1) {
      if (validateEmail(email)) {
        animateButtonPress();
        animateToStep2();
        setStep(2);
      }
    } else {
      if (validatePassword(password)) {
        animateButtonPress();
        setLoading(true);
        // Call API
        setTimeout(() => {
          handleSubmit();
          setLoading(false);
        }, 1500);
      }
    }
  };

  const handleOtpPress = async () => {
    animateSecondButtonPress();

    if (validateEmail(email)) {
      // If timer has expired or hasn't started yet, send new OTP
      if (otpTimer <= 0) {
        setOtpLoading(true);

        try {
          await handleOtpRequest();

          // After successful OTP request, start timer
          startOtpTimer();
          setOtpLoading(false);

          // Show the OTP modal with animation
          bottomSheetModalRef.current?.present();
        } catch (err) {
          setOtpLoading(false);
          setError(`Failed to send OTP: ${err instanceof Error ? err.message : 'Unknown error'}`);

          // Shake animation for error
          buttonScale.value = withSequence(
            withTiming(1.03, { duration: 100 }),
            withTiming(0.97, { duration: 100 }),
            withTiming(1.03, { duration: 100 }),
            withTiming(0.97, { duration: 100 }),
            withTiming(1, { duration: 100 })
          );
          return;
        }
      } else {
        // Timer still running, just show the OTP modal
        bottomSheetModalRef.current?.present();
      }
    } else {
      // Email validation failed - add shake animation
      secondaryButtonScale.value = withSequence(
        withTiming(1.03, { duration: 100 }),
        withTiming(0.97, { duration: 100 }),
        withTiming(1.03, { duration: 100 }),
        withTiming(0.97, { duration: 100 }),
        withTiming(1, { duration: 100 })
      );
    }
  };

  const handleResendOtp = async () => {
    if (canResend) {
      setOtpLoading(true);

      try {
        await handleOtpRequest();
        startOtpTimer();
        setOtpLoading(false);

        // Success animation
        buttonScale.value = withSequence(
          withTiming(1.05, { duration: 150 }),
          withTiming(1, { duration: 150 })
        );
      } catch (err) {
        setOtpLoading(false);
        setError(`Failed to resend OTP: ${err instanceof Error ? err.message : 'Unknown error'}`);
      }
    }
  };

  const handleOtpSubmitPress = () => {
    if (otp.length === 6) {
      setOtpLoading(true);

      // Process OTP verification
      setTimeout(() => {
        handleOTPSubmit(otp);
        setOtpLoading(false);
        bottomSheetModalRef.current?.dismiss();
      }, 1500);
    }
  };

  const handleBackPress = () => {
    animateSecondButtonPress();
    animateToStep1();
    setStep(1);
  };

  // Animated styles
  const primaryButtonStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: buttonScale.value }],
    };
  });

  const secondaryButtonStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: secondaryButtonScale.value }],
    };
  });

  const passwordContainerStyle = useAnimatedStyle(() => {
    return {
      height: passwordHeight.value,
      opacity: passwordOpacity.value,
      overflow: "hidden",
    };
  });

  const forgotPasswordStyle = useAnimatedStyle(() => {
    return {
      opacity: forgotPasswordOpacity.value,
    };
  });

  const headerBoxStyle = useAnimatedStyle(() => {
    return {
      height: headerBoxHeight.value,
      justifyContent: "center",
      alignItems: "center",
    };
  });

  const logoTextStyle = useAnimatedStyle(() => {
    return {
      fontSize: logoTextSize.value,
      fontWeight: "bold",
      color: "white",
      textAlign: "center",
      width: "100%",
    };
  });

  const taglineStyle = useAnimatedStyle(() => {
    return {
      opacity: taglineOpacity.value,
      marginTop: 5,
    };
  });

  const logoContainerStyle = useAnimatedStyle(() => {
    return {
      opacity: logoOpacity.value,
      transform: [{ scale: logoScale.value }],
      alignItems: "center",
      justifyContent: "center",
      width: "100%",
    };
  });

  const errorContainerStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      errorBackgroundColor.value,
      [0, 1],
      ['rgba(255,59,48,0)', 'rgba(255,59,48,0.1)']
    );

    return {
      opacity: errorMessageOpacity.value,
      backgroundColor,
    };
  });

  return (
    <>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView className="flex-1" contentContainerStyle={{ flexGrow: 1 }}>
          <View className="flex-1 w-full bg-black">
            <Animated.View
              className="w-full items-center bg-black"
              style={headerBoxStyle}
            >
              <Animated.View style={logoContainerStyle}>
                <View className="items-center justify-center">
                  <Image
                    source={RwLogo}
                    style={{ width: 120, height: 120, tintColor: 'white' }}
                    resizeMode="contain"
                    onLoad={() => setLogoLoaded(true)}
                  />
                  <Animated.Text style={logoTextStyle}>
                    RenderWear
                  </Animated.Text>
                  <Animated.Text
                    style={[
                      taglineStyle,
                      { color: "#CCCCCC", fontSize: 14, textAlign: "center" }
                    ]}
                  >
                    Experience fashion in a whole new dimension
                  </Animated.Text>
                </View>
              </Animated.View>
            </Animated.View>

            <View className="flex-1 justify-between rounded-t-3xl bg-white">
              {/* Error message */}
              {errorMessage && (
                <Animated.View
                  entering={FadeIn.duration(300)}
                  style={[{
                    marginHorizontal: 20,
                    marginTop: 12,
                    padding: 12,
                    borderRadius: 8,
                    borderLeftWidth: 4,
                    borderLeftColor: "#FF3B30",
                  }, errorContainerStyle]}
                >
                  <Text style={{ color: "#FF3B30" }}>{errorMessage}</Text>
                </Animated.View>
              )}

              <View className="px-5 pt-6">
                {/* Email Input */}
                <Input
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    if (emailError) validateEmail(text);
                  }}
                  errorMessage={emailError}
                  errorStyle={{ color: "#FF3B30", fontSize: 12, marginTop: 5 }}
                  inputStyle={{ color: "#333", paddingVertical: 10 }}
                  inputContainerStyle={{
                    borderBottomColor: emailError ? "#FF3B30" : "#E0E0E0",
                    borderBottomWidth: 1.5,
                  }}
                  label="Email"
                  labelStyle={{
                    color: "#333",
                    fontWeight: "600",
                    marginBottom: 8,
                  }}
                  leftIcon={<Ionicons name="mail" size={20} color="#555" />}
                  leftIconContainerStyle={{ marginLeft: 0, marginRight: 10 }}
                  rightIcon={
                    email ? (
                      <Ionicons
                        name="close-circle"
                        size={20}
                        color="#777"
                        onPress={() => setEmail("")}
                      />
                    ) : (
                      <></>
                    )
                  }
                  rightIconContainerStyle={{ marginRight: 0 }}
                  placeholder="Enter your email"
                  autoCapitalize="none"
                  keyboardType="email-address"
                />

                {/* Password Input - Animated */}
                <Animated.View style={passwordContainerStyle}>
                  <Input
                    value={password}
                    onChangeText={(text) => {
                      setPassword(text);
                      if (passwordError) validatePassword(text);
                    }}
                    errorMessage={passwordError}
                    errorStyle={{
                      color: "#FF3B30",
                      fontSize: 12,
                      marginTop: 5,
                    }}
                    inputStyle={{ color: "#333", paddingVertical: 10 }}
                    inputContainerStyle={{
                      borderBottomColor: passwordError ? "#FF3B30" : "#E0E0E0",
                      borderBottomWidth: 1.5,
                    }}
                    label="Password"
                    labelStyle={{
                      color: "#333",
                      fontWeight: "600",
                      marginBottom: 8,
                    }}
                    secureTextEntry={!showPassword}
                    leftIcon={
                      <Ionicons name="lock-closed" size={20} color="#555" />
                    }
                    leftIconContainerStyle={{ marginLeft: 0, marginRight: 10 }}
                    rightIcon={
                      <Ionicons
                        name={showPassword ? "eye-off" : "eye"}
                        size={20}
                        color="#777"
                        onPress={() => setShowPassword(!showPassword)}
                      />
                    }
                    rightIconContainerStyle={{ marginRight: 0 }}
                    placeholder="Enter your password"
                  />

                  {/* Forgot Password */}
                  <Animated.View style={forgotPasswordStyle}>
                    <TouchableOpacity className="mt-2 mb-4">
                      <Text className="text-gray-600 text-right text-sm">
                        Forgot Password?
                      </Text>
                    </TouchableOpacity>
                  </Animated.View>
                </Animated.View>
              </View>

              {/* Button Container */}
              <View className="px-5 pb-8 mt-8 gap-4">
                {/* Continue/Submit Button */}
                <Animated.View style={primaryButtonStyle}>
                  <Button
                    size="full"
                    action="primary"
                    onPress={handleContinue}
                    disabled={loading}
                  >
                    <View style={{ flex: 1, alignItems: 'center', flexDirection: 'row', justifyContent: 'center' }}>
                      <ButtonText>
                        {step === 1 ? "Continue" : "Log In"}
                      </ButtonText>
                    </View>
                    <View style={{ position: 'absolute', right: 16 }}>
                      {loading ? (
                        <ButtonSpinner animating={true} size={20} color="white" />
                      ) : (
                        <Ionicons
                          name={step === 1 ? "arrow-forward" : "log-in"}
                          size={20}
                          color="white"
                        />
                      )}
                    </View>
                  </Button>
                </Animated.View>

                {/* OTP/Back Button */}
                <Animated.View style={secondaryButtonStyle}>
                  {step === 1 ? (
                    <Button
                      size="full"
                      action="primary"
                      onPress={handleOtpPress}
                      disabled={otpLoading}
                    >
                      <View style={{ flex: 1, alignItems: 'center', flexDirection: 'row', justifyContent: 'center' }}>
                        <ButtonText>
                          {otpTimer > 0
                            ? `Login with OTP (${otpTimer}s)`
                            : "Login with OTP"}
                        </ButtonText>
                      </View>
                      <View style={{ position: 'absolute', right: 16 }}>
                        {otpLoading ? (
                          <ButtonSpinner animating={true} size={20} color="white" />
                        ) : (
                          <Ionicons name="key" size={20} color="white" />
                        )}
                      </View>
                    </Button>
                  ) : (
                    <Button
                      size="full"
                      action="secondary"
                      onPress={handleBackPress}
                    >
                      <View style={{ flex: 1, alignItems: 'center', flexDirection: 'row', justifyContent: 'center' }}>
                        <ButtonText className="text-white">Back</ButtonText>
                      </View>
                      <View style={{ position: 'absolute', right: 16 }}>
                        <Ionicons name="arrow-back" size={20} color="white" />
                      </View>
                    </Button>
                  )}
                </Animated.View>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* OTP Bottom Sheet */}
      <BottomSheetModalProvider>
        <BottomSheetModal snapPoints={["70%"]} ref={bottomSheetModalRef}>
          <BottomSheetView
            style={{
              flex: 1,
              alignItems: "center",
              overflow: "visible",
              justifyContent: "flex-start",
              backgroundColor: "white",
            }}
          >
            <View className="bg-white rounded-t-3xl pt-8 pb-8 px-4 relative">
              <View className="w-full items-center justify-center flex-row">
                <View className="bg-white h-16 w-16 rounded-full flex items-center justify-center shadow-md">
                  <Ionicons name="shield-checkmark" size={28} color="#000" />
                </View>
              </View>

              <View className="mt-8 px-4">
                <Text className="text-center text-xl font-bold mb-2">
                  Verification Code
                </Text>
                <Text className="text-center text-gray-500 mb-6">
                  We have sent OTP verification code to your email address
                </Text>

                <View className="my-4">
                  <OtpInput
                    numberOfDigits={6}
                    focusColor="green"
                    autoFocus={false}
                    hideStick={true}
                    placeholder="******"
                    blurOnFilled={true}
                    disabled={false}
                    type="numeric"
                    secureTextEntry={false}
                    focusStickBlinkingDuration={500}
                    onTextChange={(text) => { setToken(text); setOtp(text); }}
                    onFilled={(text) => { }}
                    textInputProps={{
                      accessibilityLabel: "One-Time Password",
                    }}
                    textProps={{
                      accessibilityRole: "text",
                      accessibilityLabel: "OTP digit",
                      allowFontScaling: false,
                    }}
                  />
                </View>

                <View className="flex-row justify-center items-center mb-6">
                  <Text className="text-gray-500">
                    {canResend
                      ? "Didn't receive code? "
                      : `Resend code in ${otpTimer}s`}
                  </Text>
                  {canResend && (
                    <TouchableOpacity
                      onPress={handleResendOtp}
                      disabled={otpLoading}
                    >
                      <Text className="text-blue-600 font-semibold ml-1">
                        Resend
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>

                <Button
                  size="full"
                  action="primary"
                  onPress={handleOtpSubmitPress}
                  disabled={otp.length !== 6 || otpLoading}
                >
                  <View style={{ flex: 1, alignItems: 'center', flexDirection: 'row', justifyContent: 'center' }}>
                    <ButtonText>Verify OTP</ButtonText>
                  </View>
                  <View style={{ position: 'absolute', right: 16 }}>
                    {otpLoading ? (
                      <ButtonSpinner animating={true} size={20} color="white" />
                    ) : (
                      <Ionicons name="checkmark-circle" size={20} color="white" />
                    )}
                  </View>
                </Button>
              </View>
            </View>
          </BottomSheetView>
        </BottomSheetModal>
      </BottomSheetModalProvider>
    </>
  );
}