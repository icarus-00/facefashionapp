// import { icons } from '@/constants/icons';
import React from 'react';
import { View, Image, FlatList, TouchableOpacity, Dimensions } from 'react-native';
import { images } from '@/constants/images';

const collectionData = [
  { id: '1', image: images.m1 },
  { id: '2', image: images.m2 },
  { id: '3', image: images.m3 },
  { id: '4', image: images.m4 },
];

const CollectionComponent = () => {
  const screenWidth = Dimensions.get('window').width;
  const imageSize = (screenWidth ) / 2; // Account for padding and gap

  const renderItem = ({ item }: { item: typeof collectionData[0] }) => (
    <View
      style={{
        width: 180,
        height: imageSize * 1.8, // Make images slightly taller than wide
        marginBottom: 0,
      }}
    >
      <Image
        source={typeof item.image === 'string' ? { uri: item.image } : item.image}
        style={{
          width: '100%',
          height: '100%',
        }}
        resizeMode="cover"
      />
    </View>
  );

  return (
    <View className="w-full rounded-xl flex-1 overflow-hidden">
      <FlatList
        className='rounded-lg'
        data={collectionData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        scrollEnabled={false}
    
      />
    </View>
  );
};

export default CollectionComponent;
