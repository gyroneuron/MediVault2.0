import { View, Text,Image, TouchableOpacity } from "react-native";
import React from "react";

const MenuButton = ({ name, Icon, handlePress}) => {
  return (
    <TouchableOpacity
      onPress={handlePress}
      className="w-full h-[40] rounded-2xl items-center flex-row justify-start space-x-2 my-2 border-b border-gray-600"
    >
      {Icon}
      <Text className="font-Rmedium text-base text-dark-text">{name}</Text>
    </TouchableOpacity>
  );
};

export default MenuButton;