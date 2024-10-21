import { View, Text, SafeAreaView, FlatList, Image, TouchableOpacity} from "react-native";
import React, {useEffect, useState, useCallback} from "react";
import { fetchDocuments } from "../lib/GlobalProvider";
import { useGlobalContext } from "../lib/GlobalProvider";
import { supabase } from "../lib/supabase";
import { RefreshControl } from "react-native";
import CustomButton from "../components/CustomButton";

const FetchUserDocs = () => {
  const { userDetails, loading, isLoggedIn } = useGlobalContext();
  const [documents, setDocuments] = useState([]);
  const [refresing, setRefreshing] = useState(false);

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

  const renderItem = useCallback(
    ({ item }) => (
      <View className="p-4 bg-white rounded-lg shadow mb-3">
        <Text className="text-xl font-semibold">{item.file_name}</Text>
        <Text className="text-sm text-gray-500">{item.uploaded_at}</Text>
        <TouchableOpacity onPress={() => handleDocumentPress(item.file_url)}>
          <Text className="text-blue-500 mt-2">View Document</Text>
        </TouchableOpacity>
      </View>
    ),
    [handleDocumentPress]
  );

  const handleDocumentPress = useCallback((fileUrl) => {
    // Implement document viewing logic
    console.log("Viewing document:", fileUrl);
  }, []);


  return (
    <SafeAreaView className="flex-1 h-full w-full bg-pink-50 items-center justify-center">
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
              <Image
                source={require("../../assets/images/noDocument.jpg")}
                className=" rounded-2xl object-contain h-full w-full"
              />
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
              handlePress={() => router.navigate("upload")}
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

export default FetchUserDocs;
