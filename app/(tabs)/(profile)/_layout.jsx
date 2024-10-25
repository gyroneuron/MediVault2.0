import { View, Text } from "react-native";
import React from "react";
import { Stack } from "expo-router";

const _layout = () => {
  return (
    <Stack
      initialRouteName="index"
      screenOptions={{
        headerShown: false,
        title: "Profile",
      }}
    >
      <Stack.Screen
        name="index"
      />
      <Stack.Screen 
        name="requests" 
        headerShown="true"
        options={{
          title: "Access Requests",
        }}
      />
      <Stack.Screen
        name="certificates"
        screenOptions={{
          headerShown: true,
          headerTitle: "Your Certificates",
          headerTitleStyle: {
            FontFace: "Poppins-Bold",
          },
        }}
      />
    </Stack>
  );
};

export default _layout;
