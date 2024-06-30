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
import { supabase } from "../../lib/supabase";

const PatientRegistration = () => {
  const [fullName, setFullName] = useState("");
  const [isValidName, setIsValidName] = useState(true);
  const [isNameTyping, setIsNameTyping] = useState(false);
  const [email, setEmail] = useState("");
  const [isValidEmail, setIsValidEmail] = useState(true);
  const [isemailtyping, setIsEmailTyping] = useState(false);
  const [password, setPassword] = useState("");
  const [isvalidPassword, setIsValidPassword] = useState(true);
  const [ispasswordtyping, setIsPasswordTyping] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isValidconfirmPassword, setIsValidConfirmPassword] = useState(true);
  const [isConfirmPassTyping, setIsConfirmPassTyping] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);

    const handleRegister = async () => {
      try {
        const { data, error: signupError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              fullName: fullName,
            }
          }
        })

        if (signupError) {
          console.log(signupError);
        } else {
            const {error: userUploadError} = await supabase
              .from('profiles')
              .insert([{ id: data.user.id, full_name: fullName, email, role: "patient" }]);

            if (userUploadError) {
              console.log(userUploadError)
            } else {
              Alert.alert('Success', 'Signed up Successfully!!');
              router.navigate('UserLogin')
            }
        }
          
      } catch (error) {
        console.log(error)
      }
    };
    

  useEffect(() => {
    const validateEmail = (email) => {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      return emailRegex.test(email);
    };

    setIsValidEmail(validateEmail(email));
  }, [email]);

  //Validating Full name

  useEffect(() => {
    const validateFullName = (fullName) => {
      const regex = /^[A-Za-z\s]+$/;

      const minLength = 8;
      const maxLength = 50;

      return (
        regex.test(fullName) &&
        fullName.length >= minLength &&
        fullName.length <= maxLength
      );
    };

    setIsValidName(validateFullName(fullName));
  }, [fullName]);

  //Validating Password
  useEffect(() => {
    const validatePassword = (password) => {
      return password.length >= 8;
    };

    setIsValidPassword(validatePassword(password));
  }, [password]);

  //Validating Confirm password
  useEffect(() => {
    const validateConfirmPass = (confirmPassword) => {
      return password === confirmPassword;
    };

    setIsValidConfirmPassword(validateConfirmPass(confirmPassword));
  }, [confirmPassword]);

  return (
    <SafeAreaView className="w-full h-full bg-[#001524] items-center justify-center">
      <StatusBar barStyle={"light-content"} />
      <View className="justify-center items-center flex-1 w-[90%] h-full bg-[#001524]">
        <KeyboardAvoidingView
          className="w-full flex-1 h-full items-center justify-center"
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <View className="flex-[0.25] w-full items-center justify-center">
            {/* <Image
              source={Logo}
              resizeMode="contain"
              className=" h-40 w-full self-center my-10"
            /> */}
            <Text className=" font-pbold text-center text-[#ffffff] text-2xl">
              Patient Registration
            </Text>
          </View>

          <View className="flex-1 w-full">
            <Text className="text-white text-base my-3 self-start">
              Full Name
            </Text>
            <View className="rounded-2xl  border-2 border-slate-800 bg-slate-800 h-16 w-full items-center justify-center focus:border-[#0D6EFD]">
              <TextInput
                className="w-full h-full text-base px-4 text-[#ffffff]"
                value={fullName}
                onChangeText={(text) => {
                  setFullName(text);
                  setIsNameTyping(true);
                }}
                placeholder="Enter full name"
                placeholderTextColor={"grey"}
                keyboardType="email-address"
                cursorColor={"#FF8E01"}
              />
            </View>
            {!isValidName && isNameTyping ? (
              <Text className="text-red-600 m-2 self-start">
                Please enter minimum 6 characters
              </Text>
            ) : null}
            <Text className="text-white text-base my-3 self-start">Email</Text>
            <View className="rounded-2xl  border-2 border-slate-800 bg-slate-800 h-16 w-full items-center justify-center focus:border-[#0D6EFD]">
              <TextInput
                className="w-full h-full text-base px-4 text-[#ffffff]"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  setIsEmailTyping(true);
                }}
                placeholder="Enter email address"
                placeholderTextColor={"grey"}
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
                placeholder="Enter password"
                placeholderTextColor={"grey"}
                keyboardType="default"
                cursorColor={"#FF8E01"}
                secureTextEntry={!isPasswordVisible}
              />
              {isPasswordVisible ? (
                <TouchableOpacity onPress={() => setIsPasswordVisible(false)}>
                  <Image
                    source={require("../../assets/icons/eye.png")}
                    className=" h-5 w-5"
                  />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity onPress={() => setIsPasswordVisible(true)}>
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
            <Text className="text-white self-start text-base my-3">
              Confirm Password
            </Text>
            <View className="rounded-2xl border-slate-800 flex-row bg-slate-800 h-16 w-full items-center justify-evenly focus:border-[#0D6EFD]">
              <TextInput
                className="w-[90%] h-full text-base px-4 text-[#E7DECD]"
                value={confirmPassword}
                onChangeText={(text) => {
                  setConfirmPassword(text);
                  setIsConfirmPassTyping(true);
                }}
                placeholder="Enter confirm password"
                placeholderTextColor={"grey"}
                keyboardType="default"
                cursorColor={"#FF8E01"}
                secureTextEntry={!isConfirmPasswordVisible}
              />
              {isConfirmPasswordVisible ? (
                <TouchableOpacity
                  onPress={() => setIsConfirmPasswordVisible(false)}
                >
                  <Image
                    source={require("../../assets/icons/eye.png")}
                    className=" h-5 w-5"
                  />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={() => setIsConfirmPasswordVisible(true)}
                >
                  <Image
                    source={require("../../assets/icons/eye-hide.png")}
                    className=" h-5 w-5"
                  />
                </TouchableOpacity>
              )}
            </View>
            {!isValidconfirmPassword && isConfirmPassTyping ? (
              <Text className="text-red-600 m-2 self-start">
                Please match with Password
              </Text>
            ) : null}
            <CustomButton
              name={"Register"}
              handlePress={handleRegister}
              textstyle={"font-pbold text-base text-white"}
              submittingStatus={isSubmitting}
            />
            <View className="items-center justify-center flex-row">
              <Text className="font-pmedium text-light-text">
                Already have an account?
              </Text>
              <TouchableOpacity onPress={() => router.navigate("UserLogin")}>
                <Text className="text-secondary-200 font-pmedium text-dark-text">
                  {" "}
                  Login
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
};

export default PatientRegistration;

// if (error) {
//   console.log('Error signing up:', error.message);
// } else {
//   const { error: insertError } = await supabase
//     .from('profiles')
//     .insert([{
//       id: user.id,
//       full_name: fullName,
//       email: email,
//       role: 'patient'
//       }]);

//   if (insertError) {
//     console.error('Error inserting into profiles table:', insertError.message);
//   } else {
//     console.log('Patient registered successfully!');
//   }
// }
// } catch (error) {
// console.log(error)
// }
