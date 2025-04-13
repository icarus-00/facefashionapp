import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ModalFilter from "@/components/derived/ModelFilter";
import ModelGallery from "@/components/derived/ModelGallery";
import ModelDetail from "@/components/derived/ModelDetail";
import AddButton from "@/components/derived/AddButton";
import AddModelForm from "@/components/derived/AddModelForm";
import { Model } from "@/interfaces/model";
import { modelData } from "@/constants/modelData";

const ModelSelection = () => {
  const router = useRouter();
  const [selectedGender, setSelectedGender] = useState<string>("Male");
  const [selectedModel, setSelectedModel] = useState<Model | null>(null);
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [models, setModels] = useState<Model[]>(modelData);
  const [editingModel, setEditingModel] = useState<Model | null>(null);

  // Load custom models from AsyncStorage on component mount
  useEffect(() => {
    const loadCustomModels = async () => {
      try {
        const storedModelsJson = await AsyncStorage.getItem("customModels");

        if (storedModelsJson) {
          const storedModels = JSON.parse(storedModelsJson);
          // Combine stored models with default models
          setModels([...modelData, ...storedModels]);
        }
      } catch (error) {
        console.error("Error loading custom models:", error);
      }
    };

    loadCustomModels();
  }, []);

  const handleSelectModel = (model: Model) => {
    setSelectedModel(model);
  };

  const handleCloseDetail = () => {
    setSelectedModel(null);
  };

  const handleDressUp = (model: Model) => {
    // Navigate to dressing screen with the selected model
    router.push({
      pathname: "/(auth)/(tabs)/outfit",
      params: { modelId: model.id },
    });
  };

  const handleAddModel = () => {
    setEditingModel(null);
    setShowAddForm(true);
  };

  const handleEditModel = (model: Model) => {
    setEditingModel(model);
    setSelectedModel(null);
    setShowAddForm(true);
  };

  const handleDeleteModel = async (model: Model) => {
    try {
      // Get existing custom models from AsyncStorage
      const storedModelsJson = await AsyncStorage.getItem("customModels");

      if (storedModelsJson) {
        let customModels: Model[] = JSON.parse(storedModelsJson);

        // Filter out the model to delete
        customModels = customModels.filter((m) => m.id !== model.id);

        // Save updated custom models back to AsyncStorage
        await AsyncStorage.setItem(
          "customModels",
          JSON.stringify(customModels)
        );

        // Update the models state
        setModels((prevModels) => prevModels.filter((m) => m.id !== model.id));

        console.log("Model deleted successfully:", model.id);
      }

      // Close the model detail view
      setSelectedModel(null);
    } catch (error) {
      console.error("Error deleting model:", error);
      Alert.alert("Error", "Failed to delete the actor. Please try again.");
    }
  };

  const handleCloseAddForm = () => {
    setShowAddForm(false);
    setEditingModel(null);
  };

  const handleSaveModel = async (newModel: Model) => {
    const isEditing = !!editingModel;

    try {
      // Get existing custom models from AsyncStorage
      const storedModelsJson = await AsyncStorage.getItem("customModels");
      let customModels: Model[] = [];

      if (storedModelsJson) {
        customModels = JSON.parse(storedModelsJson);
      }

      if (isEditing) {
        // Update existing model
        customModels = customModels.map((model) =>
          model.id === newModel.id ? newModel : model
        );

        // Update models state
        setModels((prevModels) =>
          prevModels.map((model) =>
            model.id === newModel.id ? newModel : model
          )
        );
      } else {
        // Add new model
        customModels.push(newModel);

        // Update models state
        setModels((prevModels) => [...prevModels, newModel]);
      }

      // Save updated custom models back to AsyncStorage
      await AsyncStorage.setItem("customModels", JSON.stringify(customModels));

      console.log(
        `Model ${isEditing ? "updated" : "saved"} successfully:`,
        newModel.id
      );
    } catch (error) {
      console.error(`Error ${isEditing ? "updating" : "saving"} model:`, error);
      Alert.alert(
        "Error",
        `Failed to ${
          isEditing ? "update" : "save"
        } the actor. Please try again.`
      );
    }

    setShowAddForm(false);
    setEditingModel(null);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {showAddForm ? (
        <AddModelForm
          onClose={handleCloseAddForm}
          onSave={handleSaveModel}
          editModel={editingModel || undefined}
        />
      ) : (
        <>
          <View className="flex-row justify-between items-center px-5 py-4">
            <View className="flex-1">
              <Text className="text-2xl font-bold text-black">
                Model Selection
              </Text>
              <Text className="text-base text-gray-600 mt-1">
                Choose a model to dress up
              </Text>
            </View>
            <AddButton onPress={handleAddModel} />
          </View>

          <ModalFilter
            selectedGender={selectedGender}
            onSelectGender={setSelectedGender}
          />

          <ModelGallery
            models={models}
            onSelectModel={handleSelectModel}
            selectedGender={selectedGender}
          />

          {selectedModel && (
            <ModelDetail
              model={selectedModel}
              onClose={handleCloseDetail}
              onDressUp={handleDressUp}
              onEdit={handleEditModel}
              onDelete={handleDeleteModel}
            />
          )}
        </>
      )}
    </SafeAreaView>
  );
};

export default ModelSelection;
