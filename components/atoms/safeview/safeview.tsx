import React from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const SafeAreaView = ({ children, style, className }: { children: React.ReactNode; style?: any, className?: string }) => {
    const insets = useSafeAreaInsets();

    const top = typeof insets.top === 'number' ? insets.top : 0;
    const bottom = typeof insets.bottom === 'number' ? insets.bottom : 0;
    const left = typeof insets.left === 'number' ? insets.left : 0;
    const right = typeof insets.right === 'number' ? insets.right : 0;

    return (
        <View
            collapsable={false}
            style={[
                {
                    paddingTop: top,
                    paddingBottom: bottom,
                    paddingLeft: left,
                    paddingRight: right,
                },
                style,
            ]}
            className={className}
        >
            {children}
        </View>

    );
};

export default SafeAreaView;