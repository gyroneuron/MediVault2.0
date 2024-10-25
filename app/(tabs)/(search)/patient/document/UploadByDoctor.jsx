import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, ScrollView, SafeAreaView, ActivityIndicator } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { RadioButton } from 'react-native-paper';
import CustomButton from '../../../../../components/CustomButton';
import { Ionicons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import { decode } from "base64-arraybuffer";
import { useGlobalContext } from '../../../../../lib/GlobalProvider';
import { supabase } from '../../../../../lib/supabase';
import { Redirect, router, useLocalSearchParams } from 'expo-router';
import PatientProfile from '../[id]';


const UploadByDoctor = () => {
  const { userDetails, loading, isLoggedIn } = useGlobalContext();
  const { patient_id, patient_email} = useLocalSearchParams();
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [documentType, setDocumentType] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [documentPicked, setDocumentPicked] = useState(false);

  if(!isLoggedIn){
    <Redirect href="index" />
  }

  if(loading) {
    return (
      <SafeAreaView className="flex-1 h-full w-full bg-pink-50 items-center justify-center">
        <ActivityIndicator size="large" color="#0000ff" />
        </SafeAreaView>
    )
  }


  const selectDocument = async () => {
    setIsSubmitting(true);
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',
        copyToCacheDirectory: false,
      });
      if (!result.canceled) {
        setSelectedDocument(result);
        console.log("Selected Document:", result);
      } else {
        setTimeout(() => {
          Alert.alert("No document selected", "Pick a document to upload.");
        }, 100);
      }
    } catch (error) {
      Alert.alert("Document picking error", error.message);
    } finally{
      setIsSubmitting(false);
    }
  };

  //Check if Doctor has access
  const checkAccess = async (patientId) => {
    if (!userDetails) {
      Alert.alert('Please login first', 'You need to be logged in to upload documents');
      return;
    }

    if (!selectedDocument) {
      Alert.alert("No document selected", "Please select a document to upload.");
      return;
    }

    if (!documentType) {
      Alert.alert("No document type selected", "Please select a document type.");
      return;
    }

    setIsSubmitting(true);
    try {
      const { data, error } = await supabase
        .from('access_requests')
        .select('*')
        .eq('doctor_id', userDetails.id)
        .eq('patient_id', patientId)
        .single();

        if (error) {
          Alert.alert('Could not verify access rights', error.message);
        } 

        if (!data || data.status === 'pending' || data.status === 'rejected') {
          Alert.alert('Access Denied', "You do not have access to this patient's documents");
        }
        await SaveDocumentToDatabase();
    } catch (error) {
      // console.error('Uncaught error in checkAccess:', error);
      Alert.alert('Error', 'An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const SaveDocumentToDatabase = async () => { 
    

    const path = `${patient_email}/${documentType}//${new Date().toISOString()}/${selectedDocument.assets[0].name}`;
    const publicUrl = await uploadDocument(selectedDocument.assets[0].uri, path);
    // console.log(publicUrl);

    if (publicUrl) {
      // Save the document to the database
      try {
        const { data, error } = await supabase
          .from('documents')
          .insert([
            {
              user_id: patient_id,
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
          handlePress={checkAccess}
          textstyle={"font-pbold text-base text-white"}
          submittingStatus={isSubmitting}
        />
      </View>
    </SafeAreaView>
  );
};

export default UploadByDoctor;