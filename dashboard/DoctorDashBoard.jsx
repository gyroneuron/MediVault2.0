import { View, Text, SafeAreaView } from "react-native";
import React from "react";

const DoctorDashboard = () => {
  return (
    <SafeAreaView className="flex-1 h-full w-full bg-dark-background items-center justify-center">
      <View className="h-full w-full flex-1 bg-yellow-700">
      <Text className="text-2xl font-pbold text-white">Welcome Doctor</Text>
    </View>
  </SafeAreaView>
  );
};

export default DoctorDashboard;
