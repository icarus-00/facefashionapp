import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { CategoryTabsProps } from '@/interfaces/clothing';

const CategoryTabs: React.FC<CategoryTabsProps> = ({ 
  categories, 
  selectedCategory, 
  onSelectCategory 
}) => {
  return (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      className="px-4 py-3 border-b border-gray-200"
    >
      {categories.map((category) => (
        <TouchableOpacity
          key={category.id}
          onPress={() => onSelectCategory(category.id)}
          className={`px-5 py-2 mr-3 rounded-full ${
            selectedCategory === category.id 
              ? 'bg-black' 
              : 'bg-gray-200'
          }`}
        >
          <Text 
            className={`font-medium ${
              selectedCategory === category.id 
                ? 'text-white' 
                : 'text-gray-800'
            }`}
          >
            {category.name}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

export default CategoryTabs;
