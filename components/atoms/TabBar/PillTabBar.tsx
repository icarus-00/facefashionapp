import React from 'react';
import {
    View,
    TouchableOpacity,
    Text,
    StyleSheet,
    Dimensions,
    Animated,
    LayoutChangeEvent
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';

const { width } = Dimensions.get('window');

export default function PillTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
    const insets = useSafeAreaInsets();
    const [tabWidths, setTabWidths] = React.useState<{ [key: string]: number }>({});

    const indicatorPosition = React.useRef(new Animated.Value(0)).current;

    const getIndicatorPosition = () => {
        let position = 0;
        for (let i = 0; i < state.index; i++) {
            position += tabWidths[state.routes[i].key] || 0;
        }
        return position;
    };

    React.useEffect(() => {
        if (Object.keys(tabWidths).length === state.routes.length) {
            Animated.spring(indicatorPosition, {
                toValue: getIndicatorPosition(),
                useNativeDriver: true,
                friction: 8,
                tension: 70,
            }).start();
        }
    }, [state.index, tabWidths]);

    const indicatorWidth = React.useMemo(() => {
        if (!state.routes[state.index] || !tabWidths[state.routes[state.index].key]) {
            return 0;
        }
        return tabWidths[state.routes[state.index].key];
    }, [state.index, tabWidths]);

    const handleTabLayout = (key: string) => (event: LayoutChangeEvent) => {
        const { width } = event.nativeEvent.layout;
        setTabWidths(prev => {
            const newWidths = { ...prev, [key]: width };
            return newWidths;
        });
    };

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <View style={styles.pillContainer}>
                <Animated.View
                    style={[
                        styles.indicator,
                        {
                            width: indicatorWidth,
                            transform: [{ translateX: indicatorPosition }]
                        }
                    ]}
                />

                {state.routes.map((route, index) => {
                    const { options } = descriptors[route.key];
                    const label = options.title || route.name;
                    const isFocused = state.index === index;

                    const getTabIcon = () => {
                        if (route.name === 'generations') {
                            return isFocused ? 'images' : 'images-outline';
                        } else if (route.name === 'chat') {
                            return isFocused ? 'chatbubble' : 'chatbubble-outline';
                        }
                        return 'circle';
                    };

                    const onPress = () => {
                        const event = navigation.emit({
                            type: 'tabPress',
                            target: route.key,
                            canPreventDefault: true,
                        });

                        if (!isFocused && !event.defaultPrevented) {
                            navigation.navigate(route.name);
                        }
                    };

                    return (
                        <TouchableOpacity
                            key={route.key}
                            accessibilityRole="button"
                            accessibilityState={{ selected: isFocused }}
                            accessibilityLabel={options.tabBarAccessibilityLabel}
                            onPress={onPress}
                            onLayout={handleTabLayout(route.key)}
                            style={styles.tab}
                        >
                            <Ionicons
                                name={getTabIcon() as any}
                                size={20}
                                color={isFocused ? '#fff' : Colors.light.secondary[700]}
                            />
                            <Text
                                style={[
                                    styles.label,
                                    { color: isFocused ? '#fff' : Colors.light.secondary[700] }
                                ]}
                            >
                                {label}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        width: '100%',
        backgroundColor: Colors.light.background,
        paddingHorizontal: 16,
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: Colors.light.secondary[200],
    },
    pillContainer: {
        flexDirection: 'row',
        backgroundColor: Colors.light.secondary[200],
        borderRadius: 30,
        height: 44,
        position: 'relative',
        overflow: 'hidden',
    },
    indicator: {
        position: 'absolute',
        height: '100%',
        borderRadius: 30,
        backgroundColor: Colors.light.primary[500],
        zIndex: 0,
    },
    tab: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1,
        paddingHorizontal: 12,
        gap: 6,
    },
    label: {
        fontSize: 13,
        fontWeight: '600',
    },
});