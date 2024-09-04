import { View, Text, SafeAreaView} from "react-native";
import React from "react";

const search = () => {
  return (
    <SafeAreaView className="flex-1 h-full w-full bg-pink-50 items-center justify-center">
      <Text className="text-lg font-pmedium text-light-icon">
        Search Screen
      </Text>
    </SafeAreaView>
  );
};

export default search;
