import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { ModelFilterProps } from '@/interfaces/model';

const ModelFilter: React.FC<ModelFilterProps> = ({ selectedGender, onSelectGender }) => {
  const genders = ['Male', 'Female', 'Kids'];

  return (
    <View className="flex-row px-4 py-3 border-b border-gray-200">
      {genders.map((gender) => (
        <TouchableOpacity
          key={gender}
          className={`px-5 py-2 mr-3 rounded-full ${
            selectedGender === gender ? 'bg-black' : 'bg-gray-200'
          }`}
          onPress={() => onSelectGender(gender)}
        >
          <Text 
            className={`font-medium ${
              selectedGender === gender ? 'text-white' : 'text-gray-800'
            }`}
          >
            {gender}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default ModelFilter;
