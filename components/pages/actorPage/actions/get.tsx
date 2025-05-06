import { Image, Text, View, Pressable, Dimensions, TouchableOpacity, StyleSheet } from "react-native";
import { router } from "expo-router";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import databaseService, { ActorWithImage } from "@/services/database/db";
import { useEffect, useState, useCallback } from "react";
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
  const { userId, updateActorItems } = useStore();
  const [activeSlide, setActiveSlide] = useState(0);

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

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      setLoading(true);
      try {
        if (paramid) {
          const data = await databaseService.getActor(paramid);
          setActor(data);
        }
      } catch (error) {
        console.error("Error fetching actor: ", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [paramid]);

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
        await updateActorItems(actor.$id, actor.imageUrl);
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

  return (
    <View style={styles.container}>
      {/* Close button */}
      <TouchableOpacity
        style={styles.closeButton}
        onPress={handleClose}
        activeOpacity={0.7}
        hitSlop={{ top: 15, right: 15, bottom: 15, left: 15 }}
      >
        <AntDesign name="close" size={20} color="black" />
      </TouchableOpacity>

      <View style={styles.contentContainer}>
        {/* Actor image section */}
        <View style={styles.imageContainer}>
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

          {/* Name overlay */}
          <View style={styles.nameOverlay}>
            <Animated.Text
              entering={FadeIn.delay(300).duration(500)}
              style={styles.actorName}
            >
              {actor?.actorName}
            </Animated.Text>
          </View>
        </View>

        {/* Details section */}
        <AnimatedScrollView
          entering={FadeIn.duration(300)}
          style={styles.detailsContainer}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          <View style={styles.scrollContent}>
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>About</Text>
              <Text style={styles.aboutText}>
                {actor?.description || "No biography available for this actor."}
              </Text>
            </View>

            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Details</Text>
              <View style={styles.detailsBox}>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>ID</Text>
                  <Text style={styles.detailValue}>
                    {actor?.$id?.substring(0, 8) + "..." || "N/A"}
                  </Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Age</Text>
                  <Text style={styles.detailValue}>
                    {actor?.age || 'Not specified'}
                  </Text>
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
                <HStack space="md" style={{ alignItems: 'center' }}>
                  <Feather name="shopping-bag" size={20} color="white" />
                  <Text style={styles.dressUpText}>
                    Dress Up This Actor
                  </Text>
                </HStack>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </AnimatedScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
    width: 36,
    height: 36,
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
    marginTop: 70,
  },
  imageContainer: {
    height: '45%',
    width: '100%',
    position: 'relative',
    overflow: 'hidden',
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
    height: 80,
    justifyContent: 'center',
    paddingHorizontal: 24,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  actorName: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
  },
  detailsContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  aboutText: {
    fontSize: 15,
    lineHeight: 22,
    color: '#555',
  },
  detailsBox: {
    flexDirection: 'row',
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
    marginBottom: 24,
  },
  buttonWrapper: {
    flex: 1,
    marginHorizontal: 4,
  },
  actionButton: {
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editButton: {
    backgroundColor: '#3498db',
  },
  deleteButton: {
    backgroundColor: '#e74c3c',
  },
  buttonText: {
    color: 'white',
    fontWeight: '500',
    fontSize: 15,
  },
  dressUpWrapper: {
    width: '100%',
    marginBottom: 24,
  },
  dressUpButton: {
    backgroundColor: 'black',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  dressUpText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
});
