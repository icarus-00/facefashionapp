import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  Image, 
  ScrollView,
  Alert,
  Platform,
  FlatList
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { ClothingItem, ClothingCategory } from '@/interfaces/clothing';

interface AddClothingFormProps {
  onClose: () => void;
  onSave: (item: ClothingItem) => void;
  categories: ClothingCategory[];
  editItem?: ClothingItem; // Optional item for editing
}

const AddClothingForm: React.FC<AddClothingFormProps> = ({ 
  onClose, 
  onSave, 
  categories,
  editItem 
}) => {
  const [name, setName] = useState(editItem?.name || '');
  const [description, setDescription] = useState(editItem?.description || '');
  const [category, setCategory] = useState<string>(editItem?.category || categories[0]?.id || '');
  const [subCategory, setSubCategory] = useState<string>(editItem?.subCategory || '');
  const [image, setImage] = useState<string>(editItem?.image as string || '');
  const [color, setColor] = useState(editItem?.color || '');
  const [password, setPassword] = useState(editItem?.password || '');
  const [confirmPassword, setConfirmPassword] = useState(editItem?.password || '');
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const isEditMode = !!editItem;

  // Get available subcategories based on selected category
  const getSubCategories = () => {
    const selectedCategory = categories.find(cat => cat.id === category);
    return selectedCategory?.subCategories || [];
  };

  // Get category name by id
  const getCategoryName = (categoryId: string) => {
    const selectedCategory = categories.find(cat => cat.id === categoryId);
    return selectedCategory?.name || '';
  };

  // Get subcategory name by id
  const getSubCategoryName = (subCategoryId: string) => {
    const selectedCategory = categories.find(cat => cat.id === category);
    const selectedSubCategory = selectedCategory?.subCategories.find(
      subCat => subCat.id === subCategoryId
    );
    return selectedSubCategory?.name || '';
  };

  // Request permission to access the device's photo library
  const requestPermission = async () => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Sorry, we need camera roll permissions to make this work!');
        return false;
      }
      return true;
    }
    return true;
  };

  // Pick an image from the device's photo library
  const pickImage = async () => {
    const hasPermission = await requestPermission();
    
    if (hasPermission) {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
  
      if (!result.canceled) {
        setImage(result.assets[0].uri);
      }
    }
  };

  // Validate the form
  const validateForm = () => {
    let formErrors: {[key: string]: string} = {};
    
    if (!name.trim()) formErrors.name = 'Name is required';
    if (!description.trim()) formErrors.description = 'Description is required';
    if (!category) formErrors.category = 'Movie genre is required';
    if (!subCategory) formErrors.subCategory = 'Clothing type is required';
    if (!image) formErrors.image = 'Image is required';
    if (!color.trim()) formErrors.color = 'Color is required';
    if (!password) formErrors.password = 'Password is required';
    
    if (password !== confirmPassword) {
      formErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = () => {
    if (validateForm()) {
      // Create a new clothing item or update existing one
      const clothingItem: ClothingItem = {
        id: editItem?.id || `${category}-${subCategory}-${Date.now()}`, // Generate a unique ID
        name,
        description,
        category,
        subCategory,
        image,
        color,
        password,
      };
      
      onSave(clothingItem);
      onClose();
    }
  };

  // Handle category change
  const handleCategoryChange = (categoryId: string) => {
    setCategory(categoryId);
    
    // Reset subcategory when category changes
    const selectedCategory = categories.find(cat => cat.id === categoryId);
    if (selectedCategory && selectedCategory.subCategories.length > 0) {
      setSubCategory(selectedCategory.subCategories[0].id);
    } else {
      setSubCategory('');
    }
  };

  // Render movie genre selector
  const renderCategorySelector = () => {
    return (
      <View className="mb-4">
        <Text className="text-gray-700 mb-2 font-medium">Movie Genre</Text>
        <View className="flex-row flex-wrap mb-2">
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              className={`py-3 px-4 m-1 rounded-lg items-center justify-center ${
                category === cat.id ? 'bg-blue-500' : 'bg-gray-200'
              }`}
              onPress={() => handleCategoryChange(cat.id)}
            >
              <Text 
                className={`font-medium ${
                  category === cat.id ? 'text-white' : 'text-gray-700'
                }`}
              >
                {cat.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        {errors.category && <Text className="text-red-500 mt-1">{errors.category}</Text>}
      </View>
    );
  };

  // Render clothing type selector
  const renderSubCategorySelector = () => {
    const subCategories = getSubCategories();
    
    return (
      <View className="mb-4">
        <Text className="text-gray-700 mb-2 font-medium">Clothing Type</Text>
        <View className="flex-row flex-wrap mb-2">
          {subCategories.map((subCat) => (
            <TouchableOpacity
              key={subCat.id}
              className={`py-3 px-4 m-1 rounded-lg items-center justify-center ${
                subCategory === subCat.id ? 'bg-blue-500' : 'bg-gray-200'
              }`}
              onPress={() => setSubCategory(subCat.id)}
            >
              <Text 
                className={`font-medium ${
                  subCategory === subCat.id ? 'text-white' : 'text-gray-700'
                }`}
              >
                {subCat.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        {errors.subCategory && <Text className="text-red-500 mt-1">{errors.subCategory}</Text>}
      </View>
    );
  };

  return (
    <View className="flex-1 bg-white">
      <View className="flex-row justify-between items-center px-4 py-3 border-b border-gray-200">
        <TouchableOpacity onPress={onClose}>
          <Text className="text-gray-600">Cancel</Text>
        </TouchableOpacity>
        <Text className="text-xl font-bold">{isEditMode ? 'Edit Clothing Item' : 'Add New Clothing Item'}</Text>
        <TouchableOpacity onPress={handleSubmit}>
          <Text className="text-blue-600 font-medium">Save</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView className="flex-1 p-4">
        {/* Image Picker */}
        <View className="mb-6">
          <Text className="text-gray-700 mb-2 font-medium">Image</Text>
          <View className="flex-row mb-2 justify-center">
            {image ? (
              <View className="relative">
                <Image source={{ uri: image }} className="w-40 h-40 rounded-md" />
                <TouchableOpacity 
                  className="absolute top-1 right-1 bg-red-500 w-6 h-6 rounded-full items-center justify-center"
                  onPress={() => setImage('')}
                >
                  <Text className="text-white font-bold">×</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity 
                className="w-40 h-40 rounded-md bg-gray-200 justify-center items-center"
                onPress={pickImage}
              >
                <Text className="text-gray-500 text-4xl">+</Text>
              </TouchableOpacity>
            )}
          </View>
          {errors.image && <Text className="text-red-500 mt-1">{errors.image}</Text>}
        </View>
        
        {/* Name Input */}
        <View className="mb-4">
          <Text className="text-gray-700 mb-2 font-medium">Name</Text>
          <TextInput
            className="border border-gray-300 rounded-lg p-3 bg-white"
            value={name}
            onChangeText={setName}
            placeholder="Enter item name"
          />
          {errors.name && <Text className="text-red-500 mt-1">{errors.name}</Text>}
        </View>
        
        {/* Color Input */}
        <View className="mb-4">
          <Text className="text-gray-700 mb-2 font-medium">Color</Text>
          <TextInput
            className="border border-gray-300 rounded-lg p-3 bg-white"
            value={color}
            onChangeText={setColor}
            placeholder="Enter item color (e.g., Red, Blue, Black)"
          />
          {errors.color && <Text className="text-red-500 mt-1">{errors.color}</Text>}
        </View>
        
        {/* Description Input */}
        <View className="mb-4">
          <Text className="text-gray-700 mb-2 font-medium">Description</Text>
          <TextInput
            className="border border-gray-300 rounded-lg p-3 bg-white"
            value={description}
            onChangeText={setDescription}
            placeholder="Enter description"
            multiline
            numberOfLines={4}
            style={{ textAlignVertical: 'top', minHeight: 100 }}
          />
          {errors.description && <Text className="text-red-500 mt-1">{errors.description}</Text>}
        </View>
        
        {/* Movie Genre Selection */}
        {renderCategorySelector()}
        
        {/* Clothing Type Selection */}
        {renderSubCategorySelector()}
        
        {/* Password Input */}
        <View className="mb-4">
          <Text className="text-gray-700 mb-2 font-medium">Password</Text>
          <TextInput
            className="border border-gray-300 rounded-lg p-3 bg-white"
            value={password}
            onChangeText={setPassword}
            placeholder="Enter password"
            secureTextEntry
          />
          {errors.password && <Text className="text-red-500 mt-1">{errors.password}</Text>}
        </View>
        
        {/* Confirm Password Input */}
        <View className="mb-28">
          <Text className="text-gray-700 mb-2 font-medium">Confirm Password</Text>
          <TextInput
            className="border border-gray-300 rounded-lg p-3 bg-white"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="Confirm password"
            secureTextEntry
          />
          {errors.confirmPassword && <Text className="text-red-500 mt-1">{errors.confirmPassword}</Text>}
          <Text className="text-gray-500 text-xs mt-1">
            This password will be required to edit or delete this item in the future.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default AddClothingForm;
