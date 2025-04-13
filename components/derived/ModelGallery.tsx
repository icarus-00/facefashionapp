import React from 'react';
import { View, Text, Image, FlatList, TouchableOpacity, Dimensions } from 'react-native';
import { ModelGalleryProps, Model } from '@/interfaces/model';

const { width } = Dimensions.get('window');
const numColumns = 2;
const itemWidth = (width - 40) / numColumns;

const ModelGallery: React.FC<ModelGalleryProps> = ({ models, onSelectModel, selectedGender }) => {
  // Filter models by selected gender
  const filteredModels = models.filter(model => model.gender === selectedGender);

  const renderItem = ({ item }: { item: Model }) => (
    <TouchableOpacity 
      className="p-2"
      style={{ width: itemWidth }}
      onPress={() => onSelectModel(item)}
    >
      <View className="bg-gray-100 rounded-xl overflow-hidden shadow-sm">
        <Image
          source={typeof item.thumbnailImage === 'string' ? { uri: item.thumbnailImage } : item.thumbnailImage}
          className="w-full h-[200px]"
          resizeMode="cover"
        />
        <View className="p-2">
          <Text className="text-gray-800 font-bold text-base">{item.name}</Text>
          <Text className="text-gray-500 text-xs mt-1" numberOfLines={2}>{item.description}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 py-2 px-2 mb-20">
      <FlatList
        data={filteredModels}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingVertical: 0, paddingHorizontal: 10 }}
      />
    </View>
  );
};

export default ModelGallery;
