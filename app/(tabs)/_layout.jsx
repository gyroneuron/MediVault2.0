import { View, Text, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { Tabs } from "expo-router";
import { supabase } from "../../lib/supabase";

const _layout = () => {


  const TabIcon = ({ color, focused, name, icon }) => {
    return (
      <View className="items-center justify-center">
        <Image
          source={icon}
          resizeMode="contain"
          tintColor={color}
          className="h-6 w-6"
        />
        <Text
          className={`${
            focused
              ? "font-psemibold text-primary"
              : "font-pregular text-gray-400"
          }`}
        >
          {name}
        </Text>
      </View>
    );
  };

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: "#FF9C01",
        tabBarInactiveTintColor: "#CDCE0",
        tabBarStyle: {
          backgroundColor: "#161622",
          height: "10%",
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          headerShown: false,
          tabBarIcon: ({ focused, color }) => (
            <TabIcon
              icon={require("../../assets/icons/home.png")}
              name={"Home"}
              color={color}
              focused={focused}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="search"
        options={{
          headerShown: false,
          tabBarIcon: ({ focused, color }) => (
            <TabIcon
              icon={require("../../assets/icons/search.png")}
              name={"Create"}
              color={color}
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="upload"
        options={{
          headerShown: false,
          tabBarIcon: ({ focused, color }) => (
            <TabIcon
              icon={require("../../assets/icons/upload.png")}
              name={"Saved"}
              color={color}
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          headerShown: false,
          tabBarIcon: ({ focused, color }) => (
            <TabIcon
              icon={require("../../assets/icons/profile.png")}
              name={"Profile"}
              color={color}
              focused={focused}
            />
          ),
        }}
      />
    </Tabs>
  );
};

export default _layout;
