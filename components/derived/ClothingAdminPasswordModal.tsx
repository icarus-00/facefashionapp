import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, Alert } from 'react-native';

// This is a simple admin password - in a real app, this would be more secure
const ADMIN_PASSWORD = "admin123";

interface ClothingAdminPasswordModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSuccess: () => void;
  itemPassword: string;
  itemName: string;
}

const ClothingAdminPasswordModal: React.FC<ClothingAdminPasswordModalProps> = ({ 
  isVisible, 
  onClose, 
  onSuccess,
  itemPassword,
  itemName
}) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showItemPassword, setShowItemPassword] = useState(false);
  
  // Reset state when modal becomes visible
  useEffect(() => {
    if (isVisible) {
      setPassword('');
      setError('');
      setShowItemPassword(false);
    }
  }, [isVisible]);

  const handleSubmit = () => {
    if (password === ADMIN_PASSWORD) {
      setPassword('');
      setError('');
      setShowItemPassword(true);
    } else {
      setError('Incorrect admin password. Please try again.');
    }
  };

  const handleClose = () => {
    setPassword('');
    setError('');
    setShowItemPassword(false);
    onClose();
  };

  const handleContinue = () => {
    setPassword('');
    setError('');
    setShowItemPassword(false);
    onSuccess();
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
          {!showItemPassword ? (
            <>
              <Text className="text-xl font-bold text-center mb-4">
                Admin Access
              </Text>
              
              <Text className="text-gray-700 mb-4 text-center">
                Please enter the admin password to retrieve the password for "{itemName}".
              </Text>
              
              <TextInput
                className="border border-gray-300 rounded-lg p-3 bg-white mb-3"
                value={password}
                onChangeText={setPassword}
                placeholder="Enter admin password"
                secureTextEntry
              />
              
              {error ? <Text className="text-red-500 mb-3 text-center">{error}</Text> : null}
              
              <View className="flex-row justify-end mt-4">
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
            </>
          ) : (
            <>
              <Text className="text-xl font-bold text-center mb-4">
                Item Password
              </Text>
              
              <Text className="text-gray-700 mb-4 text-center">
                The password for "{itemName}" is:
              </Text>
              
              <View className="bg-gray-100 p-3 rounded-lg mb-4">
                <Text className="text-center font-bold text-xl">{itemPassword || 'No password set'}</Text>
              </View>
              
              <Text className="text-gray-500 text-xs mb-4 text-center">
                {itemPassword 
                  ? 'Please make note of this password. You will need it to edit or delete this item in the future.' 
                  : 'This item does not have a password set. You can edit or delete it without a password.'}
              </Text>
              
              <TouchableOpacity 
                className="px-4 py-2 rounded-lg bg-blue-500 w-full"
                onPress={handleContinue}
              >
                <Text className="text-white font-medium text-center">Continue</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
};

export default ClothingAdminPasswordModal;
