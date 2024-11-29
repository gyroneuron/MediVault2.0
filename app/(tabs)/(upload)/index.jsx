import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  Platform,
  Dimensions
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { RadioButton } from 'react-native-paper';
import CustomButton from '../../../components/CustomButton';
import { Ionicons } from '@expo/vector-icons';
import { useGlobalContext } from '../../../lib/GlobalProvider';
import { supabase } from '../../../lib/supabase';

const { width } = Dimensions.get('window');

const DOCUMENT_TYPES = [
  'Lab diagnostic report',
  'Consultation report',
  'Medicine prescription',
  'Scan images',
  'X ray',
  'Invoice /Bill report'
];

const BASE_API_ENDPOINT = 'http://127.0.0.1:8000/process_pdf';
const TIMEOUT_DURATION = 300000; // 5 minutes in milliseconds
const POLL_INTERVAL = 5000; // 5 seconds
const MAX_UPLOAD_RETRIES = 3;
const UPLOAD_TIMEOUT = 60000; // 1 minute timeout for Supabase upload

const DocumentUpload = () => {
  const { userDetails } = useGlobalContext();
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [documentType, setDocumentType] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);
  const [processingStartTime, setProcessingStartTime] = useState(null);

  const selectDocument = useCallback(async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/*'],
        copyToCacheDirectory: true,
        multiple: false
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        const fileSize = result.assets[0].size;
        const maxSize = 10 * 1024 * 1024; // 10MB

        if (fileSize > maxSize) {
          Alert.alert("File Too Large", "Please select a file smaller than 10MB");
          return;
        }

        const fileType = result.assets[0].mimeType;
        const validTypes = [
          'application/pdf',
          'image/jpeg',
          'image/png',
          'image/gif',
          'image/bmp'
        ];

        if (!validTypes.includes(fileType)) {
          Alert.alert("Invalid File Type", "Please select a PDF or image file");
          return;
        }

        setSelectedDocument(result);
        setUploadProgress(0);
        setError(null);
      }
    } catch (error) {
      console.error('Document picking error:', error);
      setError('Failed to select document');
      Alert.alert("Error", "Failed to select document. Please try again.");
    }
  }, []);

  const uploadToSupabase = useCallback(async (base64Data, fileName, retryCount = 0) => {
    try {
      const timestamp = new Date().toISOString();
      const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
      //const path = `${userDetails.email}/${documentType}/${sanitizedFileName}`;
      const path = `${userDetails.email}/${documentType}/${new Date().toISOString()}/${fileName}`
      // Create a promise that rejects after the timeout
      console.log(fileName)
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Upload timeout')), UPLOAD_TIMEOUT);
      });

      // Create the upload promise
      const uploadPromise = supabase.storage
        .from("patient-docs")
        .upload(path, base64Data, {
          contentType: 'application/pdf',
          cacheControl: '3600',
          upsert: false
        });

      // Race between the timeout and the upload
      const { data, error } = await Promise.race([uploadPromise, timeoutPromise]);

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Supabase upload error:', error);
      
      // Implement retry logic
      if (retryCount < MAX_UPLOAD_RETRIES) {
        console.log(`Retrying upload (attempt ${retryCount + 1} of ${MAX_UPLOAD_RETRIES})...`);
        // Exponential backoff: wait longer between each retry
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, retryCount) * 1000));
        return uploadToSupabase(base64Data, fileName, retryCount + 1);
      }
      
      throw new Error(`Failed to upload to storage after ${MAX_UPLOAD_RETRIES} attempts: ${error.message}`);
    }
  }, [userDetails.email, documentType]);

  const processDocument = useCallback(async (formData, docType) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_DURATION);

    try {
      const encodedDocType = encodeURIComponent(docType);
      const url = `${BASE_API_ENDPOINT}/?report_type=${encodedDocType}`;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Accept': 'application/pdf',
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        try {
          const errorJson = JSON.parse(errorText);
          throw new Error(`Server error: ${JSON.stringify(errorJson.detail)}`);
        } catch (e) {
          throw new Error(`Server error: ${errorText}`);
        }
      }

      return await response.blob();
    } catch (error) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        throw new Error('Processing timed out after 5 minutes');
      }
      throw error;
    }
  }, []);

  const updateProgressBasedOnTime = useCallback(() => {
    if (!processingStartTime) return;
    
    const elapsed = Date.now() - processingStartTime;
    const progressPercent = Math.min((elapsed / TIMEOUT_DURATION) * 100, 90);
    setUploadProgress(Math.round(progressPercent));
  }, [processingStartTime]);

  const handleUpload = useCallback(async () => {
    if (!selectedDocument) {
      Alert.alert("Error", "Please select a document to upload.");
      return;
    }

    if (!documentType) {
      Alert.alert("Error", "Please select a document type.");
      return;
    }

    setIsSubmitting(true);
    setUploadProgress(0);
    setError(null);
    setProcessingStartTime(Date.now());

    const progressInterval = setInterval(() => {
      updateProgressBasedOnTime();
    }, 1000);

    try {
      const formData = new FormData();
      formData.append('file', {
        uri: Platform.OS === 'ios' 
          ? selectedDocument.assets[0].uri.replace('file://', '')
          : selectedDocument.assets[0].uri,
        name: selectedDocument.assets[0].name,
        type: selectedDocument.assets[0].mimeType || 'application/pdf'
      });

      // Process document with document type as query parameter
      const processedBlob = await processDocument(formData, documentType);
      setUploadProgress(90); // Update progress after processing is complete
      
      // Read processed file
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        
        reader.onload = async () => {
          try {
            const base64data = reader.result;
            
            // Upload to Supabase with retry logic
            await uploadToSupabase(
              base64data,
              `processed_${selectedDocument.assets[0].name}`
            );

            clearInterval(progressInterval);
            setUploadProgress(100);
            
            Alert.alert(
              "Success",
              "Document processed and uploaded successfully!",
              [
                {
                  text: "OK",
                  onPress: () => {
                    setSelectedDocument(null);
                    setDocumentType('');
                    setUploadProgress(0);
                    setProcessingStartTime(null);
                  }
                }
              ]
            );
            resolve();
          } catch (error) {
            reject(new Error(`Storage upload failed: ${error.message}`));
          }
        };

        reader.onerror = () => reject(new Error('Failed to read processed file'));
        reader.readAsDataURL(processedBlob);
      });

    } catch (error) {
      console.error('Upload error:', error);
      clearInterval(progressInterval);
      setError(error.message);
      
      const errorMessage = error.message.includes('timed out')
        ? "Document processing took longer than expected. Please try again or contact support if the issue persists."
        : `Upload failed: ${error.message}. Please try again.`;
      
      Alert.alert(
        error.message.includes('timed out') ? "Processing Timeout" : "Upload Failed",
        errorMessage
      );
    } finally {
      setIsSubmitting(false);
      setProcessingStartTime(null);
    }
  }, [selectedDocument, documentType, processDocument, uploadToSupabase, updateProgressBasedOnTime]);

  const renderLoadingOverlay = () => {
    if (!isSubmitting) return null;

    const timeElapsed = processingStartTime 
      ? Math.floor((Date.now() - processingStartTime) / 1000)
      : 0;

    return (
      <View 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}
      >
        <View 
          style={{
            backgroundColor: 'white',
            padding: 20,
            borderRadius: 10,
            alignItems: 'center',
            width: '80%'
          }}
        >
          <ActivityIndicator size="large" color="#0000ff" />
          <Text style={{ marginTop: 10, color: '#000', textAlign: 'center' }}>
            Processing... {uploadProgress}%{'\n'}
            Time elapsed: {Math.floor(timeElapsed / 60)}m {timeElapsed % 60}s
          </Text>
          <Text style={{ marginTop: 5, color: '#666', fontSize: 12, textAlign: 'center' }}>
            This may take up to 5 minutes
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 h-full w-full bg-pink-50 items-center justify-center">
      <View className="flex-1 p-4 w-[90%] space-y-3">
        {/* Header */}
        <Text className="text-2xl text-dark-background font-pbold text-center mb-4">
          Document Upload
        </Text>

        {/* Document Selection Area */}
        <Text className="text-lg font-semibold mb-2 text-dark-button">
          Select Document
        </Text>
        <TouchableOpacity
          onPress={selectDocument}
          className="border-dashed border border-dark-icon rounded-lg p-4 mb-4 items-center justify-center h-[20%]"
        >
          {selectedDocument && selectedDocument.assets && selectedDocument.assets[0] ? (
            <View className="items-center">
              <Ionicons name="document-text" size={36} color="#4B5563" />
              <Text className="text-dark-elevated-bg text-lg mt-2" numberOfLines={1}>
                {selectedDocument.assets[0].name}
              </Text>
            </View>
          ) : (
            <View className="items-center">
              <Ionicons name="cloud-upload" size={36} color="#4B5563" />
              <Text className="text-gray-500 text-base mt-2">
                Tap to select a document
              </Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Document Type Selection */}
        <Text className="text-lg font-psemibold mb-2 text-dark-button">
          Select Document Type:
        </Text>
        <ScrollView className="mb-4">
          {DOCUMENT_TYPES.map((type) => (
            <View key={type} className="flex-row items-center mb-2">
              <RadioButton
                value={type}
                color='#000000'
                uncheckedColor='#000000'
                status={documentType === type ? 'checked' : 'unchecked'}
                onPress={() => setDocumentType(type)}
              />
              <Text className="text-gray-700 ml-2">{type}</Text>
            </View>
          ))}
        </ScrollView>

        {/* Error Message */}
        {error && (
          <Text className="text-red-500 text-center mb-2">
            {error}
          </Text>
        )}

        {/* Upload Button */}
        <CustomButton
          name="Upload Document"
          handlePress={handleUpload}
          textstyle="font-pbold text-base text-white"
          submittingStatus={isSubmitting}
          disabled={!selectedDocument || !documentType || isSubmitting}
        />

        {/* Progress Indicator */}
        {uploadProgress > 0 && uploadProgress < 100 && (
          <View className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
            <View 
              className="bg-blue-600 h-2.5 rounded-full"
              style={{ width: `${uploadProgress}%` }}
            />
          </View>
        )}
      </View>

      {/* Loading Overlay */}
      {renderLoadingOverlay()}
    </SafeAreaView>
  );
};

export default DocumentUpload;