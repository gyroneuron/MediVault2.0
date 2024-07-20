import {
  SafeAreaView,
  StatusBar,
  Text,
} from "react-native";
import React from "react";

const ForgotPassword = () => {

  return (
    <SafeAreaView className="w-full h-full bg-[#001524] items-center justify-center">
      <StatusBar barStyle={"light-content"} />
      <Text className="text-lg font-pmedium text-light-icon">
        Forgot Password Screen
      </Text>
    </SafeAreaView>
  );
};

export default ForgotPassword;
