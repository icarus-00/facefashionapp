import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface CreateVideoItemProps {
  onPress: () => void;
  height: number;
}

export const CreateVideoItem: React.FC<CreateVideoItemProps> = ({ onPress, height }) => {
  return (
    <View style={{ width: "100%", height }} className="p-5 items-center justify-center">
      <TouchableOpacity 
        className="bg-gray-100 rounded-xl w-full h-full items-center justify-center"
        onPress={onPress}
      >
        <View className="items-center">
          <Ionicons name="add-circle" size={80} color="#3b82f6" />
          <Text className="text-blue-500 font-bold text-xl mt-4">Create Video</Text>
          <Text className="text-gray-500 text-center mt-2 mx-8">Transform your image into motion</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};