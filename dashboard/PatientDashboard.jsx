import React, { useEffect, useState, useCallback } from "react";
import { View, Text,Image, TouchableOpacity, FlatList, ActivityIndicator, SafeAreaView } from "react-native";
import { fetchDocuments } from '../lib/GlobalProvider';
import { useGlobalContext } from "../lib/GlobalProvider";
import { supabase } from "../lib/supabase";
import { RefreshControl } from "react-native";
import CustomButton from "../components/CustomButton";
import { router } from "expo-router";

const PatientDashboard = () => {
  const { userDetails, loading, isLoggedIn } = useGlobalContext();
  const [documents, setDocuments] = useState([]);
  const [refresing , setRefreshing] = useState(false);

  const onRefresh = async () => { 
    setRefreshing(true);
    await fetchUserDocuments();
    setRefreshing(false);
  }


  const fetchUserDocuments = async () => {
    try {
      const { data, error } = await supabase
      .from("documents")
      .select()
      .eq("user_id", userDetails.id);

    if (error) {
      console.error("Error fetching user documents:", error);
    } else {
      setDocuments(data);
    }
    } catch (error) {
      console.error("Error fetching documents:", error);
      // Consider adding error state and displaying to user
    }
  };

  useEffect(() => {
    if (isLoggedIn && userDetails.id) {
      fetchUserDocuments();
    }
  }, []);

  const handleDocumentPress = useCallback((fileUrl) => {
    // Implement document viewing logic
    console.log("Viewing document:", fileUrl);
  }, []);

  const renderItem = useCallback(({ item }) => (
    <View className="p-4 bg-white rounded-lg shadow mb-3">
      <Text className="text-xl font-semibold">{item.file_name}</Text>
      <Text className="text-sm text-gray-500">{item.uploaded_at}</Text>
      <TouchableOpacity onPress={() => handleDocumentPress(item.file_url)}>
        <Text className="text-blue-500 mt-2">View Document</Text>
      </TouchableOpacity>
    </View>
  ), [handleDocumentPress]);

  if (loading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center">
        <ActivityIndicator color="#0D6EFD" size="large" />
      </SafeAreaView>
    );
  }

  if (!isLoggedIn) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center">
        <Text className="text-red-500">You are not logged in.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-pink-50">
      <View className="p-4">
        <Text className="text-2xl font-bold text-dark-background">Welcome Patient</Text>
      </View>
        <FlatList
          data={documents}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ padding: 16 }}
          refreshing={refresing}
          ListHeaderComponent={() => (
            <View className="p-4 bg-white rounded-lg shadow mb-3 items-center">
              <Text className="text-xl font-semibold">Your Reports</Text>
            </View>
          )}
          ListEmptyComponent={() => (
            <View className="flex-1 h-[600] w-full items-center justify-center self-center">
              <View className=" w-full h-[40%] rounded-2xl items-center justify-center p-3">
                <Image source={require("../assets/images/noDocument.jpg")} className=" rounded-2xl object-contain h-full w-full"/>
              </View>
              <Text className="font-pbold text-dark-black-100 text-2xl">
                No Documents Uploaded
              </Text>
              {/* <Text className="font-pmedium text-dark-black-300 text-base">
                Upload your first document to get started.
              </Text> */}
              <CustomButton
                name={"Upload"}
                textstyle={"text-lg text-white font-pbold"}
                handlePress={() => router.navigate('upload')}
              />
            </View>
          )}
          refreshControl={
            <RefreshControl
              refreshing={refresing}
              onRefresh={onRefresh}
              progressBackgroundColor={"#FF8E01"}
              tintColor={"#FF8E01"}
            />
          }
        />
    </SafeAreaView>
  );
};

export default PatientDashboard;