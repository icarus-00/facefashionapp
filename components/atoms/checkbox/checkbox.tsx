import React from 'react';
import { Pressable, View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    interpolateColor
} from 'react-native-reanimated';

interface CheckboxProps {
    value?: boolean;
    isChecked?: boolean;
    onChange?: (value: boolean) => void;
    accessibilityLabel: string;
    style?: any;
}

const Checkbox: React.FC<CheckboxProps> = ({
    value = false,
    isChecked = false,
    onChange,
    accessibilityLabel,
    style,
}) => {
    // Use either value or isChecked
    const checked = value || isChecked;

    // Animation values
    const checkmarkScale = useSharedValue(checked ? 1 : 0);
    const backgroundColorValue = useSharedValue(checked ? 1 : 0);

    // Update animation when checked state changes
    React.useEffect(() => {
        checkmarkScale.value = withTiming(checked ? 1 : 0, { duration: 150 });
        backgroundColorValue.value = withTiming(checked ? 1 : 0, { duration: 150 });
    }, [checked]);

    // Animated styles
    const checkmarkStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: checkmarkScale.value }],
            opacity: checkmarkScale.value,
        };
    });

    const boxStyle = useAnimatedStyle(() => {
        return {
            backgroundColor: interpolateColor(
                backgroundColorValue.value,
                [0, 1],
                ['transparent', '#3b82f6']
            ),
            borderColor: interpolateColor(
                backgroundColorValue.value,
                [0, 1],
                ['#d1d5db', '#3b82f6']
            ),
        };
    });

    const handlePress = () => {
        if (onChange) {
            onChange(!checked);
        }
    };

    return (
        <Pressable
            onPress={handlePress}
            accessibilityRole="checkbox"
            accessibilityLabel={accessibilityLabel}
            accessibilityState={{ checked }}
        >
            <Animated.View style={[styles.box, boxStyle, style]}>
                <Animated.View style={checkmarkStyle}>
                    <Ionicons name="checkmark" size={16} color="white" />
                </Animated.View>
            </Animated.View>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    box: {
        width: 24,
        height: 24,
        borderRadius: 4,
        borderWidth: 2,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default Checkbox;