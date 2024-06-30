import {
    SafeAreaView,
    Image,
    StatusBar,
    Text,
    View,
    TextInput,
    KeyboardAvoidingView,
    Platform,
    TouchableOpacity,
    Alert,
  } from "react-native";
  import React, { useEffect, useState } from "react";
  import Logo from "../../assets/images/Auth/Registration.png";
  import CustomButton from "../../components/CustomButton";
  import { router } from "expo-router";
  import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
  import { supabase } from "../../lib/supabase";
  
  const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [isValidEmail, setIsValidEmail] = useState(true);
    const [isemailtyping, setIsEmailTyping] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setLoading] = useState(false);
  
    const handleLogin = async () => {
      
    };
  
    useEffect(() => {
      const validateEmail = (email) => {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(email);
      };
  
      setIsValidEmail(validateEmail(email));
    }, [email]);
  
    return (
      <SafeAreaView className="w-full h-full bg-[#001524] items-center justify-center">
        <StatusBar barStyle={"light-content"} />
        <View className="justify-center items-center flex-1 w-[90%] h-full bg-[#001524]">
          <KeyboardAvoidingView
            className="w-full flex-1 h-full items-center justify-center"
            behavior={Platform.OS === "ios" ? "padding" : undefined}
          >
            <View className="flex-1 w-full items-center justify-center">
              <Image
                source={Logo}
                resizeMode="contain"
                className=" h-60 w-full self-center my-10"
              />
              <Text className=" font-pbold text-center text-[#ffffff] text-2xl">
                Login
              </Text>
            </View>
  
            <View className="flex-1 w-full">
              <Text className="text-white text-base my-3 self-start">Email</Text>
              <View className="rounded-2xl  border-2 border-slate-800 bg-slate-800 h-16 w-full items-center justify-center focus:border-[#0D6EFD]">
                <TextInput
                  className="w-full h-full text-base px-4 text-[#ffffff]"
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    setIsEmailTyping(true);
                  }}
                  keyboardType="email-address"
                  cursorColor={"#FF8E01"}
                />
              </View>
              {!isValidEmail && isemailtyping ? (
                <Text className="text-red-600 m-2 self-start">
                  Please enter Valid Email
                </Text>
              ) : null}

              <CustomButton
                name={""}
                handlePress={handleLogin}
                textstyle={"font-pbold text-base text-white"}
              />
              <View className="items-center justify-center flex-row">
                <TouchableOpacity
                  onPress={() => router.navigate("AdminLogin")}
                  className="flex-row items-center justify-center"
                >
                  <MaterialCommunityIcons name="security" color={'white'} size={20}/>
                  <Text className="font-pmedium text-gray-100 mx-1">
                    Admin Login
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </View>
      </SafeAreaView>
    );
  };
  
  export default ForgotPassword;
  