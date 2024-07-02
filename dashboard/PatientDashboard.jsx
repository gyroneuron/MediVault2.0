import { View, Text, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import CustomButton from "../components/CustomButton";
import { router } from "expo-router";
import { supabase } from "../lib/supabase";
import { useGlobalContext } from "../lib/GlobalProvider";

const PatientDashboard = () => {
  // const { 
  //   user,
  //   loading,
  //   isLoggedIn, } = useGlobalContext();

  //   const [isloading, setIsLoading] = useState(false)

  // const handleLogout = async () => {
  //   setIsLoading(true)
  //   const { error } = await supabase.auth.signOut()

  //   if(error) {
  //     Alert.alert("Error signing out", error)
  //   } else {
  //     setIsLoading(false);
  //     router.navigate('/');
  //   }
  // }

  return (
    <View className="h-full w-full flex-1 bg-white">
      <Text className="text-2xl font-pbold text-white">Welcome to Medivault</Text>
      <Text className="text-2xl font-pbold text-white">{<Text className="text-xl font-pbold text-white">
        {/* {user.user_metadata.fullName} */}
      </Text>}</Text>
      <CustomButton name={'Logout'} textstyle={'text-white font-pmedium text-center'} handlePress={() => {}} isLoading={loading}/>
    </View>
  );
};

export default PatientDashboard;
