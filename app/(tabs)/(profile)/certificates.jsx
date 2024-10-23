import { View, Text, SafeAreaView, Image } from "react-native";
import React from "react";
import { useGlobalContext } from "../../../lib/GlobalProvider";

const certificates = () => {
  const { userDetails } = useGlobalContext();

  console.log(userDetails?.certificate_url);
  console.log(userDetails.id_url);
  console.log(userDetails.avatar)

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-dark-background items-center justify-start p-4 space-y-4">
      <Text className="text-center text-3xl font-psemibold text-light-text mt-3">
        Your Certificates
      </Text>
      <View className=" space-y-3 bg-light-elevated-bg rounded-3xl w-[90%] p-2 items-center">
        <Text className=" self-start my-4 text-lg font-pmedium text-light-elevated-label">
          Certificate:
        </Text>
        <View className="w-[90%] h-24 rounded-2xl items-center justify-center bg-slate-600">
          <Image
            source={{ uri: userDetails?.certificate_url }}
            resizeMode="cover"
            className="h-full w-full rounded-2xl"
          />
        </View>
      </View>
      <View className="space-y-3 bg-light-elevated-bg rounded-3xl w-[90%] p-2 items-center">
        <Text className=" self-start my-4 text-lg font-pmedium text-light-elevated-label">
          ID:
        </Text>
        <View className="w-[90%] h-24 rounded-2xl items-center justify-center bg-slate-600">
          <Image
            source={{ uri: userDetails?.id_url }}
            resizeMode="cover"
            className="h-full w-full rounded-2xl"
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default certificates;
