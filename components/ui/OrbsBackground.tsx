import React from "react";
import { Animated, View, StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

const orbConfigs = [
    { size: 180, top: 40, left: -60, color: "#a5b4fc", opacity: 0.25, duration: 6000 },
    { size: 120, top: height * 0.5, left: width - 100, color: "#fca5a5", opacity: 0.18, duration: 8000 },
    { size: 220, top: height * 0.7, left: -80, color: "#fcd34d", opacity: 0.13, duration: 10000 },
];

export default function OrbsBackground() {
    return (
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
            {orbConfigs.map((orb, i) => (
                <AnimatedOrb key={i} {...orb} />
            ))}
        </View>
    );
}

function AnimatedOrb({ size, top, left, color, opacity, duration }: any) {
    const anim = React.useRef(new Animated.Value(0)).current;

    React.useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(anim, {
                    toValue: 1,
                    duration,
                    useNativeDriver: true,
                }),
                Animated.timing(anim, {
                    toValue: 0,
                    duration,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, [anim, duration]);

    const translateY = anim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 20],
    });
    const translateX = anim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 10],
    });

    return (
        <Animated.View
            style={[
                styles.orb,
                {
                    width: size,
                    height: size,
                    top,
                    left,
                    backgroundColor: color,
                    opacity,
                    borderRadius: size / 2,
                    transform: [{ translateY }, { translateX }],
                },
            ]}
        />
    );
}

const styles = StyleSheet.create({
    orb: {
        position: "absolute",
    },
});
