import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, Alert } from 'react-native';

interface ClothingPasswordModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSuccess: () => void;
  correctPassword: string;
  actionType: 'edit' | 'delete';
  onForgotPassword?: () => void;
  itemName: string;
}

const ClothingPasswordModal: React.FC<ClothingPasswordModalProps> = ({ 
  isVisible, 
  onClose, 
  onSuccess, 
  correctPassword,
  actionType,
  onForgotPassword,
  itemName
}) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Reset state when modal becomes visible
  useEffect(() => {
    if (isVisible) {
      setPassword('');
      setError('');
    }
  }, [isVisible]);

  const handleSubmit = () => {
    // If no password is set for the item, we'll allow any input
    if (!correctPassword || password === correctPassword) {
      setPassword('');
      setError('');
      onSuccess();
    } else {
      setError('Incorrect password. Please try again.');
    }
  };

  const handleClose = () => {
    setPassword('');
    setError('');
    onClose();
  };

  const handleForgotPassword = () => {
    setPassword('');
    setError('');
    if (onForgotPassword) {
      onForgotPassword();
    }
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={handleClose}
    >
      <View className="flex-1 justify-center items-center bg-black/50">
        <View className="w-[80%] bg-white rounded-xl p-5">
          <Text className="text-xl font-bold text-center mb-4">
            {actionType === 'edit' ? 'Edit Clothing Item' : 'Delete Clothing Item'}
          </Text>
          
          <Text className="text-gray-700 mb-4 text-center">
            Please enter the password to {actionType === 'edit' ? 'edit' : 'delete'} "{itemName}".
          </Text>
          
          <TextInput
            className="border border-gray-300 rounded-lg p-3 bg-white mb-3"
            value={password}
            onChangeText={setPassword}
            placeholder="Enter password"
            secureTextEntry
          />
          
          {error ? <Text className="text-red-500 mb-3 text-center">{error}</Text> : null}
          
          <View className="flex-row justify-between mt-4">
            <TouchableOpacity 
              onPress={handleForgotPassword}
              className="px-2 py-1"
            >
              <Text className="text-blue-500">Forgot Password?</Text>
            </TouchableOpacity>
            
            <View className="flex-row">
              <TouchableOpacity 
                className="px-4 py-2 mr-2"
                onPress={handleClose}
              >
                <Text className="text-gray-600">Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                className="px-4 py-2 rounded-lg bg-blue-500"
                onPress={handleSubmit}
              >
                <Text className="text-white font-medium">Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ClothingPasswordModal;
