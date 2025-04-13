import React from 'react';
import { TouchableOpacity, StyleSheet, View, Text } from 'react-native';

interface AddButtonProps {
  onPress: () => void;
}

const AddButton: React.FC<AddButtonProps> = ({ onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} className="absolute right-[15px] top-[15px] z-10">
      <View className="w-[30px] h-[30px] rounded-full bg-black justify-center items-center">
        <Text className="text-white text-[20px] font-bold leading-[28px] mb-1">+</Text>
      </View>
    </TouchableOpacity>
  );
};

export default AddButton;
