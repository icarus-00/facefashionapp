import { Image, Text, View, Dimensions, TouchableOpacity, StyleSheet, Modal, GestureResponderEvent } from "react-native";
import { router, useFocusEffect } from "expo-router";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import databaseService, { ActorWithImage } from "@/services/database/db";
import { useCallback, useEffect, useState } from "react";
import { Center } from "@/components/ui/center";
import { Spinner } from "@/components/ui/spinner";
import {
  AntDesign,
  MaterialIcons,
  Feather,
  Ionicons,
} from "@expo/vector-icons";
import useStore from "@/store/lumaGeneration/useStore";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  FadeIn,
} from "react-native-reanimated";
import Carousel from 'react-native-reanimated-carousel';
import { LinearGradient } from "expo-linear-gradient";
import { BR } from "@expo/html-elements";

const { width, height } = Dimensions.get('window');
const AnimatedScrollView = Animated.createAnimatedComponent(Animated.ScrollView);

const LoadingSpinner = () => (
  <Center style={{ flex: 1, width: '100%', height: '100%' }}>
    <Spinner size="large" />
  </Center>
);

export default function GetActor({
  paramid,
  onClose,
}: {
  paramid?: string;
  onClose?: () => void;
}) {
  const [actor, setActor] = useState<ActorWithImage>();
  const [loading, setLoading] = useState(true);
  const [fullImageVisible, setFullImageVisible] = useState(false);
  const { userId, updateActorItems } = useStore();
  const [activeSlide, setActiveSlide] = useState(0);
  const [refreshKey, setRefreshKey] = useState(0); // Add a refresh key state to force re-render

  // Button scale animations
  const buttonScale = useSharedValue(1);
  const editScale = useSharedValue(1);
  const deleteScale = useSharedValue(1);

  // Handle animation for button press
  const animateButton = (scale: Animated.SharedValue<number>) => {
    scale.value = withSpring(0.95, { damping: 10 });
    setTimeout(() => {
      scale.value = withSpring(1, { damping: 10 });
    }, 100);
  };

  

  // Button animation styles
  const buttonAnimStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: buttonScale.value }]
    };
  });
  
  // Full image view button scale
  const viewImageScale = useSharedValue(1);
  const viewImageAnimStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: viewImageScale.value }]
    };
  });

  const editAnimStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: editScale.value }]
    };
  });

  const deleteAnimStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: deleteScale.value }]
    };
  });

  // Memoize the close handler to improve performance
  const handleClose = useCallback(() => {
    if (onClose) onClose();
  }, [onClose]);

  // Create a fetchData function that can be reused
  const fetchData = useCallback(async (): Promise<void> => {
    setLoading(true);
    try {
      if (paramid) {
        const data = await databaseService.getActor(paramid);
        setActor(data);
        console.log("Actor data refreshed:", data.actorName);
      }
    } catch (error) {
      console.error("Error fetching actor: ", error);
    } finally {
      setLoading(false);
    }
  }, [paramid]);

  // Initial load effect
  useEffect(() => {
    fetchData();
  }, [fetchData]);
  
  // This effect runs every time the screen comes into focus
  useFocusEffect(
    useCallback(() => {
      // Increment the refresh key to trigger a re-render
      setRefreshKey(prev => prev + 1);
      // Refresh the actor data when the screen comes back into focus
      fetchData();
      
      return () => {
        // Cleanup if needed
      };
    }, [fetchData])
  );

  const handleDelete = async () => {
    animateButton(deleteScale);

    try {
      if (actor?.$id) {
        await databaseService.deleteActor(actor.$id, actor.fileID);
        if (onClose) onClose();
      }
    } catch (error) {
      console.error("Error deleting actor:", error);
    }
  };

  const handleEdit = () => {
    animateButton(editScale);

    if (actor?.$id) {
      router.push({
        pathname: "/(app)/(auth)/actor/edit",
        params: { id: actor?.$id },
      });
      if (onClose) onClose();
    }
  };

  const handleDressUp = async () => {
    animateButton(buttonScale);

    try {
      if (actor?.$id && actor?.imageUrl) {
        await updateActorItems(actor.fileID, actor.imageUrl, actor.actorName, actor.age, actor.width, actor.height, actor.bio, actor.gender, actor.genre);
        router.push("/(app)/(auth)/(tabs)/outfit");
        if (onClose) onClose();
      }
    } catch (error) {
      console.error("Error in dress up:", error);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  // Function to prevent all gestures except within the scrollview
  const preventDrag = (event: GestureResponderEvent) => {
    // Prevent default gesture behavior
    return true;
  };

  return (
    <View 
      style={styles.container} 
      onStartShouldSetResponder={preventDrag}
      onMoveShouldSetResponder={preventDrag}
      onResponderTerminationRequest={() => false}
      onResponderReject={() => {}}>
      {/* Fullscreen Image Modal */}
      <Modal
        visible={fullImageVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setFullImageVisible(false)}
        statusBarTranslucent={true}
      >
        <View style={styles.fullImageModalContainer}>
          <TouchableOpacity
            style={styles.fullImageCloseButton}
            onPress={() => setFullImageVisible(false)}
            activeOpacity={0.7}
          >
            <AntDesign name="close" size={24} color="white" />
          </TouchableOpacity>
          
          {actor?.imageUrl && (
            <Image
              source={{ uri: actor.imageUrl }}
              style={styles.fullSizeImage}
              resizeMode="contain"
            />
          )}
        </View>
      </Modal>
      
      {/* Close button */}
      <TouchableOpacity
        style={styles.closeButton}
        onPress={handleClose}
        activeOpacity={0.7}
        hitSlop={{ top: 15, right: 15, bottom: 15, left: 15 }}
      >
        <AntDesign name="close" size={20} color="black" />
      </TouchableOpacity>

        <View 
          style={styles.contentContainer} 
          onStartShouldSetResponder={preventDrag}
          onMoveShouldSetResponder={preventDrag}
          onResponderTerminationRequest={() => false}>
          {/* Actor image section */}
          <View style={styles.imageContainer}>
            {/* View full image button */}
            {actor?.imageUrl && (
              <TouchableOpacity
                style={styles.fullImageButton}
                activeOpacity={0.7}
                onPress={() => {
                  animateButton(viewImageScale);
                  setFullImageVisible(true);
                }}
              >
                <Animated.View style={[viewImageAnimStyle, styles.fullImageButtonInner]}>
                  <Feather name="maximize" size={22} color="white" />
                  <Text style={styles.fullImageButtonText}>Full image</Text>
                </Animated.View>
              </TouchableOpacity>
            )}
            
            {actor?.imageUrl ? (
              <Image
                source={{ uri: actor.imageUrl }}
                style={styles.actorImage}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.noImageContainer}>
                <Text style={styles.noImageText}>No image available</Text>
              </View>
            )}

            {/* Name overlay with gradient */}
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.5)', 'rgba(0,0,0,0.8)']}
              style={styles.nameOverlay}
            >
              <Animated.Text
                entering={FadeIn.delay(300).duration(500)}
                style={styles.actorName}
              >
                {actor?.actorName}
              </Animated.Text>
            </LinearGradient>
          </View>

        {/* Details section - scrollable */}
          <View style={styles.detailsWrapper}>
          <AnimatedScrollView
              entering={FadeIn.duration(300)}
              style={styles.detailsContainer}
              showsVerticalScrollIndicator={true}
              scrollEnabled={true}
              scrollEventThrottle={16}
              horizontal={false}
              bounces={true}
              contentContainerStyle={styles.scrollContent}
              overScrollMode="always"
              nestedScrollEnabled={true}
              // Ensure scrollview is the only part that responds to touch
              onStartShouldSetResponder={() => true}
              onStartShouldSetResponderCapture={() => true}
              onMoveShouldSetResponder={() => true}
              onMoveShouldSetResponderCapture={() => true}
              onResponderTerminationRequest={() => false}
              // Allow scrolling only within this component
              onResponderGrant={(e) => {
                // Prevent the event from bubbling up
                e.stopPropagation();
              }}
            >
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Bio</Text>
                <Text style={styles.aboutText}>
                  {actor?.bio || "No biography available for this actor."}
                </Text>
              </View>

              <View style={styles.sectionContainer}>
                {/* <Text style={styles.sectionTitle}>Details</Text> */}
                <View style={styles.detailsBox}>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>ID</Text>
                    <Text style={styles.detailValue}>
                      {actor?.$id?.substring(0, 8) + "..." || "N/A"}
                    </Text>
                  </View>
                  <View className="flex-row mt-2">
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Age</Text>
                    <Text style={styles.detailValue}>
                      {actor?.age || 'Not specified'}
                    </Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Gender</Text>
                    <Text style={styles.detailValue}>
                      {actor?.gender || 'Not specified'}
                    </Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Height</Text>
                    <Text style={styles.detailValue}>
                      {actor?.height ? `${actor.height} cm` : 'Not specified'}
                    </Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Weight</Text>
                    <Text style={styles.detailValue}>
                      {actor?.weight ? `${actor.weight} kg` : 'Not specified'}
                    </Text>
                  </View>
                  </View>
                  
                    <View style={styles.genreSection}>
                      <Text style={styles.detailLabel}>Genre</Text>
                      <View style={styles.genreContainer}>
                        <View style={styles.genreTag}>
                          <Text style={styles.genreTagText}>{actor?.genre}</Text>
                        </View>
                      </View>
                    </View>
                </View>
              </View>

              <View style={styles.buttonRow}>
                <Animated.View style={[styles.buttonWrapper, editAnimStyle]}>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.editButton]}
                    onPress={handleEdit}
                    activeOpacity={0.8}
                  >
                    <HStack space="md" style={{ alignItems: 'center' }}>
                      <Feather name="edit-2" size={16} color="white" />
                      <Text style={styles.buttonText}>Edit</Text>
                    </HStack>
                  </TouchableOpacity>
                </Animated.View>

                <Animated.View style={[styles.buttonWrapper, deleteAnimStyle]}>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.deleteButton]}
                    onPress={handleDelete}
                    activeOpacity={0.8}
                  >
                    <HStack space="md" style={{ alignItems: 'center' }}>
                      <Feather name="trash-2" size={16} color="white" />
                      <Text style={styles.buttonText}>Delete</Text>
                    </HStack>
                  </TouchableOpacity>
                </Animated.View>
              </View>

              <Animated.View style={[styles.dressUpWrapper, buttonAnimStyle]}>
                <TouchableOpacity
                  style={styles.dressUpButton}
                  onPress={handleDressUp}
                  activeOpacity={0.7}
                >
                  <HStack space="md" style={{ alignItems: 'center', justifyContent: 'center'}}>
                    <Text style={styles.dressUpText}>Dress Up!</Text>
                  </HStack>
                </TouchableOpacity>
              </Animated.View>
          </AnimatedScrollView>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: 40,
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
    width: width,
    height: height * 0.8,
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

  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 10,
    width: 32,
    height: 32,
    borderBlockColor: 'black',
    // borderWidth: 2,
    borderRadius: 18,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  contentContainer: {
    flex: 1,
    marginTop: 0,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
  },
  imageContainer: {
    height: '43%',
    width: '100%',
    position: 'relative',
    overflow: 'hidden',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  actorImage: {
    width: '100%',
    height: '100%',
  },
  noImageContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  noImageText: {
    color: '#666',
    fontSize: 16,
  },
  nameOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingVertical: 20,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  actorName: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
    marginBottom: 20,
  },
  detailsWrapper: {
    flex: 1,
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    // Ensure this section captures all touch events
    zIndex: 1,
  },
  detailsContainer: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 24,
  },
  scrollContent: {
    paddingTop: 24,
    paddingBottom: 100,
  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 8,
    fontWeight: 'bold',
    color: '#333',
  },
  aboutText: {
    fontSize: 15,
    lineHeight: 22,
    color: '#555',
  },
  genreSection: {
    marginTop: 16,
  },
  genreContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
    gap: 8,
  },
  genreTag: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: '#000',
    marginRight: 8,
    marginBottom: 8,
  },
  genreTagText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },

  detailsBox: {
    flexDirection: 'column',
    flexWrap: 'wrap',
    columnGap: 16,
    backgroundColor: '#f7f7f7',
    padding: 16,
    borderRadius: 12,
  },
  detailItem: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 14,
    color: '#777',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 15,
    fontWeight: '500',
    color: '#333',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  buttonWrapper: {
    flex: 1,
    alignItems: 'center',
  },
  actionButton: {
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editButton: {
    backgroundColor: "#d1d5db",
    borderRadius: 10,
    width: "80%",
  },
  deleteButton: {
    backgroundColor: '#e74c3c',
    borderRadius: 10,
    width: "80%",
  },
  buttonText: {
    color: 'white',
    fontWeight: '500',
    fontSize: 15,
  },
  dressUpWrapper: {
    width: '100%',
    alignItems: 'center',
  },
  dressUpButton: {
    backgroundColor: 'black',
    paddingVertical: 20,
    borderRadius: 32,
    width: "70%",
    alignItems: 'center',
    justifyContent: 'center',
  },
  dressUpText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
});
