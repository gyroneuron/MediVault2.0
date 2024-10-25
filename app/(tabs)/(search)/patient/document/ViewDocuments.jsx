import { View, Text, SafeAreaView, FlatList, Image, TouchableOpacity, ActivityIndicator, Dimensions} from "react-native";
import React, { useEffect, useState, useCallback } from "react";
import { useGlobalContext } from "../../../../../lib/GlobalProvider";
import { supabase } from "../../../../../lib/supabase";
import { RefreshControl } from "react-native";
import CustomButton from "../../../../../components/CustomButton";
import { router, useLocalSearchParams } from "expo-router";
import Modal from "react-native-modal";
import Pdf from 'react-native-pdf';

const ViewDocuments = () => {
  const { userDetails, loading, isLoggedIn } = useGlobalContext();
  const [patientProfile, setPatientProfile] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [isPdfVisible, setIsPdfVisible] = useState(false);
  const [selectedPdfUrl, setSelectedPdfUrl] = useState(null);
  const { patient_id } = useLocalSearchParams();
  const { width, height } = Dimensions.get('window');

  if (!isLoggedIn) {
    return <Redirect href="index" />;
  }

  if (loading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-pink-50">
        <ActivityIndicator size="large" color="#0000ff" />
      </SafeAreaView>
    );
  }

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchUserDocuments();
    setRefreshing(false);
  };

  const fetchUserDocuments = async () => {
    try {
      const { data, error } = await supabase
        .from("documents")
        .select()
        .eq("user_id", patient_id);

      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select()
        .eq("id", patient_id)
        .single();

      if (error || profileError) {
        console.error("Error fetching user documents:", error);
        console.error("Error fetching user profile:", profileError);
      } else {
        setDocuments(data);
        setPatientProfile(profileData);
      }
    } catch (error) {
      console.error("Error fetching documents:", error);
    }
  };

  useEffect(() => {
    if (isLoggedIn && userDetails.id) {
      fetchUserDocuments();
    }
  }, []);

  const handleDocumentPress = useCallback((fileUrl) => {
    console.log("Selected PDF URL:", fileUrl); // Log the URL for debugging
    setSelectedPdfUrl(fileUrl.endsWith(".pdf") ? fileUrl : null); // Ensure it's a PDF
    setIsPdfVisible(true);
  }, []);

  const closeViewer = () => {
    setIsPdfVisible(false);
    setSelectedPdfUrl(null);
  };

  const renderItem = useCallback(
    ({ item }) => (
      <View className="bg-white rounded-lg shadow mb-3 p-4">
        <Text className="text-xl font-semibold overflow-auto">{item.file_name}</Text>
        <Text className="text-sm text-gray-500">{item.uploaded_at}</Text>
        <TouchableOpacity onPress={() => handleDocumentPress(item.file_url)}>
          <Text className="text-blue-500 mt-2">View Document</Text>
        </TouchableOpacity>
      </View>
    ),
    [handleDocumentPress]
  );

  const PdfModal = () => (
    <Modal
      visible={isPdfVisible}
      onRequestClose={closeViewer}
      animationType="slide"
      transparent={true}
    >
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-row justify-between items-center p-4 bg-pink-50">
          <Text className="text-lg font-pbold">Document Viewer</Text>
          <TouchableOpacity onPress={closeViewer}>
            <Text className="text-blue-500 font-pbold">Close</Text>
          </TouchableOpacity>
        </View>
        {selectedPdfUrl ? (
          <Pdf
            trustAllCerts={false}
            source={{ uri: selectedPdfUrl }}
            onLoadComplete={(numberOfPages, filePath) => {
              console.log(`Number of pages: ${numberOfPages}`);
            }}
            onPageChanged={(page, numberOfPages) => {
              console.log(`Current page: ${page}`);
            }}
            onError={(error) => {
              console.log("PDF Load Error:", error);
            }}
            style={{
              flex: 1,
              width: width - 20,
              height: height - 100,
              alignSelf: 'center'
            }}
          />
        ) : (
          <Text className="text-center mt-10 text-red-500">Invalid or corrupted PDF file.</Text>
        )}
      </SafeAreaView>
    </Modal>
  );

  return (
    <SafeAreaView className="flex-1 items-center justify-center bg-pink-50">
      <FlatList
        data={documents}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ width: '90%', paddingHorizontal: 20 }}
        refreshing={refreshing}
        ListHeaderComponent={() => (
          <View className="w-full mb-5 bg-white rounded-2xl items-center flex-row space-x-2 p-4">
            <View className="h-16 w-16 rounded-full items-center justify-center">
              <Image
                source={{ uri: patientProfile?.avatar }}
                className="w-full h-full rounded-full"
                resizeMode="cover"
              />
            </View>
            <View className="items-start justify-center">
              <Text className="text-lg font-pbold">{patientProfile?.full_name}</Text>
              <Text className="text-base text-gray-600 font-pregular">{patientProfile?.email}</Text>
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <View className="flex-1 items-center justify-center">
            <Image
              source={require("../../../../../assets/images/noDocument.jpg")}
              className="rounded-2xl h-40 w-40"
              resizeMode="contain"
            />
            <Text className="font-pbold text-2xl mt-4">No Documents Uploaded</Text>
            <CustomButton
              name="Upload"
              textstyle="text-lg text-white font-pbold"
              handlePress={() => router.navigate("upload")}
            />
          </View>
        )}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#FF8E01"]}
          />
        }
      />
      <PdfModal />
    </SafeAreaView>
  );
};

export default ViewDocuments;
