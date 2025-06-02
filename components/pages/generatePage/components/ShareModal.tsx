import React, { useState } from 'react';
import { Modal, Pressable, Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { Colors } from '@/constants/Colors';

interface ShareModalProps {
  visible: boolean;
  onClose: () => void;
  imageUrl: string;
  videoUrl?: string;
}

const ShareModal: React.FC<ShareModalProps> = ({ visible, onClose, imageUrl, videoUrl }) => {
  const [copiedImageUrl, setCopiedImageUrl] = useState(false);
  const [copiedVideoUrl, setCopiedVideoUrl] = useState(false);

  const copyToClipboard = async (text: string, type: 'image' | 'video') => {
    await Clipboard.setStringAsync(text);
    if (type === 'image') {
      setCopiedImageUrl(true);
      setTimeout(() => {
        setCopiedImageUrl(false);
        onClose();
      }, 1000); // Close after 1 second
    } else {
      setCopiedVideoUrl(true);
      setTimeout(() => {
        setCopiedVideoUrl(false);
        onClose();
      }, 1000); // Close after 1 second
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <Pressable style={styles.centeredView} onPress={onClose}>
        <View style={styles.modalView} onStartShouldSetResponder={() => true}>
          <Text style={styles.modalTitle}>Share Generation</Text>

          <View style={styles.urlContainer}>
            <Text style={styles.urlLabel}>Image URL:</Text>
            <Text style={styles.urlText} numberOfLines={1} ellipsizeMode="tail">{imageUrl}</Text>
            <TouchableOpacity
              onPress={() => copyToClipboard(imageUrl, 'image')}
              style={styles.copyButton}
            >
              <Text style={styles.copyButtonText}>{copiedImageUrl ? 'Copied!' : 'Copy'}</Text>
            </TouchableOpacity>
          </View>

          {videoUrl && (
            <View style={styles.urlContainer}>
              <Text style={styles.urlLabel}>Video URL:</Text>
              <Text style={styles.urlText} numberOfLines={1} ellipsizeMode="tail">{videoUrl}</Text>
              <TouchableOpacity
                onPress={() => copyToClipboard(videoUrl, 'video')}
                style={styles.copyButton}
              >
                <Text style={styles.copyButtonText}>{copiedVideoUrl ? 'Copied!' : 'Copy'}</Text>
              </TouchableOpacity>
            </View>
          )}

          <Pressable
            style={[styles.button, styles.buttonClose]}
            onPress={onClose}
          >
            <Text style={styles.textStyle}>Close</Text>
          </Pressable>
        </View>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
 
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '80%', // Adjust width as needed
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
 color: Colors.light.primary[500],
    textAlign: 'center',
    marginBottom: 20,
  },
  urlContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    width: '100%',
  },
  urlLabel: {
    fontWeight: 'bold',
 color: Colors.light.primary[500],
    marginRight: 10,
    width: 80, // Fixed width for labels
  },
  urlText: {
    flex: 1, // Allow text to take up remaining space
    marginRight: 10,
    fontSize: 12, // Smaller font size for URLs
  },
 copyButton: {  
    backgroundColor: Colors.light.primary[500],
    borderRadius: 5,
    padding: 5,
  },
  
  copyButtonText: {
    width:40,
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 12, // Smaller font size for button text
  },
  button: {
    width:"100%",
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginTop: 15,
  },
 buttonClose: {
    backgroundColor: Colors.light.primary[500],
  },
  textStyle: {
    color: Colors.light.background,

    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default ShareModal;