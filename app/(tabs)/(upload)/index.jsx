import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, ScrollView, SafeAreaView } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { RadioButton } from 'react-native-paper';
import CustomButton from '../../../components/CustomButton';
import { Ionicons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import { decode } from "base64-arraybuffer";
import { useGlobalContext } from '../../../lib/GlobalProvider';
import { supabase } from '../../../lib/supabase';


const index = () => {
  const { userDetails, loading, isLoggedIn } = useGlobalContext();

  const [selectedDocument, setSelectedDocument] = useState(null);
  const [documentType, setDocumentType] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [documentPicked, setDocumentPicked] = useState(false);

  const selectDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',
        copyToCacheDirectory: false,
      });
      if (!result.canceled) {
        setSelectedDocument(result);
      } else {
        setTimeout(() => {
          Alert.alert("No document selected", "Pick a document to upload.");
        }, 100);
      }
    } catch (error) {
      Alert.alert("Document picking error", error.message);
    }
  };

  const SaveDocumentToDatabase = async () => { 
    if (!selectedDocument) {
      Alert.alert("No document selected", "Please select a document to upload.");
      return;
    }

    if (!documentType) {
      Alert.alert("No document type selected", "Please select a document type.");
      return;
    }

    const path = `${userDetails.email}/${new Date().toISOString()}/${documentType}/${selectedDocument.assets[0].name}`;
    const publicUrl = await uploadDocument(selectedDocument.assets[0].uri, path);
    console.log(publicUrl);

    if (publicUrl) {
      // Save the document to the database
      try {
        const { data, error } = await supabase
          .from('documents')
          .insert([
            {
              user_id: userDetails.id,
              file_type: documentType,
              file_name: selectedDocument.assets[0].name,
              file_url: publicUrl,
            },
          ]);

        if (error) {
          console.error("Save Document Error:", error);
          Alert.alert("Save Document Error", error.message);
        } else {
          console.log("Document Saved to Database!");
          Alert.alert("Document Uploaded Successfully", "Your document has been uploaded successfully.");
          setDocumentType('');
          setDocumentPicked(false);
        }
      } catch (error) {
        console.error("Save Document Error:", error);
        Alert.alert("Save Document Error", error.message);
      } finally {
        setIsSubmitting(false);
      }
    }
  }

  const uploadDocument = async (uri, path) => {
    try {
      setIsSubmitting(true);

      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: 'base64'
      });

      const { data, error } = await supabase.storage
        .from("patient-docs")
        .upload(path, decode(base64), {
          contentType: selectedDocument.assets[0].mimeType || 'application/pdf',
        });

      if (error) {
        console.error("Upload Error:", error);
        Alert.alert("Upload Error", error.message);
        return;
      } else {
        console.log("Document Uploaded to Supabase!");
        const { data: publicData } = supabase.storage
        .from("patient-docs")
        .getPublicUrl(path);

        if (publicData) {
          console.log("Public URL Fetched Successfully:", publicData.publicUrl);
          return publicData.publicUrl;
        } else {
          console.error("Error fetching public URL");
          Alert.alert("Error", "Failed to fetch public URL.");
          return null;
        }
      }
    } catch (error) {
      console.error("Upload Document Error:", error);
      Alert.alert("Upload Document Error", error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 h-full w-full bg-pink-50 items-center justify-center">
      <View className="flex-1 p-4 w-[90%] space-y-3">
        <Text className="text-2xl text-dark-background font-pbold text-center mb-4">Document Upload</Text>

        <Text className="text-lg font-semibold mb-2 text-dark-button">Select Document</Text>
        <TouchableOpacity
          onPress={selectDocument}
          className="border-dashed border border-dark-icon rounded-lg p-4 mb-4 items-center justify-center space-y-4 h-[20%]"
        >
          {
            selectedDocument && selectedDocument.assets && selectedDocument.assets[0] ? (
              <Text className="text-dark-elevated-bg text-lg">{selectedDocument.assets[0].name}</Text>
            ) : (
              <Ionicons name="document-attach" size={36} color="blue" />
            )
          }
        </TouchableOpacity>

        <Text className="text-lg font-psemibold mb-2 text-dark-button">Select Document Type:</Text>
        <ScrollView className="mb-4">
          {['Lab diagnostic report', 'Consultation report', 'Medicine prescription', 'Scan images', 'X ray', 'Invoice /Bill report'].map((type) => (
            <View key={type} className="flex-row items-center mb-2">
              <RadioButton
                value={type}
                color='#0D6EFD'
                uncheckedColor='#0D6EFD'
                status={documentType === type ? 'checked' : 'unchecked'}
                onPress={() => setDocumentType(type)}
              />
              <Text className="text-gray-700">{type}</Text>
            </View>
          ))}
        </ScrollView>

        <CustomButton
          name={"Upload Document"}
          handlePress={SaveDocumentToDatabase}
          textstyle={"font-pbold text-base text-white"}
          submittingStatus={isSubmitting}
        />
      </View>
    </SafeAreaView>
  );
};

export default index;