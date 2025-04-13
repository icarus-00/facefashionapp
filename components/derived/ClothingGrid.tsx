import React, { useState, useCallback } from 'react';
import { View, Text, Image, TouchableOpacity, FlatList, Modal, Dimensions, InteractionManager } from 'react-native';
import { ClothingItem, ClothingGridProps } from '@/interfaces/clothing';
import ClothingItemDetail from './ClothingItemDetail';

const { width } = Dimensions.get('window');

// Calculate item width based on screen size (2 columns with margins)
const numColumns = 2;
const itemMargin = 8;
const screenWidth = width;
const itemWidth = (screenWidth - (numColumns + 1) * itemMargin) / numColumns;

const ClothingGrid: React.FC<ClothingGridProps> = ({ 
  items, 
  onSelectItem, 
  onEditItem,
  onDeleteItem
}) => {
  const [selectedItem, setSelectedItem] = useState<ClothingItem | null>(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  
  // Handle item press (short press)
  const handleItemPress = (item: ClothingItem) => {
    if (onSelectItem) {
      onSelectItem(item);
    }
  };
  
  // Handle item long press to show detail modal
  const handleItemLongPress = (item: ClothingItem) => {
    setSelectedItem(item);
    setDetailModalVisible(true);
  };
  
  // Handle closing the detail modal
  const handleCloseDetail = useCallback(() => {
    setDetailModalVisible(false);
    // Don't immediately clear the selected item to avoid visual glitches
    // during modal animation
    setTimeout(() => {
      setSelectedItem(null);
    }, 300);
  }, []);

  // Handle editing an item
  const handleEditItem = useCallback((item: ClothingItem) => {
    // Close the modal first, then call the edit handler with a delay
    setDetailModalVisible(false);
    
    // Use InteractionManager to ensure UI thread is not blocked
    InteractionManager.runAfterInteractions(() => {
      setTimeout(() => {
        if (onEditItem) {
          onEditItem(item);
        }
        setSelectedItem(null);
      }, 500);
    });
  }, [onEditItem]);

  // Handle deleting an item
  const handleDeleteItem = useCallback((item: ClothingItem) => {
    // The deletion process is now handled in ClothingItemDetail
    // This function will be called after the confirmation and modal closing
    if (onDeleteItem) {
      onDeleteItem(item);
    }
  }, [onDeleteItem]);

  const renderItem = ({ item }: { item: ClothingItem }) => (
    <TouchableOpacity
      className="bg-white rounded-lg overflow-hidden shadow-sm m-2"
      style={{ width: itemWidth }}
      onPress={() => handleItemPress(item)}
      onLongPress={() => handleItemLongPress(item)}
      delayLongPress={500}
    >
      <View style={{ width: '100%', aspectRatio: 1 }}>
        <Image
          source={typeof item.image === 'string' ? { uri: item.image } : item.image}
          style={{ width: '100%', height: '100%' }}
          resizeMode="cover"
        />
      </View>
      <View className="p-2">
        <Text className="font-medium text-sm" numberOfLines={1}>{item.name}</Text>
        <Text className="text-xs text-gray-500" numberOfLines={1}>{item.subCategory}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1">
      {items.length > 0 ? (
        <FlatList
          data={items}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          numColumns={numColumns}
          contentContainerStyle={{ padding: 4 }}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View className="flex-1 justify-center items-center">
          <Text className="text-gray-500">No items found</Text>
        </View>
      )}
      
      {/* Detail Modal */}
      <Modal
        visible={detailModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={handleCloseDetail}
      >
        {selectedItem && (
          <ClothingItemDetail
            item={selectedItem}
            onClose={handleCloseDetail}
            onEdit={handleEditItem}
            onDelete={handleDeleteItem}
          />
        )}
      </Modal>
    </View>
  );
};

export default ClothingGrid;
