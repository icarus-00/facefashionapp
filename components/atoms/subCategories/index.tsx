import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  LayoutChangeEvent,
  Dimensions,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  interpolate,
  runOnJS,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const EXPANDED_HEIGHT = 240; // Static height for expanded overlay
const MAX_CHIP_WIDTH_PERCENTAGE = 0.45; // Maximum width a chip can take (as % of container)

interface ChipMeasurement {
  theme: string;
  width: number;
  measured: boolean;
}

interface SubCategoriesFilterProps {
  themes: string[];
  loading?: boolean;
  selected?: string | string[];
  multiSelect?: boolean;
  onChange: (selection: string | string[]) => void;
}

export default function SubCategoriesFilter({
  themes,
  loading = false,
  selected = [],
  multiSelect = false,
  onChange,
}: SubCategoriesFilterProps) {
  const [expanded, setExpanded] = useState(false);
  const animation = useSharedValue(0);
  const selectedArray = Array.isArray(selected)
    ? selected
    : selected
    ? [selected]
    : [];

  // Container measurements
  const [containerWidth, setContainerWidth] = useState(0);
  const [chipMeasurements, setChipMeasurements] = useState<ChipMeasurement[]>(
    themes.map((theme) => ({ theme, width: 0, measured: false }))
  );
  const [visibleThemes, setVisibleThemes] = useState<string[]>([]);
  const [hiddenThemes, setHiddenThemes] = useState<string[]>([]);
  const [showExpandButton, setShowExpandButton] = useState(false);

  // Update chips when themes change
  useEffect(() => {
    setChipMeasurements(
      themes.map((theme) => {
        const existing = chipMeasurements.find((chip) => chip.theme === theme);
        return existing || { theme, width: 0, measured: false };
      })
    );
  }, [themes]);

  // Calculate visible chips based on container width
  useEffect(() => {
    if (
      containerWidth <= 0 ||
      !chipMeasurements.every((chip) => chip.measured)
    ) {
      return; // Wait until container and all chips are measured
    }

    // Don't recalculate if visibleThemes is already populated and nothing relevant changed
    if (
      visibleThemes.length > 0 &&
      visibleThemes.every((theme) => themes.includes(theme)) &&
      hiddenThemes.every((theme) => themes.includes(theme))
    ) {
      return;
    }

    let availableWidth = containerWidth - 50; // Reserve space for expand button
    const maxChipWidth = containerWidth * MAX_CHIP_WIDTH_PERCENTAGE;

    const visible: string[] = [];
    const hidden: string[] = [];

    // Sort by selection status (selected first) then by theme name
    const sortedMeasurements = [...chipMeasurements]
      .filter((chip) => themes.includes(chip.theme)) // Only include current themes
      .sort((a, b) => {
        const aSelected = selectedArray.includes(a.theme) ? 0 : 1;
        const bSelected = selectedArray.includes(b.theme) ? 0 : 1;
        if (aSelected !== bSelected) return aSelected - bSelected;
        return a.theme.localeCompare(b.theme);
      });

    for (const chip of sortedMeasurements) {
      // Cap width at max percentage of container
      const chipWidth = Math.min(chip.width, maxChipWidth);

      if (availableWidth >= chipWidth + 8) {
        // 8px for margin
        visible.push(chip.theme);
        availableWidth -= chipWidth + 8;
      } else {
        hidden.push(chip.theme);
      }
    }

    setVisibleThemes(visible);
    setHiddenThemes(hidden);
    setShowExpandButton(hidden.length > 0);
  }, [containerWidth, chipMeasurements, themes, selectedArray]);

  const toggle = () => {
    if (expanded) {
      animation.value = withTiming(
        0,
        {
          duration: 300,
          easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        },
        () => {
          runOnJS(setExpanded)(false);
        }
      );
    } else {
      setExpanded(true);
      animation.value = withTiming(1, {
        duration: 300,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      });
    }
  };

  function handleSelect(theme: string) {
    if (multiSelect) {
      const isSelected = selectedArray.includes(theme);
      const next = isSelected
        ? selectedArray.filter((t) => t !== theme)
        : [...selectedArray, theme];
      onChange(next);
    } else {
      onChange(theme);
      if (expanded) toggle();
    }
  }

  // Measure the container width
  const handleContainerLayout = (event: LayoutChangeEvent) => {
    const { width } = event.nativeEvent.layout;
    setContainerWidth(width);
  };

  // Measure each chip's width
  const measureChip = (theme: string, event: LayoutChangeEvent) => {
    const { width } = event.nativeEvent.layout;

    setChipMeasurements((prev) => {
      // Don't update if measurement is already stored
      const existingChip = prev.find((chip) => chip.theme === theme);
      if (existingChip?.measured && existingChip.width === width) {
        return prev;
      }

      return prev.map((chip) =>
        chip.theme === theme ? { ...chip, width, measured: true } : chip
      );
    });
  };

  // Animated styles for expanded overlay card
  const overlayStyle = useAnimatedStyle(() => {
    return {
      height: interpolate(animation.value, [0, 1], [0, EXPANDED_HEIGHT]),
      opacity: interpolate(animation.value, [0, 0.5, 1], [0, 0.7, 1]),
      transform: [
        { translateY: interpolate(animation.value, [0, 1], [-10, 0]) },
      ],
    };
  });

  // Animated styles for backdrop
  const backdropStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(animation.value, [0, 1], [0, 0.3]),
    };
  });

  // Render a theme chip
  const renderThemeChip = (theme: string, inOverlay = false) => (
    <Pressable
      key={`${theme}-${inOverlay ? "overlay" : "main"}`}
      onPress={() => handleSelect(theme)}
      onLayout={inOverlay ? undefined : (event) => measureChip(theme, event)}
      className={`px-4 py-2 mx-1 my-1 rounded-md ${
        selectedArray.includes(theme) ? "bg-primary-400" : "bg-gray-100"
      }`}
      style={
        inOverlay
          ? {}
          : { maxWidth: containerWidth * MAX_CHIP_WIDTH_PERCENTAGE }
      }
    >
      <Text
        className={`${
          selectedArray.includes(theme) ? "text-white" : "text-typography-500"
        } font-medium`}
        numberOfLines={1}
      >
        {theme}
      </Text>
    </Pressable>
  );

  return (
    <View className="relative">
      {/* Measurement container - invisible but used for measuring */}
      <View className="absolute opacity-0 pointer-events-none">
        {themes.map((theme) => renderThemeChip(theme))}
      </View>

      {/* Main horizontal row with visible chips */}
      <View
        className="flex-row items-center bg-white shadow-md px-4 py-3"
        onLayout={handleContainerLayout}
      >
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="flex-1"
        >
          <View className="flex-row items-center">
            {visibleThemes.map((theme) => renderThemeChip(theme))}
          </View>
        </ScrollView>

        {/* Only show expand button when there are hidden themes */}
        {showExpandButton && (
          <Pressable
            onPress={toggle}
            className="rounded-full h-9 w-9 border border-black items-center justify-center ml-2"
          >
            <Ionicons
              name={expanded ? "remove" : "add"}
              size={20}
              color="black"
            />
          </Pressable>
        )}
      </View>

      {/* Backdrop when expanded */}
      {expanded && (
        <Animated.View
          style={backdropStyle}
          className="absolute inset-0 bg-black"
          pointerEvents="none"
        />
      )}

      {/* Expanded overlay card */}
      {expanded && (
        <Animated.View
          style={[overlayStyle]}
          className="absolute top-16 left-0 right-0 bg-white z-10 rounded-md shadow-lg mx-2 overflow-hidden"
        >
          <View className="flex-row justify-between items-center px-4 py-3 border-b border-gray-200">
            <Text className="font-bold text-base text-typography-500">
              All Categories
            </Text>
            <Pressable onPress={toggle}>
              <Ionicons name="close" size={20} color="#333" />
            </Pressable>
          </View>

          <ScrollView className="flex-1">
            <View className="flex-row flex-wrap p-2">
              {themes.map((theme) => renderThemeChip(theme, true))}
            </View>
          </ScrollView>
        </Animated.View>
      )}

      {loading && (
        <View className="absolute right-14 top-4">
          <Ionicons
            name="reload-outline"
            size={20}
            color="#888"
            className="animate-spin"
          />
        </View>
      )}
    </View>
  );
}
