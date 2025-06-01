import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Badge, BadgeText, ThirdPartyBadgeIcon } from "@/components/ui/badge";
import { useVideoPlayer, VideoView, TimeUpdateEvent } from "expo-video";
import { useEvent } from "expo";

interface VideoPlayerProps {
  videoUri: string;
  height: number;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  videoUri,
  height,
}) => {
  const [isControlsVisible, setIsControlsVisible] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const player = useVideoPlayer(videoUri, (player) => {
    player.loop = true;
  });

  const { isPlaying: playerIsPlaying } = useEvent(player, "playingChange", {
    isPlaying: player.playing,
  });

  useEvent(player, "timeUpdate", (event: TimeUpdateEvent) => {
    setCurrentTime(event.currentTime);
    setDuration(event.duration);
  });

  useEffect(() => {
    setIsPlaying(playerIsPlaying);
  }, [playerIsPlaying]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const showControlsTemporarily = () => {
    setIsControlsVisible(true);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setIsControlsVisible(false);
    }, 3000);
  };

  const togglePlay = () => {
    if (isPlaying) {
      player.pause();
    } else {
      player.play();
    }
    showControlsTemporarily();
  };

  const handleSeek = (value: number) => {
    player.seekBy(value * duration);
    showControlsTemporarily();
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    showControlsTemporarily();
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <View style={{ width: "100%", height }} className="p-5">
      <TouchableOpacity
        activeOpacity={1}
        onPress={showControlsTemporarily}
        className="w-full h-full"
      >
        <VideoView
          style={{ width: "100%", height: "100%", borderRadius: 12 }}
          player={player}
          allowsFullscreen={true}
          allowsPictureInPicture={true}
        />

        <Badge
          className="z-10"
          style={{ position: "absolute", top: 16, right: 16 }}
        >
          <ThirdPartyBadgeIcon
            icon={Ionicons}
            iconProps={{ name: "videocam" }}
            color="black"
          />
          <BadgeText style={{ fontSize: 12 }}>Video</BadgeText>
        </Badge>

        {!isPlaying && !isControlsVisible && (
          <TouchableOpacity style={styles.playButton} onPress={togglePlay}>
            <Ionicons name="play" size={48} color="white" />
          </TouchableOpacity>
        )}

        {isControlsVisible && (
          <View style={styles.controls}>
            <View style={styles.topControls}>
              <Text style={styles.timeText}>
                {formatTime(currentTime)} / {formatTime(duration)}
              </Text>
              <TouchableOpacity onPress={toggleFullscreen}>
                <Ionicons
                  name={isFullscreen ? "contract" : "expand"}
                  size={24}
                  color="white"
                />
              </TouchableOpacity>
            </View>

            <View style={styles.centerControls}>
              <TouchableOpacity onPress={togglePlay}>
                <Ionicons
                  name={isPlaying ? "pause" : "play"}
                  size={48}
                  color="white"
                />
              </TouchableOpacity>
            </View>

            <View style={styles.progressContainer}>
              <View style={styles.progressBackground}>
                <View
                  style={[
                    styles.progressFill,
                    { width: `${progressPercentage}%` },
                  ]}
                />
              </View>
              <View
                style={[
                  styles.progressHandle,
                  { left: `${progressPercentage}%` },
                ]}
              />
            </View>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  playButton: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -24 }, { translateY: -24 }],
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 40,
    width: 80,
    height: 80,
    justifyContent: "center",
    alignItems: "center",
  },
  controls: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    padding: 16,
    height: 140,
    justifyContent: "space-between",
  },
  topControls: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  centerControls: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  timeText: {
    color: "white",
    fontSize: 14,
  },
  progressContainer: {
    width: "100%",
    height: 20,
    position: "relative",
    justifyContent: "center",
  },
  progressBackground: {
    height: 4,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 2,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#3b82f6",
    borderRadius: 2,
  },
  progressHandle: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#3b82f6",
    position: "absolute",
    top: 2,
    marginLeft: -8,
  },
});
