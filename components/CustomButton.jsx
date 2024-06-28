import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import React from "react";
import { ActivityIndicator } from "react-native";

const CustomButton = ({
  name,
  textstyle,
  isLoading,
  handlePress,
  image,
  submittingStatus,
}) => {
  return (
    <TouchableOpacity
      onPress={handlePress}
      className={`w-full min-h-[62px] rounded-2xl flex-row my-10 bg-[#0D6EFD] items-center justify-center ${
        submittingStatus ? "opacity-50" : "opacity-100"
      }`}
    >
      {image ? (
        <Image
          source={image}
          tintColor={"white"}
          className="h-12 w-12 mx-5"
          resizeMode="contain"
        />
      ) : null}
      {submittingStatus ? (
        <ActivityIndicator size="small" color="#fff" />
      ) : (
        <Text className={`text-center ${textstyle}`}>{name}</Text>
      )}
    </TouchableOpacity>
  );
};

export default CustomButton;

const styles = StyleSheet.create({});
