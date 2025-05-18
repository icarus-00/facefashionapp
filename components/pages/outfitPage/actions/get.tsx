///components/pages/outfitPage/actions/get.tsx
import { Image, Text, View, StyleSheet, Dimensions, FlatList, Modal, TouchableOpacity } from "react-native"
import { router, useFocusEffect } from "expo-router"
import databaseService, { type OutfitWithImage } from "@/services/database/db"
import { useCallback, useEffect, useRef, useState } from "react"
import { Center } from "@/components/ui/center"
import { Spinner } from "@/components/ui/spinner"
import { Feather, AntDesign } from "@expo/vector-icons"
import { SpeedDial } from "@rneui/themed"
import { Colors } from "@/constants/Colors"
import {
  Popover,
  PopoverBackdrop,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
} from "@/components/ui/popover"
import { Pressable } from "react-native-gesture-handler"
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  FadeIn,
} from "react-native-reanimated"
import { LinearGradient } from "expo-linear-gradient"
import { VStack } from "@/components/ui/vstack"
import { HStack } from "@/components/ui/hstack"

const { width: SCREEN_WIDTH } = Dimensions.get("window")

const Loading = () => {
  return (
    <Center style={{ flex: 1, width: "100%", height: "100%" }}>
      <Spinner size="large" />
    </Center>
  )
}

// Info item component for consistent styling
const InfoItem = ({ label, value }: { label: string; value: string }) => {
  const [popoverVisible, setPopoverVisible] = useState(false)


  const handlePopoverOpen = () => {

    setPopoverVisible(true)
    console.log("Popover opened")

  }
  const handlePopoverClose = () => {
    if (popoverVisible) {
      setPopoverVisible(false)

    }
  }
  return (
    <>
      <Popover
        isOpen={popoverVisible}
        onClose={handlePopoverClose}
        onOpen={handlePopoverOpen}
        trigger={(triggerProps) => {
          return (
            <Pressable onPress={() => { console.log("pressed") }} {...triggerProps} style={styles.infoItem}>
              <Text style={styles.infoLabel}>{label}</Text>
              <Text ellipsizeMode="tail" numberOfLines={1} style={styles.infoValue}>{value || "N/A"}</Text>
            </Pressable>
          )
        }}
        placement="top"
        size="md"
      >

        <PopoverContent>
          <PopoverBody>
            <Text style={{ fontSize: 16, color: "#000" }}>{value || "N/A"}</Text>
          </PopoverBody>
        </PopoverContent>
      </Popover>

    </>
  )
}

export default function GetOutfit({
  paramid,
  onClose,
  onNext,
  onPrevious,
  outfits = [],
  currentIndex = 0,
}: {
  paramid?: string
  onClose?: () => void
  onNext?: () => void
  onPrevious?: () => void
  outfits?: OutfitWithImage[]
  currentIndex?: number
}) {
  const id = paramid
  const [outfit, setOutfit] = useState<OutfitWithImage>()
  const [loading, setLoading] = useState(true)
  const [fabOpen, setFabOpen] = useState(false)
  const [fullImageVisible, setFullImageVisible] = useState(false)

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

  const handleEdit = () => {
    router.push({
      pathname: `/(app)/(auth)/outfit/edit`,
      params: {
        id: id,
      },
    })
    if (onClose) onClose()
  }

  const handleDelete = async () => {
    if (id && outfit?.fileID) {
      await databaseService.deleteOutfit(id, outfit.fileID)
      if (onClose) onClose()
    }
  }

  if (loading) {
    return <Loading />
  }

  return (
    <View className="flex-1 shadow-xl shadow-black">
    <View style={styles.container}>
      {/* Fullscreen Image Modal */}
      <Modal
        visible={fullImageVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setFullImageVisible(false)}
      >
        <View style={styles.fullImageModalContainer}>
          <TouchableOpacity
            style={styles.fullImageCloseButton}
            onPress={() => setFullImageVisible(false)}
            activeOpacity={0.7}
          >
            <AntDesign name="close" size={24} color="white" />
          </TouchableOpacity>
          
          {outfit?.imageUrl && (
            <Image
              source={{ uri: outfit.imageUrl }}
              style={styles.fullSizeImage}
              resizeMode="contain"
            />
          )}
        </View>
      </Modal>

      {/* Main image */}
      <View style={styles.imageContainer}>
        {/* View full image button */}
        {outfit?.imageUrl && (
          <TouchableOpacity
            style={styles.fullImageButton}
            activeOpacity={0.7}
            onPress={() => setFullImageVisible(true)}
          >
            <View style={styles.fullImageButtonInner}>
              <Feather name="maximize" size={22} color="white" />
              <Text style={styles.fullImageButtonText}>Full image</Text>
            </View>
          </TouchableOpacity>
        )}
        <Image source={{ uri: outfit?.imageUrl }} style={styles.image} resizeMode="cover" />
      </View>


      {/* Info grid */}
      <View style={styles.infoGrid}>
        <View style={styles.infoRow}>
          <InfoItem label="Item Name" value={outfit?.outfitName || ""} />
        </View>

        <View style={styles.infoRow}>
          <InfoItem label="Brand" value={outfit?.brand || ""} />
        </View>

        <View style={styles.infoRow}>
          <InfoItem label="Size" value={outfit?.size || ""} />
          <InfoItem label="Material" value={outfit?.material || ""} />
        </View>

        <View style={styles.infoRow}>
          <InfoItem label="Theme" value={outfit?.attireTheme || ""} />
          <InfoItem label="Type" value={outfit?.garmentType || ""} />
        </View>
      </View>

      {/* CustomFab */}
      <SpeedDial
        isOpen={fabOpen}
        icon={<Feather name="menu" size={24} color="white" />}
        openIcon={<Feather name="x" size={24} color="white" />}
        onOpen={() => setFabOpen(!fabOpen)}
        onClose={() => setFabOpen(!fabOpen)}
        overlayColor="transparent"
        buttonStyle={{
          backgroundColor: "black",
          shadowColor: "black",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.3,
          shadowRadius: 3,
          elevation: 5,
        }}
        style={styles.speedDial}
      >
        <SpeedDial.Action
          icon={<Feather name="trash" size={20} color="white" />}
          buttonStyle={{ backgroundColor: "black" }}
          onPress={handleDelete}
        />
        <SpeedDial.Action
          icon={<Feather name="edit-2" size={20} color="white" />}
          buttonStyle={{ backgroundColor: "black" }}
          onPress={handleEdit}
        />
      </SpeedDial>
    </View>
  </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    shadowColor: "black",
    shadowOffset: { width: 10, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
    backgroundColor: 'rgba(0,0,0,0.8)',
  },
  fullImageModalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullImageCloseButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullSizeImage: {
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH * 1.2,
  },
  fullImageButton: {
    position: 'absolute',
    top: 10,
    left: 10,
    zIndex: 10,
    padding: 5,
  },
  fullImageButtonInner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 8,
    padding: 8,
  },
  fullImageButtonText: {
    color: 'white',
    fontSize: 12,
    marginLeft: 5,
    fontWeight: '500',
  },
  imageContainer: {
    width: "100%",
    aspectRatio: 1,
    backgroundColor: "#ddd",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  outfitListContainer: {
    paddingVertical: 15,
    backgroundColor: "#fff",
    
  },
  outfitListContent: {
    paddingHorizontal: 15,
  },
  outfitThumbnailContainer: {
    width: 60,
    height: 60,
    marginRight: 10,
    borderRadius: 8,
    overflow: "hidden",
    borderWidth: 0,
    borderColor: "transparent",
  },
  selectedThumbnail: {
    borderWidth: 2,
    borderColor: "black",
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  outfitThumbnail: {
    width: "100%",
    height: "100%",
  },
  infoGrid: {
    padding: 15,
    backgroundColor: "#fff",

    flex: 1,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  infoItem: {
    flex: 1,
    marginHorizontal: 5,
  },
  infoLabel: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    color: "#000",
  },
  speedDial: {
    position: "absolute",
    bottom: 16,
    right: 16,
  },
})

{
  /* <View style={styles.outfitListContainer}>
        <FlatList
          data={outfits}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item, index }) => (
            <View style={[styles.outfitThumbnailContainer, currentIndex === index ? styles.selectedThumbnail : null]}>
              <Image source={{ uri: item.imageUrl }} style={styles.outfitThumbnail} resizeMode="cover" />
            </View>
          )}
          keyExtractor={(item) => item.$id}
          contentContainerStyle={styles.outfitListContent}
        />
      </View> */
}