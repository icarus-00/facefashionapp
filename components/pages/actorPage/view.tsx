import React, { useState, useEffect, useCallback } from "react";
import { View, Dimensions, TouchableOpacity, Text, FlatList } from "react-native";
import databaseService, { ActorWithImage } from "@/services/database/db";
import { Button, ButtonText, ButtonIcon } from "@/components/ui/button";
import { AddIcon } from "@/components/ui/icon";
import { router } from "expo-router";
import { VStack } from "@/components/ui/vstack";
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
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

// Create a union type for actor data items
type ActorItem = ActorWithImage | { id: number; isPlaceholder: true };

export default function ActorPageComp(): React.JSX.Element {
  const [visible, setVisible] = useState(false);
  const [selectedActor, setSelectedActor] = useState<ActorWithImage | null>(null);
  const [actors, setActors] = useState<ActorWithImage[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [activeFilter, setActiveFilter] = useState<string>("all");
  
  // Animation values
  const headerOpacity = useSharedValue(0);
  
  useEffect(() => {
    // Entrance animations
    headerOpacity.value = withDelay(300, withTiming(1, { duration: 800 }));
  }, [headerOpacity]);
  
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

  return (
    <View className="flex-1 bg-white">
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
          data={displayData}
          numColumns={2}
          contentContainerStyle={{
            alignItems: 'center',
            paddingHorizontal: spacing / 2,

          }}
          renderItem={({ item, index }) => (
            <Animated.View 
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
          </View>
    </View>
  );
}
