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
  FlatList,
  StyleSheet
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import { Model } from '@/interfaces/model';

interface AddModelFormProps {
  onClose: () => void;
  onSave: (model: Model) => void;
  editModel?: Model; // Optional model for editing
}

const MAX_IMAGES = 3;

const AddModelForm: React.FC<AddModelFormProps> = ({ onClose, onSave, editModel }) => {
  const [name, setName] = useState(editModel?.name || '');
  const [about, setAbout] = useState(editModel?.description || '');
  const [gender, setGender] = useState<'Male' | 'Female' | 'Kids'>(editModel?.gender || 'Male');
  const [age, setAge] = useState(editModel?.age || '');
  const [password, setPassword] = useState(editModel?.password || '');
  const [confirmPassword, setConfirmPassword] = useState(editModel?.password || '');
  const [images, setImages] = useState<string[]>(editModel?.images as string[] || []);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const isEditMode = !!editModel;

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
    if (images.length >= MAX_IMAGES) {
      Alert.alert('Maximum Images', `You can only upload up to ${MAX_IMAGES} images.`);
      return;
    }

    const hasPermission = await requestPermission();
    
    if (hasPermission) {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
  
      if (!result.canceled) {
        setImages([...images, result.assets[0].uri]);
      }
    }
  };

  // Remove an image
  const removeImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };

  // Validate the form
  const validateForm = () => {
    let formErrors: {[key: string]: string} = {};
    
    if (!name.trim()) formErrors.name = 'Name is required';
    if (!about.trim()) formErrors.about = 'About is required';
    if (!gender) formErrors.gender = 'Gender is required';
    if (!age.trim()) formErrors.age = 'Age is required';
    if (images.length === 0) formErrors.images = 'At least one image is required';
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
      // Create a new model object or update existing one
      const modelData: Model = {
        id: editModel?.id || Date.now().toString(), // Use existing ID or generate a new one
        name,
        description: about,
        gender,
        age,
        password,
        thumbnailImage: images[0], // Use the first image as thumbnail
        images: images, // Use all uploaded images
      };
      
      onSave(modelData);
      onClose();
    }
  };

  // Custom gender selection component
  const renderGenderSelector = () => {
    return (
      <View className="mb-4">
        <Text className="text-gray-700 mb-2 font-medium">Gender</Text>
        <View className="flex-row mb-2">
          {['Male', 'Female', 'Kids'].map((option) => (
            <TouchableOpacity
              key={option}
              className={`flex-1 py-3 mx-1 rounded-lg items-center justify-center ${
                gender === option ? 'bg-blue-500' : 'bg-gray-200'
              }`}
              onPress={() => setGender(option as 'Male' | 'Female' | 'Kids')}
            >
              <Text 
                className={`font-medium ${
                  gender === option ? 'text-white' : 'text-gray-700'
                }`}
              >
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        {errors.gender && <Text className="text-red-500 mt-1">{errors.gender}</Text>}
      </View>
    );
  };

  return (
    <View className="flex-1 bg-white">
      <View className="flex-row justify-between items-center px-4 py-3 border-b border-gray-200">
        <TouchableOpacity onPress={onClose}>
          <Text className="text-gray-600">Cancel</Text>
        </TouchableOpacity>
        <Text className="text-xl font-bold">{isEditMode ? 'Edit Actor' : 'Add New Actor'}</Text>
        <TouchableOpacity onPress={handleSubmit}>
          <Text className="text-blue-600 font-medium">Save</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView className="flex-1 p-4">
        {/* Image Picker */}
        <View className="mb-6">
          <Text className="text-gray-700 mb-2 font-medium">Images (1-3)</Text>
          <View className="flex-row mb-2">
            <FlatList
              data={images}
              horizontal
              renderItem={({ item, index }) => (
                <View className="mr-3 relative">
                  <Image source={{ uri: item }} className="w-24 h-24 rounded-md" />
                  <TouchableOpacity 
                    className="absolute top-1 right-1 bg-red-500 w-6 h-6 rounded-full items-center justify-center"
                    onPress={() => removeImage(index)}
                  >
                    <Text className="text-white font-bold">×</Text>
                  </TouchableOpacity>
                </View>
              )}
              keyExtractor={(item, index) => index.toString()}
              ListFooterComponent={
                images.length < MAX_IMAGES ? (
                  <TouchableOpacity 
                    className="w-24 h-24 rounded-md bg-gray-200 justify-center items-center"
                    onPress={pickImage}
                  >
                    <Text className="text-gray-500 text-4xl">+</Text>
                  </TouchableOpacity>
                ) : null
              }
            />
          </View>
          {errors.images && <Text className="text-red-500 mt-1">{errors.images}</Text>}
          <Text className="text-gray-500 text-xs mt-1">
            Upload 1-3 images. The first image will be used as the main thumbnail.
          </Text>
        </View>
        
        {/* Name Input */}
        <View className="mb-4">
          <Text className="text-gray-700 mb-2 font-medium">Name</Text>
          <TextInput
            className="border border-gray-300 rounded-lg p-3 bg-white"
            value={name}
            onChangeText={setName}
            placeholder="Enter actor name"
          />
          {errors.name && <Text className="text-red-500 mt-1">{errors.name}</Text>}
        </View>
        
        {/* About Input */}
        <View className="mb-4">
          <Text className="text-gray-700 mb-2 font-medium">About</Text>
          <TextInput
            className="border border-gray-300 rounded-lg p-3 bg-white"
            value={about}
            onChangeText={setAbout}
            placeholder="Enter description"
            multiline
            numberOfLines={4}
            style={{ textAlignVertical: 'top', minHeight: 100 }}
          />
          {errors.about && <Text className="text-red-500 mt-1">{errors.about}</Text>}
        </View>
        
        {/* Gender Selection - Custom UI */}
        {renderGenderSelector()}
        
        {/* Age Input */}
        <View className="mb-4">
          <Text className="text-gray-700 mb-2 font-medium">Age</Text>
          <TextInput
            className="border border-gray-300 rounded-lg p-3 bg-white"
            value={age}
            onChangeText={setAge}
            placeholder="Enter age"
            keyboardType="numeric"
          />
          {errors.age && <Text className="text-red-500 mt-1">{errors.age}</Text>}
        </View>

        {/* Password Input */}
        <View className="mb-4">
          <Text className="text-gray-700 mb-2 font-medium">Password</Text>
          <TextInput
            className="border border-gray-300 rounded-lg p-3 bg-white"
            value={password}
            onChangeText={setPassword}
            placeholder="Enter password for actor management"
            secureTextEntry
          />
          {errors.password && <Text className="text-red-500 mt-1">{errors.password}</Text>}
          <Text className="text-gray-500 text-xs mt-1">
            This password will be required to edit or delete this actor later.
          </Text>
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
        </View>
      </ScrollView>
    </View>
  );
};

export default AddModelForm;
