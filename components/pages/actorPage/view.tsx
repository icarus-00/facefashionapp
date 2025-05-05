import React, { useState, useEffect, useCallback } from "react";
<<<<<<< HEAD
import { View, Dimensions, TouchableOpacity, Text, FlatList } from "react-native";
import databaseService, { ActorWithImage } from "@/services/database/db";
import { Button, ButtonText, ButtonIcon } from "@/components/ui/button";
import { AddIcon } from "@/components/ui/icon";
import { router } from "expo-router";
=======
import { View, Image, Dimensions, Pressable, FlatList, TouchableOpacity } from "react-native";
import { Text } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { Skeleton } from "@/components/ui/skeleton";
import { Box } from "@/components/ui/box";
import databaseService, { ActorWithImage } from "@/services/database/db";
import { Button, ButtonText, ButtonIcon } from "@/components/ui/button";
import { AddIcon } from "@/components/ui/icon";
import { router, useRouter } from "expo-router";
import GetActor from "./actions/get";
import Modal from "react-native-modal";
import { LinearGradient } from "expo-linear-gradient";
import { HStack } from "@/components/ui/hstack";
>>>>>>> 1f8269efac2356a6a9cf697b823029dd810d29bf
import { VStack } from "@/components/ui/vstack";
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
<<<<<<< HEAD
  interpolate,
  FadeIn,
  withDelay,
} from "react-native-reanimated";

// Import our new components
import FilterBar, { FilterOption } from "@/components/molecules/FilterBar";
import ActorCard, { ActorInfo } from "@/components/molecules/ActorCard";
import ActorModal from "@/components/molecules/ActorModal";

// Define types for our data
const { width: screenWidth } = Dimensions.get("screen");
const numColumns = 2;
const spacing = 16; // Increased spacing for better visual appearance
const itemWidth = (screenWidth) / numColumns - spacing; // Adjusted calculation for larger cards
const itemHeight = itemWidth * 1.6; // Increased height ratio for taller cards
=======
  withSequence,
  withDelay,
  withSpring,
  interpolate,
  FadeIn,
  ZoomIn,
} from "react-native-reanimated";

// Define types for our data
const { width: screenWidth } = Dimensions.get("screen");
const numColumns = 2;
const spacing = 12; // Increased spacing for better visual appearance
const itemWidth = (screenWidth - spacing * (numColumns + 3)) / numColumns; // Additional spacing for more margin
const itemHeight = itemWidth * 1.5;

// Define default image
const DEFAULT_IMAGE = "https://placehold.co/900x1600";
>>>>>>> 1f8269efac2356a6a9cf697b823029dd810d29bf

// Create a union type for actor data items
type ActorItem = ActorWithImage | { id: number; isPlaceholder: true };

<<<<<<< HEAD
=======
// Props for ActorCard component
interface ActorCardProps {
  item: ActorItem;
  loading: boolean;
  index: number;
}

const AnimatedBox = Animated.createAnimatedComponent(Box);
const AnimatedView = Animated.createAnimatedComponent(View);
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const ModalComponent = ({
  id,
  visible,
  onPress,
}: {
  id: string;
  visible: boolean;
  onPress: () => void;
}) => {
  return (
    <Modal
      accessible
      animationIn="slideInUp"
      animationOut="slideOutDown"
      swipeThreshold={50}
      isVisible={visible}
      onBackButtonPress={onPress}
      swipeDirection={"down"}
      onSwipeComplete={onPress}
    >
      <GetActor paramid={id} onClose={onPress} />
    </Modal>
  );
};

>>>>>>> 1f8269efac2356a6a9cf697b823029dd810d29bf
export default function ActorPageComp(): React.JSX.Element {
  const [visible, setVisible] = useState(false);
  const [selectedActor, setSelectedActor] = useState<ActorWithImage | null>(null);
  const [actors, setActors] = useState<ActorWithImage[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
<<<<<<< HEAD
  const [activeFilter, setActiveFilter] = useState<string>("all");
  
  // Animation values
  const headerOpacity = useSharedValue(0);
=======
  
  // Animation values
  const headerOpacity = useSharedValue(0);
  const cardScale = useSharedValue(0.95);
>>>>>>> 1f8269efac2356a6a9cf697b823029dd810d29bf
  
  useEffect(() => {
    // Entrance animations
    headerOpacity.value = withDelay(300, withTiming(1, { duration: 800 }));
<<<<<<< HEAD
  }, [headerOpacity]);
=======
    cardScale.value = withDelay(200, withSpring(1, { damping: 12, stiffness: 90 }));
  }, []);
>>>>>>> 1f8269efac2356a6a9cf697b823029dd810d29bf
  
  // Header animation
  const headerAnimStyle = useAnimatedStyle(() => {
    return {
      opacity: headerOpacity.value,
      transform: [{ translateY: interpolate(headerOpacity.value, [0, 1], [-20, 0]) }]
    };
  });

  const fetchData = useCallback(async (): Promise<void> => {
    try {
      const data = await databaseService.listActors();
      setActors(data);
    } catch (error) {
      console.error("Error fetching actors: ", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Only call fetchData on initial mount and manual refreshes
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Handle refresh separately without retriggering the useEffect
  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData();
  }, [fetchData]);

<<<<<<< HEAD
  // Handle actor selection for modal
  const handleActorPress = (actor: ActorInfo) => {
    // Find the complete actor data
    const selectedActor = actors.find(a => a.$id === actor.$id);
    if (selectedActor) {
      setSelectedActor(selectedActor);
      setVisible(true);
    }
  };

  // Handle modal close
  function handleClose(): void {
    setVisible(false);
    setSelectedActor(null);
  }

  // Handle navigation to edit page
  const handleEditActor = () => {
    if (selectedActor) {
      router.push({ 
        pathname: "/(app)/(auth)/actor/edit",
        params: { id: selectedActor.$id }
      });
      handleClose();
    }
=======
  // Actor card component with placeholder
  function ActorCard({
    item,
    loading,
    index,
  }: ActorCardProps): React.JSX.Element {
    const [fallbackImage, setFallbackImage] = useState<boolean>(false);
    const router = useRouter();
    // Check if item is a placeholder
    const isPlaceholder = "isPlaceholder" in item;
    
    const itemCardScale = useSharedValue(0.95);
    
    useEffect(() => {
      // Staggered animation for cards
      itemCardScale.value = withDelay(index * 100 + 200, withSpring(1, { damping: 12, stiffness: 90 }));
    }, []);
    
    const cardAnimStyle = useAnimatedStyle(() => {
      return {
        transform: [{ scale: itemCardScale.value }],
        opacity: interpolate(itemCardScale.value, [0.95, 1], [0.5, 1])
      };
    });

    // Safe way to get actor name
    const getActorName = (): string => {
      if (isPlaceholder) return "Loading...";
      return item.actorName || "Unknown Actor";
    };

    // Safe way to render image
    const renderActorImage = (): React.JSX.Element => {
      if (loading || isPlaceholder) {
        return (
          <Skeleton variant="sharp" style={{ width: "100%", height: "100%" }} />
        );
      }

      try {
        // Use the imageUrl from ActorWithImage
        const actorItem = item as ActorWithImage;
        return (
          <Image
            source={{ uri: fallbackImage ? DEFAULT_IMAGE : actorItem.imageUrl }}
            style={{ width: "100%", height: "100%" }}
            resizeMode="cover"
            onError={() => setFallbackImage(true)}
          />
        );
      } catch (error) {
        console.error("Image rendering error:", error);
        return (
          <View className="flex-1 w-full h-full bg-gray-200 justify-center items-center">
            <Text className="text-gray-500">Image not available</Text>
          </View>
        );
      }
    };

    return (
      <AnimatedPressable
        style={[cardAnimStyle]}
        className="overflow-hidden rounded-xl shadow-lg elevation-3"
        onPress={() => {
          if (!("isPlaceholder" in item)) {
            itemCardScale.value = withSequence(
              withTiming(0.97, { duration: 100 }),
              withSpring(1, { damping: 4, stiffness: 300 })
            );
            setModalId(item.$id);
            setVisible(true);
          }
        }}
      >
        <Box
          className="bg-background-50 rounded-xl overflow-hidden"
          style={{ width: itemWidth, height: itemHeight }}
        >
          <View style={{ width: "100%", height: "100%" }}>
            {renderActorImage()}
          </View>
          
          {/* Gradient overlay */}
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.8)']}
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: 60,
              justifyContent: 'flex-end',
              paddingHorizontal: 10,
              paddingBottom: 8
            }}
          >
            <Text className="text-white font-semibold text-base">{getActorName()}</Text>
          </LinearGradient>
        </Box>
      </AnimatedPressable>
    );
  }

  const TabBar = (): React.JSX.Element => {
    const [selectedTab, setSelectedTab] = useState<string>("All");

    const handleTabPress = (tab: string): void => {
      setSelectedTab(tab);
    };

    return (
      <AnimatedView 
        style={[headerAnimStyle]} 
        className="py-3 px-4 bg-white"
      >
        <HStack className="justify-between items-center mb-3">
          <Text className="text-2xl font-bold text-gray-800">Actors Gallery</Text>
          
          {/* Add button moved to top right */}
          <Animated.View entering={ZoomIn.delay(600).duration(300)}>
            <TouchableOpacity
              className="h-10 w-10 bg-primary-500 rounded-full justify-center items-center"
              onPress={() => {
                router.push({ pathname: "/(app)/(auth)/actor/create" });
              }}
            >
              <Text className="text-white mb-1 font-medium text-2xl">+</Text>
            </TouchableOpacity>
          </Animated.View>
        </HStack>
        
        <HStack space="md" className="overflow-visible">
          <ScrollFlatList
            data={["All", "Popular", "Top Rated", "Upcoming", "Recent"]}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingRight: 20 }}
            renderItem={({ item }: { item: string }) => (
              <TouchableOpacity
                onPress={() => handleTabPress(item)}
                className={`py-2 px-4 mr-2 rounded-full ${
                  selectedTab === item ? "bg-primary-500" : "bg-gray-100"
                }`}
              >
                <Text
                  className={`font-medium ${
                    selectedTab === item ? "text-white" : "text-gray-700"
                  }`}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item}
          />
        </HStack>
      </AnimatedView>
    );
>>>>>>> 1f8269efac2356a6a9cf697b823029dd810d29bf
  };

  // Filter options for FilterBar
  const filterOptions: FilterOption[] = [
    { id: "all", label: "All" },
    { id: "popular", label: "Popular", icon: "star" },
    { id: "top_rated", label: "Top Rated", icon: "trophy" },
    { id: "upcoming", label: "Upcoming", icon: "calendar" },
    { id: "recent", label: "Recent", icon: "clock-o" },
  ];

  // Add button component for the FilterBar
  const AddButton = (
    <TouchableOpacity
      className="h-10 w-10 bg-primary-500 rounded-full justify-center items-center"
      onPress={() => {
        router.push({ pathname: "/(app)/(auth)/actor/create" });
      }}
    >
      <Text className="text-white mb-1 font-medium text-2xl">+</Text>
    </TouchableOpacity>
  );

  // Generate placeholder data with proper typing
  const getPlaceholderData = (): ActorItem[] => {
    return Array.from({ length: 8 }, (_, index) => ({
      id: index,
      isPlaceholder: true,
    }));
  };

  // Apply active filter to the data
  const filterActors = useCallback((data: ActorWithImage[]) => {
    if (activeFilter === "all") return data;
    
    // In a real app, you would implement actual filtering logic here
    // For now, we'll just return the data as is
    return data;
  }, [activeFilter]);

  const displayData: ActorItem[] = loading ? getPlaceholderData() : filterActors(actors);

  // Component to replace regular FlatList for types
  const ScrollFlatList = ({ ...props }: FlatList['props']) => (
    <FlatList {...props} />
  );

  return (
    <View className="flex-1 bg-white">
<<<<<<< HEAD
      {/* Actor Modal */}
      {selectedActor && (
        <ActorModal
          actorName={selectedActor.actorName}
          imageUrl={selectedActor.imageUrl}
          fileID={selectedActor.fileID}
          age={selectedActor.age}
          height={selectedActor.height}
          weight={selectedActor.weight}
          bio={selectedActor.bio}
          isVisible={visible}
          onClose={handleClose}
          onEdit={handleEditActor}
          />
        )}
      
        {/* Filter Bar */}
        <FilterBar
          options={filterOptions}
          onFilterChange={setActiveFilter}
          initialFilter="all"
          title="Actors Gallery"
          rightComponent={AddButton}
          containerStyle={headerAnimStyle}
          showIcons={true}
          />
        
        {/* Actor Cards Grid */}
        <View className="flex-1 mt-4">
        <FlatList
=======
      <ModalComponent id={modalid} visible={visible} onPress={handleClose} />
      <VStack className="flex-1">
        <TabBar />
        <FlashList
>>>>>>> 1f8269efac2356a6a9cf697b823029dd810d29bf
          data={displayData}
          numColumns={2}
          contentContainerStyle={{
            alignItems: 'center',
            paddingHorizontal: spacing / 2,

          }}
          renderItem={({ item, index }) => (
            <Animated.View 
<<<<<<< HEAD
            entering={FadeIn.delay(index * 100).duration(300)}
            // style={{ margin: spacing }}
            className="flex justify-center items-center"
            >
              {/* Use our new ActorCard component */}
              {"isPlaceholder" in item ? (
                <ActorCard
                actor={item}
                loading={loading}
                index={index}
                onPress={() => {}}
                width={itemWidth}
                height={itemHeight}
                />
              ) : (
                <ActorCard
                actor={{
                  $id: item.$id,
                  actorName: item.actorName,
                  imageUrl: item.imageUrl,
                  age: item.age,
                  height: item.height,
                  weight: item.weight,
                  bio: item.bio
                }}
                loading={loading}
                index={index}
                onPress={handleActorPress}
                width={itemWidth}
                height={itemHeight}
                style={{ margin: 6, borderRadius: 16 }}
                />
              )}
=======
              entering={FadeIn.delay(index * 100).duration(300)}
              style={{ margin: spacing }}
              className="flex justify-center items-center"
            >
              <ActorCard item={item} loading={loading} index={index} />
>>>>>>> 1f8269efac2356a6a9cf697b823029dd810d29bf
            </Animated.View>
          )}
          keyExtractor={(item, index) => {
            if ("isPlaceholder" in item) {
              return `placeholder-${item.id}`;
            }
            return item.$id || `item-${index}`;
          }}
<<<<<<< HEAD
=======
          numColumns={numColumns}
          // contentContainerClassName="px-4 pt-1 pb-4" // Increased padding for better spacing
>>>>>>> 1f8269efac2356a6a9cf697b823029dd810d29bf
          showsVerticalScrollIndicator={false}
          refreshing={refreshing}
          onRefresh={handleRefresh}
          ListEmptyComponent={
            <View className="flex-1 justify-center items-center py-20">
              <Text className="text-gray-500 text-lg">No actors found</Text>
              <Button
                className="mt-4 bg-primary-500 rounded-full"
                onPress={() => router.push({ pathname: "/(app)/(auth)/actor/create" })}
<<<<<<< HEAD
                >
=======
              >
>>>>>>> 1f8269efac2356a6a9cf697b823029dd810d29bf
                <ButtonText>Add New Actor</ButtonText>
                <ButtonIcon className="ml-2" as={AddIcon} />
              </Button>
            </View>
          }
          ListFooterComponent={<View style={{ height: 80 }} />}
<<<<<<< HEAD
          />
          </View>
=======
        />
      </VStack>
>>>>>>> 1f8269efac2356a6a9cf697b823029dd810d29bf
    </View>
  );
}
