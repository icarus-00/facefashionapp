import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ModelPreviewProps } from '@/interfaces/clothing';
import { Model } from '@/interfaces/model';
import { modelData } from '@/constants/modelData';

const { width } = Dimensions.get('window');

const ModelPreview: React.FC<ModelPreviewProps> = ({ modelId, selectedItems }) => {
  const [model, setModel] = useState<Model | null>(null);

  // Fetch model data from AsyncStorage or state management
  useEffect(() => {
    const fetchModel = async () => {
      try {
        // First check in modelData
        const foundModel = modelData.find(m => m.id === modelId);
        
        if (foundModel) {
          setModel(foundModel);
          return;
        }
        
        // If not found in modelData, try to get from AsyncStorage
        // This is where we would normally fetch from a database or API
        const storedModelsJson = await AsyncStorage.getItem('customModels');
        
        if (storedModelsJson) {
          const storedModels = JSON.parse(storedModelsJson);
          const customModel = storedModels.find((m: Model) => m.id === modelId);
          
          if (customModel) {
            setModel(customModel);
            return;
          }
        }
        
        // If we get here, model was not found
        setModel(null);
      } catch (error) {
        console.error('Error fetching model:', error);
        setModel(null);
      }
    };
    
    fetchModel();
  }, [modelId]);

  if (!model) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-100 rounded-xl m-4">
        <Text className="text-gray-500">Model not found</Text>
      </View>
    );
  }

  return (
    <View 
      style={{
        height: 500, // Set a fixed height (adjust as needed)
        overflow: 'hidden',
        margin: 0,
        borderRadius: 0,
        backgroundColor: '#FEFEFE',
      }}
    >
      <View 
        className="p-3 flex-row border-b border-gray-200 justify-between items-center"
      >
        <Text className="text-secondary font-bold">Preview</Text>
      </View>
      
      <View className="flex-1">
        <View className="items-center justify-center p-5">
          <Image
            source={typeof model.thumbnailImage === 'string' ? { uri: model.thumbnailImage } : model.thumbnailImage}
            className="w-40 h-40 rounded-md"
            resizeMode="contain"
          />
        </View>
        
        {selectedItems.length > 0 && (
          <View className="p-3 bg-gray-200 flex-1">
            <Text className="font-semibold mb-2">
              Selected Items ({selectedItems.length}/3):
            </Text>
            <ScrollView className="flex-1" nestedScrollEnabled showsVerticalScrollIndicator>
              {selectedItems.map((item) => (
                <View key={item.id} className="flex-row items-center mb-2 bg-white p-2 rounded-md">
                  <Image
                    source={typeof item.image === 'string' ? { uri: item.image } : item.image}
                    className="w-12 h-12 rounded-md mr-3"
                    resizeMode="cover"
                  />
                  <View className="flex-1">
                    <Text className="font-medium">{item.name}</Text>
                    <Text className="text-xs text-gray-500">{item.subCategory}</Text>
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>
        )}
      </View>
    </View>
  );
};

export default ModelPreview;
