import React, { useState, useEffect, useCallback } from "react";
import { View, Image, Dimensions, Pressable, FlatList, TouchableOpacity, Text } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { Skeleton } from "@/components/ui/skeleton";
import { Box } from "@/components/ui/box";
import databaseService, { ActorWithImage } from "@/services/database/db";
import { Button, ButtonText, ButtonIcon } from "@/components/ui/button";
import { AddIcon } from "@/components/ui/icon";
import { router, useRouter } from "expo-router";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import Modal from "react-native-modal";
import { LinearGradient } from "expo-linear-gradient";
import GetActor from "./actions/get";
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
  withSequence,
  withDelay,
  withSpring,
  interpolate,
  FadeIn,
  ZoomIn,
} from "react-native-reanimated";

// Import our custom components
import FilterBar, { FilterOption } from "@/components/molecules/FilterBar";
import ActorCard from "@/components/molecules/ActorCard";

// Define types for our data
const { width: screenWidth } = Dimensions.get("screen");
const numColumns = 2;
const spacing = 12;
const itemWidth = (screenWidth - spacing * (numColumns + 2)) / numColumns;
const itemHeight = itemWidth * 1.5;

// Define default image
const DEFAULT_IMAGE = "https://placehold.co/900x1600";

// Create a union type for actor data items
type ActorItem = ActorWithImage | { id: number; isPlaceholder: true };

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

      isVisible={visible}
      onBackButtonPress={onPress}

      propagateSwipe
    >

      <GetActor paramid={id} onClose={onPress} />
    </Modal>
  );
};

export default function ActorPageComp(): React.JSX.Element {
  const [visible, setVisible] = useState(false);
  const [modalId, setModalId] = useState<string>("");
  const [actors, setActors] = useState<ActorWithImage[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [activeGenderFilter, setActiveGenderFilter] = useState<string>("all");

  // Animation values
  const headerOpacity = useSharedValue(0);
  const cardScale = useSharedValue(0.95);

  useEffect(() => {
    // Entrance animations
    headerOpacity.value = withDelay(300, withTiming(1, { duration: 800 }));
    cardScale.value = withDelay(200, withSpring(1, { damping: 12, stiffness: 90 }));
  }, []);

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

  // Actor card component with placeholder
  function ActorCardComponent({
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
        style={[cardAnimStyle, { width: itemWidth, height: itemHeight }]}
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
          style={{ width: 180, height: itemHeight }}
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

  // Handle modal close
  function handleClose(): void {
    setVisible(false);
  }

  const TabBar = (): React.JSX.Element => {
    // Use the activeFilter directly for selectedTab to ensure they stay in sync
    // Convert "all" to "All" for display
    const selectedTab = activeFilter === "all" ? "All" : activeFilter;

    // Define a consistent mapping between tab labels and filter values
    const genderMappings: { [key: string]: string } = {
      "All": "all",
      "Males": "male",
      "Females": "female"
    };

    // Reverse mapping from filter values to tab labels
    const getTabLabelFromFilter = (filter: string): string => {
      if (filter === "all") return "All";
      if (filter === "male") return "Males";
      if (filter === "female") return "Females";
      return "All";
    };

    // Use the activeGenderFilter to determine the selected tab
    const selectedGenderTab = getTabLabelFromFilter(activeGenderFilter);

    // Gender tab selection and filter state are now in sync

    const handleTabPress = (tab: string): void => {
      // Only need to set the filter value, selectedTab will update automatically
      // since it's derived from activeFilter
      const filterValue = tab === "All" ? "all" : tab;
      setActiveFilter(filterValue);
    };

    const handleGenderTabPress = (tab: string): void => {
      // Use the genderMappings to get the correct filter value
      // Get the filter value from the mapping or default to 'all'
      const filterValue = genderMappings[tab] || "all";

      // Update the gender filter, which will automatically update the selected tab
      setActiveGenderFilter(filterValue);
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

        {/* Genre tabs */}
        <HStack space="md" className="overflow-visible mb-3">
          <ScrollFlatList
            data={[
              "All",
              "Action",
              "Comedic",
              "Dramatic",
              "Thrilling",
              "Adventurous",
              "generic"
            ]}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingRight: 20 }}
            renderItem={({ item }: { item: string }) => (
              <TouchableOpacity
                onPress={() => handleTabPress(item)}
                className={`py-2 px-4 mr-2 rounded-full ${selectedTab === item ? "bg-black" : "bg-gray-100"
                  }`}
              >
                <Text
                  className={`font-medium ${selectedTab === item ? "text-white" : "text-gray-700"
                    }`}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item}
          />
        </HStack>

        {/* Gender filter tabs */}
        <HStack space="md" className="overflow-visible">
          <ScrollFlatList
            data={["M / F", "Males", "Females"]}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingRight: 20 }}
            extraData={activeGenderFilter}
            renderItem={({ item }: { item: string }) => (
              <TouchableOpacity
                onPress={() => handleGenderTabPress(item)}
                className={`py-2 px-4 mr-2 rounded-full ${selectedGenderTab === item ? "bg-black" : "bg-gray-200"
                  }`}
              >
                <Text
                  className={`font-medium ${selectedGenderTab === item ? "text-white" : "text-gray-700"
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
  }

  // Genre filter options for FilterBar
  const filterOptions: FilterOption[] = [
    { id: "all", label: "All" },
    { id: "action", label: "Action" },
    { id: "comedic", label: "Comedic" },
    { id: "dramatic", label: "Dramatic" },
    { id: "thrilling", label: "Thrilling" },
    { id: "adventurous", label: "Adventurous" },
    { id: "generic", label: "Generic" },
  ];

  // Generate placeholder data with proper typing
  const getPlaceholderData = (): ActorItem[] => {
    return Array.from({ length: 8 }, (_, index) => ({
      id: index,
      isPlaceholder: true,
    }));
  };

  // Apply active filter to the data
  const filterActors = useCallback((data: ActorWithImage[]) => {
    let filteredData = data;

    // Apply genre filter
    if (activeFilter !== "all") {
      // Filter actors by selected genre
      filteredData = filteredData.filter(actor => {
        if (!actor.genre) return false;

        // Exact match comparison - the genre in the database must match exactly with the selected filter
        // This is important since Appwrite uses enum validation for the genre field
        return actor.genre === activeFilter;
      });
    }

    // Apply gender filter
    if (activeGenderFilter !== "all") {
      // Filter by gender
      filteredData = filteredData.filter(actor => {
        // This assumes there's a gender field in the actor data
        const gender = actor.gender?.toLowerCase() || '';

        // Compare based on gender filter value
        switch (activeGenderFilter) {
          case "male":
            return gender === "male";
          case "female":
            return gender === "female";
          // Removed "kids" option as requested
          default:
            return true;
        }
      });
    }

    return filteredData;
  }, [activeFilter, activeGenderFilter]);

  const displayData: ActorItem[] = loading ? getPlaceholderData() : filterActors(actors);

  // Component to replace regular FlatList for types
  const ScrollFlatList = ({ ...props }: FlatList['props']) => (
    <FlatList {...props} />
  );

  return (
    <View className="flex-1 bg-white">

      <VStack className="flex-1">
        <TabBar />
        <FlatList

          data={displayData}
          numColumns={numColumns}
          contentContainerStyle={{

            paddingRight: 10,
          }}
          renderItem={({ item, index }) => (
            <Animated.View
              entering={FadeIn.delay(index * 100).duration(300)}
              style={{ marginHorizontal: 10, marginVertical: 7 }}
              className="flex justify-center items-center"
            >
              <ActorCardComponent item={item} loading={loading} index={index} />
            </Animated.View>
          )}
          keyExtractor={(item, index) => {
            if ("isPlaceholder" in item) {
              return `placeholder-${item.id}`;
            }
            return item.$id || `item-${index}`;
          }}
          showsVerticalScrollIndicator={false}
          refreshing={refreshing}
          onRefresh={handleRefresh}
          ListEmptyComponent={
            <View className="flex-1 justify-center items-center py-20">
              <Text className="text-gray-500 text-lg">No actors found</Text>
              <Button
                className="mt-4 bg-primary-500 rounded-full"
                onPress={() => router.push({ pathname: "/(app)/(auth)/actor/create" })}
              >
                <ButtonText>Add New Actor</ButtonText>
                <ButtonIcon className="ml-2" as={AddIcon} />
              </Button>
            </View>
          }
          ListFooterComponent={<View style={{ height: 80 }} />}
        />
      </VStack>

      {
        visible &&
        <View className="absolute bottom-0 top-0 right-0 left-0 w-full h-full justify-center items-center">

          <ModalComponent id={modalId} visible={visible} onPress={handleClose} />
        </View>
      }
    </View>
  );
}
