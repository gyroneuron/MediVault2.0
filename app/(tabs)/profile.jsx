import { View, Text, Image, ScrollView, Alert } from "react-native";
import React from "react";
import { useGlobalContext } from "../../lib/GlobalProvider";
import { SafeAreaView } from "react-native-safe-area-context";
import ProfilePic from "../../assets/icons/profile-avatar.png";
import CustomButton from "../../components/CustomButton";
import { supabase } from "../../lib/supabase";

const profile = () => {
  const { userDetails, loading, userRole, isLoggedIn } = useGlobalContext();

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut()

      if(error){
        Alert.alert('Error during Signout', error)
      }
    } catch (error) {
      console.log(error)
    }
  }

  // console.log(userDetails.role);

  return (
    <SafeAreaView className="flex-1 h-full w-full bg-dark-background items-center justify-center">
      <ScrollView className="flex-1 h-full w-[90%] bg-dark-background">
        <View className="h-full w-full flex-1 p-2 items-center justify-center">
          <Image
            source={ProfilePic}
            resizeMode="contain"
            className="h-32 w-32 rounded-full"
          />
          <Text className="text-center text-3xl font-psemibold text-dark-elevated-lbl mt-3">
              {userDetails.full_name}
            </Text>
          <View className="h-full w-full flex-1 p-5 items-start justify-center mt-3 bg-dark-elevated-bg rounded-2xl">
            
            <Text className="text-center text-lg font-pmedium text-dark-elevated-lbl">
              Email: <Text className="text-center text-lg font-pmedium text-dark-elevated-secLbl">{userDetails.email}</Text>
            </Text>
            <Text className="text-center text-lg font-pmedium text-dark-elevated-lbl">
              Role: <Text className="text-center text-lg font-pmedium text-dark-elevated-secLbl">{userDetails.role}</Text>
            </Text>
            {userDetails.role === "doctor" ? (
              <View className="items-start justify-center my-2">
                <Text className=" text-xs font-pmedium text-dark-elevated-lbl my-3">
                  Certificate: <Text className="text-center text-xs font-pmedium text-dark-elevated-secLbl">{userDetails.certificate_url}</Text>
                </Text>
                <Text className=" text-xs font-pmedium text-dark-elevated-lbl">
                  ID: <Text className="text-center text-xs font-pmedium text-dark-elevated-secLbl">{userDetails.id_url}</Text>
                </Text>
              </View>
            ) : null}
          </View>
          <CustomButton name={'Logout'} handlePress={handleLogout} textstyle={'font-pbold text-white'}/>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default profile;
