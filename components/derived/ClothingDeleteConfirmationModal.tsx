import React from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';

interface ClothingDeleteConfirmationModalProps {
  isVisible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName: string;
}

const ClothingDeleteConfirmationModal: React.FC<ClothingDeleteConfirmationModalProps> = ({ 
  isVisible, 
  onClose, 
  onConfirm,
  itemName
}) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-center items-center bg-black/50">
        <View className="w-[80%] bg-white rounded-xl p-5">
          <Text className="text-xl font-bold text-center mb-4">
            Confirm Deletion
          </Text>
          
          <Text className="text-gray-700 mb-4 text-center">
            Are you sure you want to delete clothing item "{itemName}"? This action cannot be undone.
          </Text>
          
          <View className="flex-row justify-end mt-4">
            <TouchableOpacity 
              className="px-4 py-2 mr-2"
              onPress={onClose}
            >
              <Text className="text-gray-600">Cancel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              className="px-4 py-2 rounded-lg bg-red-500"
              onPress={onConfirm}
            >
              <Text className="text-white font-medium">Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ClothingDeleteConfirmationModal;
