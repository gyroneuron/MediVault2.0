import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useGlobalContext } from "../lib/GlobalProvider";
import { UseGreetingMessage } from "../components/GreetingMessage";

const PatientDashboard = () => {
  const { userDetails, loading, isLoggedIn } = useGlobalContext();
  const greetingMessage = UseGreetingMessage();

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

  const handleNotification = () => {
    router.navigate("/(tabs)/(home)/notifications");
  }

  return (
    <SafeAreaView className="flex-1 bg-pink-50 dark:bg-dark-background">
      <StatusBar barStyle="dark-content" />
      <View className="p-4 flex-row space-x-3 bg-pink-50 rounded-3xl m-4 mb-2">
        <TouchableOpacity
          onPress={() => router.navigate("/(tabs)/(profile)")}
          className="h-16 w-16 rounded-full bg-white"
        >
          <Image
            source={{ uri: userDetails?.avatar}}
            className="w-full h-full self-center rounded-full"
            resizeMode="contain"
          />
        </TouchableOpacity>
        <View className="flex-1 items-start justify-between flex-row self-center">
          <View className="flex-1">
            <Text className="text-lg font-psemibold text-gray-500">
              {greetingMessage}
            </Text>
            {/* <Text className="text-base font-pmedium">
              {userDetails?.full_name}
            </Text> */}
          </View>
          <TouchableOpacity onPress={handleNotification} className="h-7 w-7 rounded-full bg-gray-700 border border-gray-500 items-center justify-center">
            <Ionicons name="notifications" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default PatientDashboard;
