import React from "react";
import { View, Text, StyleSheet, Image, ImageBackground } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { Button, ButtonText } from "@/components/ui/button";
import { Box } from "@/components/ui/box";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Center } from "@/components/ui/center";
import { Text as GText } from "@/components/ui/text";
import { Pressable } from "@/components/ui/pressable";
import { Heading } from "@/components/ui/heading";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { Card } from "@/components/ui/card";
import { LinearGradient } from "expo-linear-gradient";
const RenderWearApp = () => {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView>
        {/*<ImageBackground
        source={require("./assets/gradient-bg.png")}
        style={styles.backgroundImage}
        resizeMode="cover"
      >*/}
        <View className="flex-1 items-center justify-between w-full p-0">
          <ImageBackground
            source={{
              uri: "https://cloud.appwrite.io/v1/storage/buckets/67e850540015dbf17f6e/files/67f19fae00140eeaabb9/view?project=67e8502e001a780507c5",
            }} // Replace with your logo URL
            className="w-full aspect-[9/13] object-cover"
            style={{
              flex: 1,
            }}
          >
            <LinearGradient
              colors={["rgba(0, 0, 0, 0)", "rgba(255, 255, 255, 1)"]}
              style={{
                ...StyleSheet.absoluteFillObject,
              }}
            />
          </ImageBackground>
        </View>
        <VStack style={styles.contentContainer} space="md">
          {/* Header */}

          <View className=" h-[120px] my-10 justify-center items-center">
            <Center>
              <Heading className="text-primary-500 font-extrabold" size="4xl">
                RenderWear
              </Heading>
              <Heading className="text-primary-200 font-extrabold" size="5xl">
                Fusion Style
              </Heading>
            </Center>
          </View>

          {/* Silhouette Image */}
          {/*  <Center style={styles.silhouetteContainer}>
            <Image
              source={require("./assets/male-silhouette.png")}
              style={styles.silhouetteImage}
              resizeMode="contain"
            />
          </Center> */}

          {/* Main Marketing Text */}
          <Center className="w-full">
            <Text className="text-primary-500 font-extrabold text-4xl mb-2  text-center">
              Revolutionizing Try- On Experiences
            </Text>
            <Text className="text-primary-200 text-lg text-center mb-4">
              Create, customize, and try on styles in seconds using our
              cutting-edge AI technologies.
            </Text>
          </Center>

          {/* Get Started Button */}

          <Button
            size="full"
            style={{
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              elevation: 10,
            }}
            variant="solid"
          >
            <ButtonText>Get Started</ButtonText>
          </Button>

          {/* AI Feature Section */}
          <Center>
            <Text className="text-primary-500 text-3xl font-extrabold mb-2 text-center">
              AI-Powered Outfit Generation
            </Text>
            <Text style={styles.featureDescription}>
              Generate Your Unique Fashion Style Anytime, Anywhere! Fashion
              Studio In Your Pocket.
            </Text>
          </Center>

          <HStack className="w-full justify-center gap-5 mt-4">
            <Card className="bg-white shadow-black shadow-{20} rounded-xl">
              <AntDesign
                name="camera"
                size={40}
                color="#4a2b82"
                style={styles.iconSpacing}
              />
            </Card>
            <Card className="bg-white shadow-black shadow-{20} rounded-xl">
              <AntDesign
                name="camera"
                size={40}
                color="#4a2b82"
                style={styles.iconSpacing}
              />
            </Card>
            <Card className="bg-white shadow-black shadow-{20} rounded-xl">
              <AntDesign
                name="camera"
                size={40}
                color="#4a2b82"
                style={styles.iconSpacing}
              />
            </Card>
          </HStack>
          <HStack space="md">
            <Card className="bg-primary-500 shadow-black shadow-{20} rounded-xl">
              <Text className="text-typography-white">Streat Wear</Text>
            </Card>

            <Card className="bg-primary-500 rounded-xl">
              <Text className="text-typography-white">Exotic</Text>
            </Card>
            <Card className="bg-primary-500 rounded-xl">
              <Text className="text-typography-white">Retro</Text>
            </Card>
          </HStack>

          {/* Secondary Category Tabs */}
          <HStack space="md">
            <Card className="bg-primary-500 rounded-xl">
              <Text className="text-typography-white">Historical</Text>
            </Card>

            <Card className="bg-primary-500 rounded-xl">
              <Text className="text-typography-white">Historical</Text>
            </Card>
          </HStack>

          {/* Bottom Silhouette */}
          <Box style={styles.bottomSilhouetteContainer}>
            {/* <Image
              source={require("./assets/female-silhouette.png")}
              style={styles.bottomSilhouetteImage}
              resizeMode="contain"
            /> */}
          </Box>
        </VStack>
        {/*</ImageBackground>*/}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    width: "100%",
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 30,
    alignItems: "center",
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 20,
  },

  headerSubText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#000",
    marginTop: -5,
  },
  silhouetteContainer: {
    height: 140,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  silhouetteImage: {
    height: "100%",
  },
  marketingContainer: {
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20,
  },
  marketingTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4a2b82",
    marginBottom: 5,
  },
  marketingDescription: {
    fontSize: 14,
    textAlign: "center",
    color: "#555",
    paddingHorizontal: 10,
  },
  startButton: {
    backgroundColor: "#4a2b82",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
    marginVertical: 20,
  },
  aiFeatureContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 5,
  },
  featureDescription: {
    fontSize: 14,
    textAlign: "center",
    color: "#555",
    paddingHorizontal: 10,
  },
  categoryTabsContainer: {
    width: "100%",
    marginBottom: 10,
  },
  categoryTab: {
    backgroundColor: "#6c3cbe",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    width: "30%",
    alignItems: "center",
  },
  secondaryTabsContainer: {
    width: "70%",
    marginBottom: 10,
  },
  secondaryTab: {
    backgroundColor: "#6c3cbe",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    width: "45%",
    alignItems: "center",
  },
  iconSpacing: {
    marginBottom: 3,
  },
  tabText: {
    color: "white",
    fontSize: 12,
    fontWeight: "500",
  },
  bottomSilhouetteContainer: {
    flex: 1,
    width: "100%",
    justifyContent: "flex-end",
    alignItems: "center",
    marginTop: 10,
  },
  bottomSilhouetteImage: {
    height: 150,
  },
});

export default RenderWearApp;
