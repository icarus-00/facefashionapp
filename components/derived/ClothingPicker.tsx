import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { ClothingPickerProps, ClothingItem, ClothingSubCategory } from '@/interfaces/clothing';
import CategoryTabs from './CategoryTabs';
import SubCategoryTabs from './SubCategoryTabs';
import ClothingGrid from './ClothingGrid';

const ClothingPicker: React.FC<ClothingPickerProps> = ({
  categories,
  onSelectItem,
  selectedCategory,
  selectedSubCategory,
  onSelectCategory,
  onSelectSubCategory,
  onEditItem,
  onDeleteItem
}) => {
  const [currentSubCategories, setCurrentSubCategories] = useState<ClothingSubCategory[]>([]);
  const [currentItems, setCurrentItems] = useState<ClothingItem[]>([]);

  // Update subcategories when category changes
  useEffect(() => {
    const category = categories.find(cat => cat.id === selectedCategory);
    if (category) {
      setCurrentSubCategories(category.subCategories);
      
      // If no subcategory is selected or the selected one isn't in this category,
      // select the first subcategory
      if (!selectedSubCategory || !category.subCategories.some(sub => sub.id === selectedSubCategory)) {
        if (category.subCategories.length > 0) {
          onSelectSubCategory(category.subCategories[0].id);
        }
      }
    }
  }, [selectedCategory, categories]);

  // Update items when subcategory changes
  useEffect(() => {
    if (selectedSubCategory) {
      const category = categories.find(cat => cat.id === selectedCategory);
      if (category) {
        const subCategory = category.subCategories.find(sub => sub.id === selectedSubCategory);
        if (subCategory) {
          setCurrentItems(subCategory.items);
        }
      }
    }
  }, [selectedSubCategory, selectedCategory, categories]);

  return (
    <View className="flex-1">
      <View>
        <Text className="px-4 ml-4 pt-4 text-lg font-bold text-gray-800">Movie Genre</Text>
        <CategoryTabs 
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={onSelectCategory}
        />
      </View>
      
      <View>
        <Text className="px-4 pt-3 pb-1 text-md font-semibold text-gray-700">Clothing Type</Text>
        <SubCategoryTabs 
          subCategories={currentSubCategories}
          selectedSubCategory={selectedSubCategory}
          onSelectSubCategory={onSelectSubCategory}
        />
      </View>
      
      <View className="flex-1 mt-4">
        <ClothingGrid 
          items={currentItems} 
          onSelectItem={onSelectItem}
          onEditItem={onEditItem}
          onDeleteItem={onDeleteItem}
        />
      </View>
    </View>
  );
};

export default ClothingPicker;
