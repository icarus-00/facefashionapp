import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, Alert } from 'react-native';

interface PasswordModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSuccess: () => void;
  correctPassword: string;
  actionType: 'edit' | 'delete';
  onForgotPassword?: () => void;
}

const PasswordModal: React.FC<PasswordModalProps> = ({ 
  isVisible, 
  onClose, 
  onSuccess, 
  correctPassword,
  actionType,
  onForgotPassword
}) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (password === correctPassword) {
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
            {actionType === 'edit' ? 'Edit Actor' : 'Delete Actor'}
          </Text>
          
          <Text className="text-gray-700 mb-4 text-center">
            Please enter the password to {actionType === 'edit' ? 'edit' : 'delete'} this actor.
          </Text>
          
          <TextInput
            className="border border-gray-300 rounded-lg p-3 bg-white mb-3"
            value={password}
            onChangeText={setPassword}
            placeholder="Enter password"
            secureTextEntry
          />
          
          {error ? <Text className="text-red-500 mb-3">{error}</Text> : null}
          
          {onForgotPassword && (
            <TouchableOpacity 
              className="mb-3"
              onPress={handleForgotPassword}
            >
              <Text className="text-blue-500 text-center">Forgot Password? Use Admin Access</Text>
            </TouchableOpacity>
          )}
          
          <View className="flex-row justify-end mt-2">
            <TouchableOpacity 
              className="px-4 py-2 mr-2"
              onPress={handleClose}
            >
              <Text className="text-gray-600">Cancel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              className={`px-4 py-2 rounded-lg ${actionType === 'delete' ? 'bg-red-500' : 'bg-blue-500'}`}
              onPress={handleSubmit}
            >
              <Text className="text-white font-medium">Submit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default PasswordModal;
