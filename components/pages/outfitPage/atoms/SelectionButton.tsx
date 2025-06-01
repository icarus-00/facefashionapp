import React from "react";
import { TouchableOpacity, StyleSheet, View, ViewStyle } from "react-native";
import { CheckIcon } from "@/components/ui/icon";
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    withTiming,
    interpolateColor
} from "react-native-reanimated";

interface SelectionButtonProps {
    selected: boolean;
    onPress: () => void;
    size?: number;
    style?: ViewStyle;
    position?: "topRight" | "topLeft" | "bottomRight" | "bottomLeft";
}

const SelectionButton = ({
    selected,
    onPress,
    size = 28,
    style,
    position = "topRight"
}: SelectionButtonProps) => {
    // Animation values
    const scale = useSharedValue(1);
    const animatedValue = useSharedValue(selected ? 1 : 0);

    // Update animated value when selected prop changes
    React.useEffect(() => {
        animatedValue.value = withTiming(selected ? 1 : 0, { duration: 200 });
    }, [selected, animatedValue]);

    // Animated styles
    const animatedCircleStyle = useAnimatedStyle(() => {
        const backgroundColor = interpolateColor(
            animatedValue.value,
            [0, 1],
            ['rgba(255, 255, 255, 0.8)', '#6D28D9']
        );

        const borderColor = interpolateColor(
            animatedValue.value,
            [0, 1],
            ['rgba(0, 0, 0, 0.3)', '#6D28D9']
        );

        return {
            backgroundColor,
            borderColor,
            transform: [{ scale: scale.value }]
        };
    });

    // Handle press with animation
    const handlePress = () => {
        scale.value = withSpring(0.8, { damping: 2 }, () => {
            scale.value = withSpring(1);
        });
        onPress();
    };

    // Position styles
    const getPositionStyle = (): ViewStyle => {
        switch (position) {
            case "topLeft":
                return { top: 8, left: 8 };
            case "bottomRight":
                return { bottom: 8, right: 8 };
            case "bottomLeft":
                return { bottom: 8, left: 8 };
            case "topRight":
            default:
                return { top: 8, right: 8 };
        }
    };

    return (
        <TouchableOpacity
            activeOpacity={0.8}
            onPress={handlePress}
            style={[
                styles.container,
                getPositionStyle(),
                { width: size, height: size, borderRadius: size / 2 },
                style
            ]}
        >
            <Animated.View
                style={[
                    styles.circle,
                    { width: size, height: size, borderRadius: size / 2 },
                    animatedCircleStyle
                ]}
            >
                {selected && (
                    <CheckIcon color="white\" width={size * 0.6} height={size * 0.6} />
                )}
            </Animated.View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        zIndex: 100,
        justifyContent: "center",
        alignItems: "center"
    },
    circle: {
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1.5,
        elevation: 3
    }
});

export default SelectionButton;