import React, { useState, useCallback } from 'react';
import { View, Text, Image, TouchableOpacity, Modal, Dimensions, ScrollView } from 'react-native';
import { Model } from '@/interfaces/model';
import Carousel from 'react-native-reanimated-carousel';
import PasswordModal from './PasswordModal';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import AdminPasswordModal from './AdminPasswordModal';

interface ModelDetailProps {
  model: Model;
  onClose: () => void;
  onDressUp: (model: Model) => void;
  onEdit: (model: Model) => void;
  onDelete: (model: Model) => void;
}

const { width, height } = Dimensions.get('window');

const ModelDetail: React.FC<ModelDetailProps> = ({ model, onClose, onDressUp, onEdit, onDelete }) => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isDressingMode, setIsDressingMode] = useState(false);
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [deleteConfirmModalVisible, setDeleteConfirmModalVisible] = useState(false);
  const [adminPasswordModalVisible, setAdminPasswordModalVisible] = useState(false);
  const [actionType, setActionType] = useState<'edit' | 'delete'>('edit');

  // Memoize the close handler to improve performance
  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  const handleDressUp = () => {
    setIsDressingMode(true);
    onDressUp(model);
  };

  const handleEditPress = () => {
    setActionType('edit');
    setPasswordModalVisible(true);
  };

  const handleDeletePress = () => {
    setActionType('delete');
    setPasswordModalVisible(true);
  };

  const handlePasswordSuccess = () => {
    setPasswordModalVisible(false);
    
    if (actionType === 'edit') {
      onEdit(model);
    } else {
      setDeleteConfirmModalVisible(true);
    }
  };

  const handleForgotPassword = () => {
    setPasswordModalVisible(false);
    setAdminPasswordModalVisible(true);
  };

  const handleAdminSuccess = () => {
    setAdminPasswordModalVisible(false);
    
    if (actionType === 'edit') {
      onEdit(model);
    } else {
      setDeleteConfirmModalVisible(true);
    }
  };

  const handleConfirmDelete = () => {
    setDeleteConfirmModalVisible(false);
    onDelete(model);
  };

  const renderCarouselItem = ({ item }: { item: any }) => (
    <View className="w-full h-full justify-center items-center">
      <Image 
        source={typeof item === 'string' ? { uri: item } : item}
        className="w-full h-full"
        resizeMode="cover"
      />
    </View>
  );

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={true}
      onRequestClose={handleClose}
    >
      <View className="flex-1 bg-black/80">
        {/* Optimized close button with hitSlop for larger touch area */}
        <TouchableOpacity 
          className="absolute top-10 right-5 z-10 w-10 h-10 rounded-full bg-white items-center justify-center"
          onPress={handleClose}
          activeOpacity={0.7}
          hitSlop={{ top: 15, right: 15, bottom: 15, left: 15 }}
        >
          <Text className="text-black text-lg font-bold">×</Text>
        </TouchableOpacity>
        
        <View className="flex-1 mt-12">
          <View className="h-[50%] w-full">
            <Carousel
              loop
              width={width}
              height={height / 2}
              autoPlay={false}
              data={model.images}
              scrollAnimationDuration={1000}
              renderItem={renderCarouselItem}
              onSnapToItem={(index) => setActiveSlide(index)}
            />
            <View className="absolute bottom-4 left-0 right-0 flex-row justify-center">
              {model.images.map((_, index) => (
                <View
                  key={index}
                  className={`h-2 w-2 rounded-full mx-1 ${
                    index === activeSlide ? 'bg-white' : 'bg-white/50'
                  }`}
                />
              ))}
            </View>
          </View>
          
          <ScrollView className="bg-white rounded-t-3xl p-5">
            <View className="pb-28"> {/* Increased bottom padding for navigation bar */}
              <Text className="text-2xl font-bold mb-2">{model.name}</Text>
              
              <View className="mb-4">
                <Text className="text-lg font-bold mb-2">About</Text>
                <Text className="text-gray-700 leading-5">{model.description}</Text>
              </View>
              
              <View className="mb-4">
                <Text className="text-lg font-bold mb-2">Details</Text>
                <View className="flex-row">
                  <View className="flex-1">
                    <Text className="text-gray-500">Gender</Text>
                    <Text className="text-black font-medium">{model.gender}</Text>
                  </View>
                  <View className="flex-1">
                    <Text className="text-gray-500">Age</Text>
                    <Text className="text-black font-medium">{model.age || 'Not specified'}</Text>
                  </View>
                </View>
              </View>
            
              <View className="flex-row justify-between mb-5">
                <TouchableOpacity 
                  className="bg-blue-500 px-3 py-2 rounded-lg"
                  onPress={handleEditPress}
                >
                  <Text className="text-white font-medium">Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  className="bg-red-500 px-3 py-2 rounded-lg"
                  onPress={handleDeletePress}
                >
                  <Text className="text-white font-medium">Delete</Text>
                </TouchableOpacity>
              </View>
            
              <TouchableOpacity 
                className="bg-black py-4 rounded-xl items-center mb-5"
                onPress={isDressingMode ? onClose : handleDressUp}
              >
                <Text className="text-white font-bold text-lg">
                  {isDressingMode ? 'Close' : 'Strut Your Stuff!'}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      
        {/* Password Modal */}
        <PasswordModal 
          isVisible={passwordModalVisible}
          onClose={() => setPasswordModalVisible(false)}
          onSuccess={handlePasswordSuccess}
          correctPassword={model.password}
          actionType={actionType}
          onForgotPassword={handleForgotPassword}
        />
      
        {/* Admin Password Modal */}
        <AdminPasswordModal 
          isVisible={adminPasswordModalVisible}
          onClose={() => setAdminPasswordModalVisible(false)}
          onSuccess={handleAdminSuccess}
          modelPassword={model.password}
        />
      
        {/* Delete Confirmation Modal */}
        <DeleteConfirmationModal 
          isVisible={deleteConfirmModalVisible}
          onClose={() => setDeleteConfirmModalVisible(false)}
          onConfirm={handleConfirmDelete}
          modelName={model.name}
        />
      </View>
    </Modal>
  );
};

export default ModelDetail;