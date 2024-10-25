import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
} from "react-native";
import React from "react";
import { useGlobalContext } from "../lib/GlobalProvider";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { UseGreetingMessage } from "../components/GreetingMessage";

const DoctorDashboard = () => {
  const { userDetails, loading, isLoggedIn } = useGlobalContext();
  const GreetingMessage = UseGreetingMessage();
  return (
    <SafeAreaView className="flex-1 bg-pink-50 dark:bg-dark-background">
      <StatusBar barStyle="dark-content" />
      <View className="p-4 flex-row space-x-3 bg-pink-50 rounded-3xl m-4 mb-2">
        <TouchableOpacity
          onPress={() => router.navigate("/(tabs)/(profile)")}
          className="h-20 w-20 rounded-full bg-white"
        >
          {userDetails?.avatar ? (
            <Image
              source={{ uri: userDetails?.avatar }}
              className="w-full h-full self-center rounded-full"
              resizeMode="contain"
            />
          ) : (
            <Image
              source={require("../assets/icons/profile-avatar.png")}
              className="w-full h-full self-center rounded-full"
              resizeMode="contain"
            />
          )}
        </TouchableOpacity>
        <View className="flex-1 items-start justify-between flex-row self-center">
          <View className="flex-1">
            <Text className="text-lg font-psemibold text-gray-500">
              {GreetingMessage}
            </Text>
            <Text className="text-base font-pmedium">
              {userDetails?.full_name}
            </Text>
          </View>
          <TouchableOpacity className="h-7 w-7 rounded-full bg-gray-700 border border-gray-500 items-center justify-center">
            <Ionicons name="notifications" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      <View className="flex-1 p-4 w-[90%] space-y-3 self-center">
        <View className="flex-row space-x-3">
          <TouchableOpacity
            onPress={() => router.navigate("/(tabs)/(search)")}
            className="flex-1 p-4 bg-white rounded-lg shadow items-center"
          >
            <Ionicons name="search" size={36} color="blue" />
            <Text className="text-lg font-semibold text-dark-button">
              Search Patients
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.navigate("/(tabs)/(upload)")}
            className="flex-1 p-4 bg-white rounded-lg shadow items-center"
          >
            <Ionicons name="document-attach" size={36} color="blue" />
            <Text className="text-lg font-semibold text-dark-button">
              Upload Reports
            </Text>
          </TouchableOpacity>
        </View>
        <View className="flex-row space-x-3">
          <TouchableOpacity
            onPress={() => router.replace("/(tabs)/(profile)")}
            className="flex-1 p-4 bg-white rounded-lg shadow items-center"
          >
            <Ionicons name="people" size={36} color="blue" />
            <Text className="text-lg font-semibold text-dark-button">
              Your Requests
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default DoctorDashboard;
