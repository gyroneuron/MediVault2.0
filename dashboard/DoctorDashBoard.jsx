import { View, Text } from "react-native";
import React from "react";

const DoctorDashboard = () => {
  return (
    <View className="justify-start items-start flex-1 w-[90%] h-full bg-yellow-700">
      <Text className="text-2xl font-pbold text-white">Doctor Dashboard</Text>
      {/* <Text className="text-xl font-pbold text-white">
        {doctor.user_metadata.fullName}
      </Text> */}
    </View>
  );
};

export default DoctorDashboard;
