"use client"

import type React from "react"

import { Image, Text, View, StyleSheet, ScrollView } from "react-native"
import { router } from "expo-router"
import { SafeAreaView } from "react-native-safe-area-context"
import databaseService, { type OutfitWithImage } from "@/services/database/db"
import { useEffect, useState } from "react"
import { Center } from "@/components/ui/center"
import { Spinner } from "@/components/ui/spinner"
import { Feather, MaterialIcons } from "@expo/vector-icons"
import { Gesture, GestureDetector } from "react-native-gesture-handler"
import { runOnJS } from "react-native-reanimated"
import { Colors } from "@/constants/Colors"
import { SpeedDial } from "@rneui/themed"

const Loading = () => {
  return (
    <Center style={{ flex: 1, width: "100%", height: "100%" }}>
      <Spinner size="large" />
    </Center>
  )
}

const CustomFab = ({
  onEdit,
  onDelete,
}: {
  onEdit: () => void
  onDelete?: () => void
}) => {
  const [open, setOpen] = useState(false)

  return (
    <SpeedDial
      isOpen={open}
      icon={<Feather name="menu" size={24} color="white" />}
      openIcon={<Feather name="x" size={24} color="white" />}
      onOpen={() => setOpen(!open)}
      onClose={() => setOpen(!open)}
      overlayColor="transparent"
      buttonStyle={{
        backgroundColor: Colors.light.tint,
        shadowColor: "black",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 5,
      }}
      style={{ position: "absolute", bottom: 16, right: 16 }}
      containerStyle={{ gap: 0 }}
    >
      <SpeedDial.Action
        icon={<Feather name="trash" size={20} color="white" />}
        buttonStyle={{ backgroundColor: Colors.light.tint }}
        onPress={() => onDelete && onDelete()}
      />
      <SpeedDial.Action
        icon={<Feather name="edit-2" size={20} color="white" />}
        buttonStyle={{ backgroundColor: Colors.light.tint }}
        onPress={() => onEdit()}
      />
    </SpeedDial>
  )
}

// Info item component for consistent styling
const InfoItem = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
  <View style={styles.infoItem}>
    <View style={styles.infoIcon}>{icon}</View>
    <View style={styles.infoContent}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value || "N/A"}</Text>
    </View>
  </View>
)

export default function GetOutfit({
  paramid,
  onClose,
}: {
  paramid?: string
  onClose?: () => void
}) {
  const id = paramid
  const [outfit, setOutfit] = useState<OutfitWithImage>()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      setLoading(true)
      try {
        if (id) {
          const data = await databaseService.getOutfit(id)
          setOutfit(data)
        }
      } catch (error) {
        console.error("Error fetching outfit: ", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [id])

  // Simplified swipe gesture to avoid maximum depth exceeded error
  const swipeGesture = Gesture.Pan()
    .runOnJS(true)
    .onEnd((event) => {
      if (event.translationY > 50) {
        if (onClose) {
          runOnJS(onClose)()
        } else {
          runOnJS(router.back)()
        }
      }
    })

  const handledelete = async () => {
    if (id && outfit?.fileID) {
      await databaseService.deleteOutfit(id, outfit.fileID)
      if (onClose) onClose()
    }
  }

  if (loading) {
    return <Loading />
  }

  return (
    <GestureDetector gesture={swipeGesture}>
      <SafeAreaView style={styles.container}>
        <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
          <View style={styles.imageContainer}>
            <Image source={{ uri: outfit?.imageUrl }} style={styles.image} resizeMode="cover" />
          </View>

          <View style={styles.contentContainer}>
            <Text style={styles.title}>{outfit?.outfitName || "Item Info"}</Text>

            <View style={styles.infoContainer}>
              <InfoItem
                icon={<MaterialIcons name="description" size={20} color="#666" />}
                label="Description"
                value={outfit?.outfitName || ""}
              />

              <InfoItem
                icon={<MaterialIcons name="branding-watermark" size={20} color="#666" />}
                label="Brand"
                value={outfit?.brand || ""}
              />

              <InfoItem
                icon={<MaterialIcons name="straighten" size={20} color="#666" />}
                label="Size"
                value={outfit?.size || ""}
              />

              <InfoItem
                icon={<MaterialIcons name="category" size={20} color="#666" />}
                label="Garment Type"
                value={outfit?.garmentType || ""}
              />

              <InfoItem
                icon={<MaterialIcons name="style" size={20} color="#666" />}
                label="Material"
                value={outfit?.material || ""}
              />

              <InfoItem
                icon={<MaterialIcons name="palette" size={20} color="#666" />}
                label="Theme"
                value={outfit?.attireTheme || ""}
              />
            </View>
          </View>
        </ScrollView>

        <CustomFab
          onEdit={() => {
            router.push({
              pathname: `/(auth)/outfit/edit`,
              params: {
                id: id,
              },
            })
            if (onClose) onClose()
          }}
          onDelete={handledelete}
        />
      </SafeAreaView>
    </GestureDetector>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  imageContainer: {
    width: "100%",
    height: 350,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  contentContainer: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  infoContainer: {
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  infoIcon: {
    width: 40,
    alignItems: "center",
  },
  infoContent: {
    flex: 1,
    marginLeft: 10,
  },
  infoLabel: {
    fontSize: 14,
    color: "#666",
  },
  infoValue: {
    fontSize: 16,
    fontWeight: "500",
    marginTop: 2,
  },
})
