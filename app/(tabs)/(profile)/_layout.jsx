import { View, Text } from "react-native";
import React from "react";
import { Stack } from "expo-router";

const _layout = () => {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="index"
        screenOptions={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="certificates"
        screenOptions={{
          headerShown: true,
          headerTitle: "Your Certificates",
          headerTitleStyle: {
            FontFace: "Poppins-Bold"
          },
        }}
      />
    </Stack>
  );
};

export default _layout;
