///components/pages/outfitPage/actions/get.tsx
import { Image, Text, View, StyleSheet, Dimensions, Modal, TouchableOpacity, Alert } from "react-native"
import { router } from "expo-router"
import databaseService, { type OutfitWithImage } from "@/services/database/db"
import { useEffect, useState } from "react"
import { Center } from "@/components/ui/center"
import { Spinner } from "@/components/ui/spinner"
import { Feather, AntDesign } from "@expo/vector-icons"
import { SpeedDial } from "@rneui/themed"
import useStore from "@/store/lumaGeneration/useStore"
import {
  Popover,
  PopoverBody,
  PopoverContent,
} from "@/components/ui/popover"
import { Pressable } from "react-native-gesture-handler"
import { HStack } from "@/components/ui/hstack"

// Define outfit category types locally
type OutfitCategory = "full" | "top" | "bottom" | "accessory";

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
  const { addOutfitItem } = useStore()

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

        {/* Try button */}
        <TouchableOpacity
          style={styles.tryButton}
          onPress={() => {
            if (outfit) {
              // Determine the category based on garment type
              let category: OutfitCategory = "top" as OutfitCategory; // default
              const garmentType = (outfit.garmentType || "").toLowerCase();
              
              if (garmentType.includes('full') || garmentType.includes('dress') || garmentType.includes('suit')) {
                category = 'full' as OutfitCategory;
              } else if (garmentType.includes('top') || garmentType.includes('shirt') || garmentType.includes('blouse')) {
                category = 'top' as OutfitCategory;
              } else if (garmentType.includes('bottom') || garmentType.includes('pant') || garmentType.includes('skirt')) {
                category = 'bottom' as OutfitCategory;
              } else if (garmentType.includes('accessory') || garmentType.includes('hat') || garmentType.includes('jewelry') || 
                        garmentType.includes('necklace') || garmentType.includes('bracelet') || garmentType.includes('earring') || 
                        garmentType.includes('watch') || garmentType.includes('glasses') || garmentType.includes('scarf')) {
                category = 'accessory' as OutfitCategory;
                console.log('Detected as accessory:', outfit.outfitName, outfit.garmentType);
              }
              
              const result = addOutfitItem(
                outfit.fileID,
                category,
                outfit.imageUrl,
                outfit.outfitName,
                outfit.brand,
                outfit.size,
                outfit.material,
                outfit.garmentType,
                outfit.attireTheme
              );
              
              if (result) {
                Alert.alert(
                  "Item Added",
                  `${outfit.outfitName} has been added to your selection.`,
                  [{ text: "OK", onPress: () => onClose && onClose() }]
                );
              }
            }
          }}
          activeOpacity={0.7}
        >
          <HStack space="md" style={{ alignItems: 'center', justifyContent: 'center' }}>
            <Feather name="plus" size={20} color="white" />
            <Text style={styles.tryButtonText}>Add item</Text>
          </HStack>
        </TouchableOpacity>
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
  tryButton: {
    backgroundColor: 'black',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 40,
    marginTop: 20,
    marginHorizontal: "auto",
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  tryButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
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
    bottom: 5,
    right: 5,
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