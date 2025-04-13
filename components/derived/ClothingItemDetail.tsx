import React, { useState, useCallback } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, Dimensions, InteractionManager, Modal } from 'react-native';
import { ClothingItem, ClothingItemDetailProps } from '@/interfaces/clothing';
import ClothingPasswordModal from './ClothingPasswordModal';
import ClothingDeleteConfirmationModal from './ClothingDeleteConfirmationModal';
import ClothingAdminPasswordModal from './ClothingAdminPasswordModal';

const { width, height } = Dimensions.get('window');

const ClothingItemDetail: React.FC<ClothingItemDetailProps> = ({ item, onClose, onEdit, onDelete }) => {
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [deleteConfirmModalVisible, setDeleteConfirmModalVisible] = useState(false);
  const [adminPasswordModalVisible, setAdminPasswordModalVisible] = useState(false);
  const [actionType, setActionType] = useState<'edit' | 'delete'>('edit');
  const [isProcessing, setIsProcessing] = useState(false);

  // Memoize the close handler to improve performance
  const handleClose = useCallback(() => {
    if (!isProcessing) {
      onClose();
    }
  }, [onClose, isProcessing]);

  const handleEditPress = () => {
    if (onEdit && !isProcessing) {
      setActionType('edit');
      // If the item doesn't have a password, proceed directly
      if (!item.password) {
      //   handleEditAction();
      // } else {
        setPasswordModalVisible(true);
      }
    }
  };

  const handleDeletePress = () => {
    if (onDelete && !isProcessing) {
      setActionType('delete');
      // If the item doesn't have a password, proceed directly to confirmation
      if (!item.password) {
        setDeleteConfirmModalVisible(true);
      } else {
        setPasswordModalVisible(true);
      }
    }
  };

  const handlePasswordSuccess = () => {
    setPasswordModalVisible(false);
    
    if (actionType === 'edit' && onEdit) {
      // Use a short delay before calling edit action to allow modal to close completely
      setTimeout(() => {
        handleEditAction();
      }, 100);
    } else if (actionType === 'delete') {
      setDeleteConfirmModalVisible(true);
    }
  };

  const handleForgotPassword = () => {
    setPasswordModalVisible(false);
    setAdminPasswordModalVisible(true);
  };

  const handleAdminSuccess = () => {
    setAdminPasswordModalVisible(false);
    
    if (actionType === 'edit' && onEdit) {
      // Use a short delay before calling edit action to allow modal to close completely
      setTimeout(() => {
        handleEditAction();
      }, 100);
    } else if (actionType === 'delete') {
      setDeleteConfirmModalVisible(true);
    }
  };

  const handleEditAction = () => {
    if (onEdit) {
      setIsProcessing(true);
      
      // Close the detail view first
      onClose();
      
      // Use InteractionManager to ensure UI thread is not blocked
      InteractionManager.runAfterInteractions(() => {
        setTimeout(() => {
          onEdit(item);
          setIsProcessing(false);
        }, 500);
      });
    }
  };

  const handleConfirmDelete = () => {
    if (onDelete) {
      setIsProcessing(true);
      
      // Close the confirmation modal first
      setDeleteConfirmModalVisible(false);
      
      // Small delay to allow the modal to close before deletion
      setTimeout(() => {
        // Close the detail view
        onClose();
        
        // Use InteractionManager to ensure UI thread is not blocked
        InteractionManager.runAfterInteractions(() => {
          setTimeout(() => {
            onDelete(item);
            setIsProcessing(false);
          }, 300);
        });
      }, 100);
    }
  };

  return (
    <View className="flex-1 bg-black/80">
      {/* Optimized close button with hitSlop for larger touch area */}
      <TouchableOpacity 
        className="absolute top-10 right-5 z-20 w-10 h-10 rounded-full bg-white items-center justify-center"
        onPress={handleClose}
        activeOpacity={1}
        hitSlop={{ top: 15, right: 15, bottom: 15, left: 15 }}
        disabled={isProcessing}
      >
        <Text className="text-black text-lg font-bold">×</Text>
      </TouchableOpacity>
      
      <View className="flex-1 mt-12">
        {/* Item Image */}
        <View className="h-[50%] w-full">
          <Image
            source={typeof item.image === 'string' ? { uri: item.image } : item.image}
            style={{ width: '100%', height: '100%' }}
            resizeMode="cover"
          />
        </View>
        
        {/* Item Details */}
        <ScrollView className="bg-white rounded-t-3xl p-5">
          <View className="pb-28"> {/* Increased bottom padding for navigation bar */}
            <Text className="text-2xl font-bold mb-2">{item.name}</Text>
            
            {/* Description */}
            {item.description && (
              <View className="mb-4">
                <Text className="text-lg font-bold mb-2">Description</Text>
                <Text className="text-gray-700 leading-5">{item.description}</Text>
              </View>
            )}
            
            {/* Details */}
            <View className="mb-4">
              <Text className="text-lg font-bold mb-2">Details</Text>
              <View className="flex-row">
                <View className="flex-1">
                  <Text className="text-gray-500">Category</Text>
                  <Text className="text-black font-medium">{item.category}</Text>
                </View>
                <View className="flex-1">
                  <Text className="text-gray-500">Type</Text>
                  <Text className="text-black font-medium">{item.subCategory}</Text>
                </View>
              </View>
              <View className="flex-row mt-3">
                <View className="flex-1">
                  <Text className="text-gray-500">Color</Text>
                  <Text className="text-black font-medium">{item.color || 'Default'}</Text>
                </View>
              </View>
            </View>
          
            {/* Action Buttons */}
            <View className="flex-row justify-between mb-5">
              {onEdit && (
                <TouchableOpacity 
                  className="bg-blue-500 px-6 py-3 rounded-lg"
                  onPress={handleEditPress}
                  disabled={isProcessing}
                >
                  <Text className="text-white font-medium">Edit</Text>
                </TouchableOpacity>
              )}
              
              {onDelete && (
                <TouchableOpacity 
                  className="bg-red-500 px-6 py-3 rounded-lg"
                  onPress={handleDeletePress}
                  disabled={isProcessing}
                >
                  <Text className="text-white font-medium">Delete</Text>
                </TouchableOpacity>
              )}
            </View>
          
            {/* Close Button */}
            <TouchableOpacity 
              className="bg-black py-4 rounded-xl items-center mb-5"
              onPress={handleClose}
              disabled={isProcessing}
            >
              <Text className="text-white font-bold text-lg">Close</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
      
      {/* Password Modal - only show if item has a password */}
      <ClothingPasswordModal
        isVisible={passwordModalVisible}
        onClose={() => setPasswordModalVisible(false)}
        onSuccess={handlePasswordSuccess}
        correctPassword={item.password || ''}
        actionType={actionType}
        onForgotPassword={handleForgotPassword}
        itemName={item.name}
      />
      
      {/* Admin Password Modal - only show if item has a password */}
      <ClothingAdminPasswordModal
        isVisible={adminPasswordModalVisible}
        onClose={() => setAdminPasswordModalVisible(false)}
        onSuccess={handleAdminSuccess}
        itemPassword={item.password || ''}
        itemName={item.name}
      />
      
      {/* Delete Confirmation Modal */}
      <ClothingDeleteConfirmationModal
        isVisible={deleteConfirmModalVisible}
        onClose={() => setDeleteConfirmModalVisible(false)}
        onConfirm={handleConfirmDelete}
        itemName={item.name}
      />
    </View>
  );
};

export default ClothingItemDetail;
