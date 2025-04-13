import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';// or any icon set you use

const ActionButton = ({ icon = 'add', label = 'Try now' }) => {
    return (
        <View className='flex-1 justify-center items-center mt-10'>
            <TouchableOpacity 
                className="bg-secondary p-4 rounded-full shadow-lg items-center justify-center"
                >
                    <Text className="text-white text-[15px] font-semibold mt-1">{label}</Text>
            </TouchableOpacity>
        </View>
    );
};

export default ActionButton;
