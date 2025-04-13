import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, Alert } from 'react-native';

// This is a simple admin password - in a real app, this would be more secure
const ADMIN_PASSWORD = "admin123";

interface AdminPasswordModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSuccess: () => void;
  modelPassword: string;
}

const AdminPasswordModal: React.FC<AdminPasswordModalProps> = ({ 
  isVisible, 
  onClose, 
  onSuccess,
  modelPassword
}) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showModelPassword, setShowModelPassword] = useState(false);

  const handleSubmit = () => {
    if (password === ADMIN_PASSWORD) {
      setPassword('');
      setError('');
      setShowModelPassword(true);
    } else {
      setError('Incorrect admin password. Please try again.');
    }
  };

  const handleClose = () => {
    setPassword('');
    setError('');
    setShowModelPassword(false);
    onClose();
  };

  const handleContinue = () => {
    setPassword('');
    setError('');
    setShowModelPassword(false);
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
          {!showModelPassword ? (
            <>
              <Text className="text-xl font-bold text-center mb-4">
                Admin Access
              </Text>
              
              <Text className="text-gray-700 mb-4 text-center">
                Please enter the admin password to view this actor's password.
              </Text>
              
              <TextInput
                className="border border-gray-300 rounded-lg p-3 bg-white mb-3"
                value={password}
                onChangeText={setPassword}
                placeholder="Enter admin password"
                secureTextEntry
              />
              
              {error ? <Text className="text-red-500 mb-3">{error}</Text> : null}
              
              <View className="flex-row justify-end mt-2">
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
                Actor Password
              </Text>
              
              <Text className="text-gray-700 mb-2 text-center">
                The password for this actor is:
              </Text>
              
              <View className="bg-gray-100 p-3 rounded-lg mb-5">
                <Text className="text-center font-bold text-lg">{modelPassword}</Text>
              </View>
              
              <Text className="text-gray-500 text-xs mb-4 text-center">
                Please store this password securely. You will need it to edit or delete this actor in the future.
              </Text>
              
              <TouchableOpacity 
                className="px-4 py-2 rounded-lg bg-blue-500 w-full items-center"
                onPress={handleContinue}
              >
                <Text className="text-white font-medium">Continue</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
};

export default AdminPasswordModal;
