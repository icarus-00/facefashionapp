import React from 'react';
import { Tabs } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import PillTabBar from '@/components/atoms/TabBar/PillTabBar';
import { Colors } from '@/constants/Colors';

export default function TabLayout() {
    const insets = useSafeAreaInsets();

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                headerShadowVisible: false,
                tabBarPosition: 'top',
                headerStyle: {
                    backgroundColor: Colors.light.background,
                },
                tabBarStyle: {
                    display: 'none', // Hide the default tab bar
                },
            }}
            tabBar={(props) => <PillTabBar {...props} />}
        >
            <Tabs.Screen
                name="generations"
                options={{
                    title: "Library",
                }}
            />
            <Tabs.Screen
                name="chat"
                options={{
                    title: "Chat",
                }}
            />
        </Tabs>
    );
}