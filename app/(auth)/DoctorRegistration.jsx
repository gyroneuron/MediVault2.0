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
  Button,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import Logo from "../../assets/images/Auth/Registration.png";
import CustomButton from "../../components/CustomButton";
import { router } from "expo-router";
import * as DocumentPicker from "expo-document-picker";
import { Ionicons } from "@expo/vector-icons";
import { supabase } from "../../lib/supabase";

const DoctorRegistration = () => {
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
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);
  const [licenseNumber, setLicenseNumber] = useState("");
  const [isValidLicenseNumber, setIsValidLicenseNumber] = useState("");
  const [isLicenseTyping, setIsLicenseTyping] = useState(false);
  const [idDoc, setIdDoc] = useState(null);
  const [isIdPicked, setIsIdPicked] = useState(false);
  const [certificate, setCertificate] = useState(null);
  const [isCertificatePicked, setIsCertificatePicked] = useState(false);
  const [certificateDoc, setCertificateDoc] = useState(null);

  const handleDoctorRegister = async () => {
    if ((!fullName || !email || !password || confirmPassword!=password || !licenseNumber || !idDoc || !certificate)){
      Alert.alert('Enter all the field to register');
      return
    }
    
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
            .insert([{ id: data.user.id, full_name: fullName, email, role: "doctor", id_url: idDoc, license: licenseNumber, certificate_url: certificate }]);

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
  }



  //Picking Doctor Document
  const pickDoc = async (set, setStatus) => {
    try {
      const file = await DocumentPicker.getDocumentAsync({});
      set(file.assets[0].uri);
      setStatus(true);
    } catch (error) {
      throw new Error();
    }
  };

  //Validating Email

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

  //Validate License Number
  useEffect(() => {
    const validateLicense = (licenseNumber) => {
      return licenseNumber.length <= 10;
    };

    setIsValidLicenseNumber(validateLicense(licenseNumber));
  }, [licenseNumber]);

  return (
    <SafeAreaView className="w-full h-full bg-[#001524] items-center justify-center">
      <StatusBar barStyle={"light-content"} />
      <View className="justify-center items-center flex-1 w-[90%] h-full bg-[#001524]">
        <KeyboardAvoidingView
          className="w-full flex-1 h-full items-center justify-center"
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <View className="flex-[0.2] w-full items-center justify-center">
            {/* <Image
              source={Logo}
              resizeMode="contain"
              className=" h-40 w-full self-center my-10"
            /> */}
            <Text className=" font-pbold text-center text-[#ffffff] text-2xl">
              Doctor's Registration
            </Text>
          </View>

          <ScrollView className="flex-1">
            <View className="flex-1 w-full">
              <Text className="text-white text-base  font-pmedium my-3 self-start">
                Full Name
              </Text>
              <View className="rounded-2xl  border-2 border-slate-800 bg-slate-800 h-14 w-full items-center justify-center focus:border-[#0D6EFD]">
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
                <Text className="text-red-600 font-pregular m-2 self-start">
                  Please enter minimum 6 characters
                </Text>
              ) : null}
              <Text className="text-white text-base font-pmedium my-3 self-start">
                Email
              </Text>
              <View className="rounded-2xl  border-2 border-slate-800 bg-slate-800 h-14 w-full items-center justify-center focus:border-[#0D6EFD]">
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
                <Text className="text-red-600 font-pregular m-2 self-start">
                  Please enter Valid Email
                </Text>
              ) : null}
              <Text className="text-white font-pmedium self-start text-base my-3">
                Password
              </Text>
              <View className="rounded-2xl border-slate-800 flex-row bg-slate-800 h-14 w-full items-center justify-evenly focus:border-[#0D6EFD]">
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
                <Text className="text-red-600 font-pregular m-2 self-start">
                  Please enter Valid Password
                </Text>
              ) : null}
              <Text className="text-white font-pmedium self-start text-base my-3">
                Confirm Password
              </Text>
              <View className="rounded-2xl border-slate-800 flex-row bg-slate-800 h-14 w-full items-center justify-evenly focus:border-[#0D6EFD]">
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
                <Text className="text-red-600 font-pregular m-2 self-start">
                  Please match with Password
                </Text>
              ) : null}

              <Text className="text-white text-base my-3 font-medium self-start">
                License Number
              </Text>
              <View className="rounded-2xl border-slate-800 bg-slate-800 h-14 w-full items-start justify-center focus:border-[#0D6EFD]">
                <TextInput
                  className="w-[90%] h-full text-base px-4 text-[#E7DECD]"
                  value={licenseNumber}
                  placeholder="Enter license number"
                  placeholderTextColor={"grey"}
                  onChangeText={(text) => {
                    setLicenseNumber(text);
                    setIsLicenseTyping(true);
                  }}
                  keyboardType={"default"}
                />
              </View>
              {!isValidLicenseNumber && isLicenseTyping ? (
                <Text className="text-red-600 font-pregular m-2 self-start">
                  Max length 10
                </Text>
              ) : null}
              <View className="w-full flex-row items-center justify-center">
                {!isIdPicked ? (
                  <TouchableOpacity
                    className="flex-row h-14 items-center justify-start flex-1"
                    onPress={() => pickDoc(setIdDoc, setIsIdPicked)}
                  >
                    <Ionicons
                      name="add-circle-outline"
                      color={"#0D6EFD"}
                      size={24}
                    />
                    <Text className=" text-medium text-white text-base text-center mx-2">
                      Upload ID
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    className="flex-row h-14 items-center justify-start flex-1"
                    onPress={() => {
                      setIdDoc(null);
                      setIsIdPicked(false);
                    }}
                  >
                    <Ionicons name="cloud-done" color={"#ffffff"} size={24} />
                    <Text className=" text-medium text-green-500 text-base text-center mx-2">
                      Id Selected
                    </Text>
                  </TouchableOpacity>
                )}
                {!isCertificatePicked ? (
                  <TouchableOpacity
                    className="flex-row h-14 items-center justify-end flex-[1]"
                    onPress={() =>
                      pickDoc(setCertificate, setIsCertificatePicked)
                    }
                  >
                    <Ionicons
                      name="add-circle-outline"
                      color={"#0D6EFD"}
                      size={24}
                    />
                    <Text className=" text-medium text-white text-base mx-2">
                      Upload Certificate
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    className="flex-row h-14 items-center justify-end flex-1"
                    onPress={() => {
                      setCertificate(null);
                      setIsCertificatePicked(false);
                    }}
                  >
                    <Ionicons name="cloud-done" color={"#ffffff"} size={24} />
                    <Text className=" text-medium text-green-500 text-base text-center mx-2">
                      Certificate Selected
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
              <CustomButton
                name={"Register"}
                handlePress={handleDoctorRegister}
                textstyle={"font-pbold text-base text-white"}
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
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
};

export default DoctorRegistration;
