import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SubCategoryTabsProps } from '@/interfaces/clothing';

const SubCategoryTabs: React.FC<SubCategoryTabsProps> = ({ 
  subCategories, 
  selectedSubCategory, 
  onSelectSubCategory 
}) => {
  return (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      className="px-4 py-2 border-b border-gray-100"
    >
      {subCategories.map((subCategory) => (
        <TouchableOpacity
          key={subCategory.id}
          onPress={() => onSelectSubCategory(subCategory.id)}
          className={`px-4 py-1 mr-3 rounded-lg ${
            selectedSubCategory === subCategory.id 
              ? 'bg-gray-800' 
              : 'bg-gray-100'
          }`}
        >
          <Text 
            className={`font-medium ${
              selectedSubCategory === subCategory.id 
                ? 'text-white' 
                : 'text-gray-700'
            }`}
          >
            {subCategory.name}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

export default SubCategoryTabs;
