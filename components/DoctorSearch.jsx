import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  Keyboard,
  FlatList,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import { FontAwesome, FontAwesome6 } from "@expo/vector-icons";
import { supabase } from "../lib/supabase";
import { router } from "expo-router";

const DoctorSearch = () => {
  const [searchText, setSearchText] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [searchedProfiles, setSearchedProfiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleFetchProfiles = async () => {
    setIsLoading(true);
    if (!searchText) {
      return;
    }
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("full_name, email, id, role")
        .ilike("full_name", `%${searchText}%`);

      if (error) {
        throw error;
      }
      console.log("Fetched profiles:", data);
      setSearchedProfiles(data);
    } catch (error) {
      console.error("Error fetching profiles:", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfileView = (id, role) => {
    router.navigate(`/(tabs)/(search)/${role}/${id}`);
  };

  return (
    <View className="flex-1 p-4 items-center justify-center">
      <View
        className={`h-12 self-center rounded-full bg-[#EFF2F5] flex-row items-center justify-center`}
      >
        <TouchableOpacity
          className="flex-1 items-center justify-center mx-2"
          onPress={handleFetchProfiles}
        >
          <FontAwesome6 name="magnifying-glass" size={24} color="grey" />
        </TouchableOpacity>
        <TouchableOpacity
          accessibilityLabel="Search"
          className={`${isFocused ? "flex-[7]" : "flex-[8]"} `}
          onPress={() => {}}
        >
          <TextInput
            placeholder="Search anything..."
            className=" text-black text-base"
            value={searchText}
            onChangeText={(text) => {
              setSearchText(text);
            }}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            keyboardType="default"
          />
        </TouchableOpacity>
        {isFocused && (
          <TouchableOpacity
            className=" flex-1 items-center justify-center"
            onPress={() => {
              setSearchText("");
              setSearchedProfiles([]);
              setIsFocused(false);
              Keyboard.dismiss();
            }}
          >
            <FontAwesome name="times" size={24} color="grey" />
          </TouchableOpacity>
        )}
      </View>
      <View className="flex-1">
        <FlatList
          data={searchedProfiles}
          keyExtractor={(item) => item.id}
          className="flex-1"
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => handleProfileView(item?.id, item?.role)}
              className="flex-row items-center justify-between p-4 border-b border-gray-200 w-full"
            >
              <Text className="text-lg font-semibold text-center">{item?.full_name}</Text>
              <Text className="text-base text-gray-500">{item?.email}</Text>
            </TouchableOpacity>
          )}
          ListEmptyComponent={() =>
            isLoading ? (
              <View className="flex-1 justify-center items-center">
                <ActivityIndicator color="#0D6EFD" size="large" />
              </View>
            ) : (
              <View className="flex-1 items-center justify-center mt-5">
                <Text className="text-lg font-semibold text-gray-500">
                  No profiles found
                </Text>
              </View>
            )
          }
        />
      </View>
    </View>
  );
};

export default DoctorSearch;
