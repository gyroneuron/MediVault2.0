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
import InputField from "../../components/InputField";

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
          },
        },
      });

      if (signupError) {
        console.log(signupError);
      } else {
        const { error: userUploadError } = await supabase
          .from("profiles")
          .insert([
            { id: data.user.id, full_name: fullName, email, role: "patient" },
          ]);

        if (userUploadError) {
          console.log(userUploadError);
        } else {
          Alert.alert("Success", "Signed up Successfully!!");
          router.navigate("UserLogin");
        }
      }
    } catch (error) {
      console.log(error);
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
    <SafeAreaView className="w-full h-full bg-dark-background items-center justify-center">
      <StatusBar barStyle={"light-content"} />
      <View className="justify-center items-center flex-1 w-[90%] h-full bg-dark-background">
        <KeyboardAvoidingView
          className="w-full flex-1 h-full items-center justify-center"
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          {/*Header Section*/}
          <View className="flex-[0.25] w-full items-center justify-center">
            <Text className=" font-pbold text-[#ffffff] text-2xl">
              Patient Registration
            </Text>
          </View>
          

          {/*Input Field Section*/}
          <View className="flex-1 w-full">
            <Text className={`text-white text-xs mt-4 mb-2 self-start`}>
            {" "}
              Full Name
            </Text>
            <View className="rounded-2xl border-2 h-14 flex-row w-full items-center justify-center border-dark-elevated-bg focus:bg-dark-elevated-bg">
              <TextInput
                className="w-full h-full text-base px-4 text-dark-icon focus:text-white"
                value={fullName}
                onChangeText={(text) => {
                  setFullName(text);
                  setIsNameTyping(true);
                }}
                // placeholder={"Enter full name"}
                placeholderTextColor={"gray"}
                keyboardType={"default"}
                cursorColor={"#FF8E01"}
              />
            </View>
            {!isValidName && isNameTyping ? (
              <Text className="text-red-600 m-2 self-start text-xs">
                Please enter minimum 6 characters
              </Text>
            ) : null}
            <Text className={`text-white text-sm mt-4 mb-2 self-start`}>{" "} Email</Text>
            <View className="rounded-2xl border-2 h-14 flex-row w-full items-center justify-center border-dark-elevated-bg focus:bg-dark-elevated-bg">
              <TextInput
                className="w-full h-full text-base px-4 text-dark-icon focus:text-white"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  setIsEmailTyping(true);
                }}
                // placeholder={"Enter email"}
                placeholderTextColor={"gray"}
                keyboardType={"default"}
                cursorColor={"#FF8E01"}
              />
            </View>

            {!isValidEmail && isemailtyping ? (
              <Text className="text-red-600 m-2 self-start text-xs">
                invalid email: must include @domain.com/.in
              </Text>
            ) : null}
            <Text className={`text-white text-sm mt-4 mb-2 self-start`}>
            {" "}
              Password
            </Text>
            <View className="rounded-2xl border-2 h-14 flex-row w-full items-center justify-center border-dark-elevated-bg focus:bg-dark-elevated-bg">
              <TextInput
                className="w-[90%] h-full text-base px-4 text-dark-icon focus:text-white"
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  setIsPasswordTyping(true);
                }}
                // placeholder="Enter password"
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
              <Text className="text-red-600 m-2 self-start text-xs">
                Please enter Valid Password
              </Text>
            ) : null}
            <Text className={`text-white text-sm mt-4 mb-2 self-start`}>
              {" "}
              Confirm Password
            </Text>
            <View className="rounded-2xl border-2 h-14 flex-row w-full items-center justify-center border-dark-elevated-bg focus:bg-dark-elevated-bg">
              <TextInput
                className="w-[90%] h-full text-base px-4 text-dark-icon focus:text-white"
                value={confirmPassword}
                onChangeText={(text) => {
                  setConfirmPassword(text);
                  setIsConfirmPassTyping(true);
                }}
                // placeholder="Enter confirm password"
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
              <Text className="text-red-600 m-2 self-start text-xs">
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


// const InputField = ({
//   label,
//   value,
//   onChangeText,
//   isValid,
//   isTyping,
//   errorMessage,
//   secureTextEntry,
//   toggleSecureTextEntry,
// }) => (
//   <View className="flex-col mb-6">
//     <Text className="font-pmedium text-dark-elevated-secLbl">{label}</Text>
//     <View className="rounded-2xl bg-light-elevated-bg dark:bg-dark-elevated-bg border-2 h-14 w-full items-center flex-row justify-center focus:border-[#0D6EFD]">
//       <TextInput
//         className="w-[90%] h-full text-base px-1 text-dark-icon"
//         value={value}
//         onChangeText={onChangeText}
//         secureTextEntry={secureTextEntry}
//       />
//       {toggleSecureTextEntry && (
//         <TouchableOpacity onPress={toggleSecureTextEntry}>
//           <Ionicons name={secureTextEntry ? "eye-off" : "eye"} size={20} />
//         </TouchableOpacity>
//       )}
//     </View>
//     {!isValid && isTyping && (
//       <Text className="text-red-600 text-xs font-pregular m-2 self-start">
//         {errorMessage}
//       </Text>
//     )}
//   </View>
// );

// const DocumentPick = ({ label, isPicked, onPick, onRemove }) => (
//   <View className="w-[48%] items-center justify-center">
//     {!isPicked ? (
//       <TouchableOpacity
//         className="w-full items-center justify-center rounded-3xl h-14 my-2"
//         onPress={onPick}
//       >
//         <Ionicons name="add-circle-outline" color={"#0D6EFD"} size={24} />
//         <Text className=" text-medium text-black dark:text-white text-sm text-center mx-2">
//           Upload {label}
//         </Text>
//       </TouchableOpacity>
//     ) : (
//       <View className="flex-row">
//         <TouchableOpacity
//           onPress={onRemove}
//           className="w-full items-center justify-center border-green-600 border-2 rounded-3xl h-14 my-2"
//         >
//           <Ionicons name="cloud-done" color={"#ffffff"} size={24} />
//           <Text className=" text-medium text-black dark:text-white text-sm mx-2">
//             {label} Selected
//           </Text>
//         </TouchableOpacity>
//       </View>
//     )}
//   </View>
// );