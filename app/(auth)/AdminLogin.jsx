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
import Logo from "../../assets/images/Auth/admin-logo.png";
import CustomButton from "../../components/CustomButton";
import { router } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { supabase } from "../../lib/supabase";
import secure from '../../secure.json'

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [isValidEmail, setIsValidEmail] = useState(true);
  const [isemailtyping, setIsEmailTyping] = useState(false);
  const [password, setPassword] = useState("");
  const [isvalidPassword, setIsValidPassword] = useState(true);
  const [ispasswordtyping, setIsPasswordTyping] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const handleLogin = async () => {

    if (!email || !password) {
      Alert.alert("Error", "Please fill in all the fields");
      return;
    }
    
    try {
      setIsSubmitting(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        Alert.alert(error.message)
      } else if (data) {
        const userId = data.user.id;
        if(userId !== secure.ADMIN_ID){
          Alert.alert('Access to this page is restricted to authorized administrators only. Please use the standard login page.')
        } else {
          Alert.alert('Success','Admin Logged in Successfully!')
          router.push('AdminDashboard')
        }
      } else {
        // Handle unexpected null response (unlikely but good practice)
        Alert.alert('Unexpected null response from Supabase');
      }
    } catch (error) {
      console.log('Error:', error)
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const validateEmail = (email) => {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      return emailRegex.test(email);
    };

    setIsValidEmail(validateEmail(email));
  }, [email]);

  useEffect(() => {
    const validatePassword = (password) => {
      return password.length >= 8;
    };

    setIsValidPassword(validatePassword(password));
  }, [password]);

  return (
    <SafeAreaView className="w-full h-full bg-[#001524] items-center justify-center">
      <StatusBar barStyle={"light-content"} />
      <View className="justify-center items-center flex-1 w-[90%] h-full bg-[#001524]">
        <KeyboardAvoidingView
          className="w-full flex-1 h-full items-center justify-center"
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <View className="flex-1 w-full items-center justify-end">
            {/* <Image
              source={Logo}
              resizeMode="contain"
              className=" h-60 w-full self-center my-10"
            /> */}
            <MaterialCommunityIcons name="security" color={'#0D6EFD'} size={100}/>
            <Text className=" font-pbold text-center text-[#ffffff] text-2xl m-8">
              Admin Login
            </Text>
          </View>

          <View className="flex-1 w-full items-center justify-start p-5">
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
            <Text className="text-white self-start text-base my-3">
              Password
            </Text>
            <View className="rounded-2xl border-slate-800 flex-row bg-slate-800 h-16 w-full items-center justify-evenly focus:border-[#0D6EFD]">
              <TextInput
                className="w-[90%] h-full text-base px-4 text-[#E7DECD]"
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  setIsPasswordTyping(true);
                }}
                keyboardType="default"
                cursorColor={"#FF8E01"}
                secureTextEntry={!isVisible}
              />
              {isVisible ? (
                <TouchableOpacity onPress={() => setIsVisible(false)}>
                  <Image
                    source={require("../../assets/icons/eye.png")}
                    className=" h-5 w-5"
                  />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity onPress={() => setIsVisible(true)}>
                  <Image
                    source={require("../../assets/icons/eye-hide.png")}
                    className=" h-5 w-5"
                  />
                </TouchableOpacity>
              )}
            </View>
            {!isvalidPassword && ispasswordtyping ? (
              <Text className="text-red-600 m-2 self-start">
                Please enter Valid Password
              </Text>
            ) : null}
            <CustomButton
              name={"Log In"}
              handlePress={handleLogin}
              textstyle={"font-pbold text-base text-white"}
              submittingStatus={isSubmitting}
            />
          </View>
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
};

export default AdminLogin;
