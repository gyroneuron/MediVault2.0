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
  ScrollView,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { supabase } from "../../lib/supabase";
import * as ImagePicker from "expo-image-picker";
import CustomButton from "../../components/CustomButton";
import { router } from "expo-router";
import * as FileSystem from 'expo-file-system';
import { decode } from "base64-arraybuffer";

const DoctorRegistration = () => {
  const [fullName, setFullName] = useState("");
  const [isValidName, setIsValidName] = useState(true);
  const [isNameTyping, setIsNameTyping] = useState(false);
  const [email, setEmail] = useState("");
  const [isValidEmail, setIsValidEmail] = useState(true);
  const [isEmailTyping, setIsEmailTyping] = useState(false);
  const [password, setPassword] = useState("");
  const [isValidPassword, setIsValidPassword] = useState(true);
  const [isPasswordTyping, setIsPasswordTyping] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isValidConfirmPassword, setIsValidConfirmPassword] = useState(true);
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
  const [isSubmitting, setIsSubmitting] = useState(false);


  const handleDoctorRegister = async () => {
    if (
      !fullName ||
      !email ||
      !password ||
      confirmPassword !== password ||
      !licenseNumber ||
      !idDoc ||
      !certificate
    ) {
      Alert.alert("Enter all the fields to register");
      return;
    }

    try {
      setIsSubmitting(true);
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
        console.error("Signup Error:", signupError);
        Alert.alert("Signup Error", signupError.message);
      } else {
        const userId = data.user.id;

        const idUrlPath = `${userId}/id-${Date.now()}.png`;
        const certificateUrlPath = `${userId}/certificate-${Date.now()}.png`;

        const [idPublicUrl, certificatePublicUrl] = await Promise.all([
          uploadImage(idDoc, idUrlPath),
          uploadImage(certificate, certificateUrlPath),
        ]);

        if (!idPublicUrl || !certificatePublicUrl) {
          Alert.alert("Upload Error", "Failed to upload documents.");
          return;
        }

        const { error: userUploadError } = await supabase
          .from("profiles")
          .insert([
            {
              id: userId,
              full_name: fullName,
              email,
              role: "doctor",
              id_url: idPublicUrl,
              license: licenseNumber,
              certificate_url: certificatePublicUrl,
            },
          ]);

        if (userUploadError) {
          console.error("User Upload Error:", userUploadError);
          Alert.alert("User Upload Error", userUploadError.message);
        } else {
          Alert.alert("Success", "Signed up Successfully!!");
          router.navigate("UserLogin");
        }
      }
    } catch (error) {
      console.error("Registration Error:", error);
      Alert.alert("Registration Error", error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const pickImage = async (setImageUri, setStatus) => {
    try {
      setIsSubmitting(true);
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled) {
        Alert.alert("File Picked Successfully", result.assets[0].uri);
        console.log("Picked Image URI:", result.assets[0].uri);
        setImageUri(result.assets[0].uri);
        setStatus(true);
      } else {
        Alert.alert("You did not pick any image");
        setImageUri(null);
        setStatus(false);
      }
    } catch (error) {
      console.error("Image Pick Error:", error);
      Alert.alert("Error", "Failed to pick image.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const uploadImage = async (uri, path) => {
    try {
      setIsSubmitting(true);

      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: 'base64'
      })

      const { data, error } = await supabase.storage
        .from("doctor-verification-docs")
        .upload(path, decode(base64), {
          contentType: 'image/png'
        });

      if (error) {
        console.error("Upload Error:", error);
        Alert.alert("Upload Error", error.message);
        return null;
      } else {
        console.log("Image Uploaded to Supabase!");
        const { data: publicData } = supabase.storage
          .from("doctor-verification-docs")
          .getPublicUrl(path);

        if (publicData) {
          console.log("Public URL Fetched Successfully:", publicData.publicUrl);
          return publicData.publicUrl;
        } else {
          console.error("Error fetching public URL");
          Alert.alert("Error", "Failed to fetch public URL.");
          return null;
        }
      }
    } catch (error) {
      console.error("Upload Image Error:", error);
      Alert.alert("Upload Image Error", error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Validating Email
  useEffect(() => {
    const validateEmail = (email) =>
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
    setIsValidEmail(validateEmail(email));
  }, [email]);

  useEffect(() => {
    const validateFullName = (name) => /^[A-Za-z\s]{8,50}$/.test(name);
    setIsValidName(validateFullName(fullName));
  }, [fullName]);

  useEffect(() => {
    setIsValidPassword(password.length >= 8);
  }, [password]);

  useEffect(() => {
    setIsValidConfirmPassword(password === confirmPassword);
  }, [confirmPassword, password]);

  useEffect(() => {
    setIsValidLicenseNumber(licenseNumber.length <= 10);
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
              {!isValidEmail && isEmailTyping ? (
                <Text className="text-red-600 font-pregular m-2 self-start">
                  Please enter Valid Email
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
              {!isValidPassword && isPasswordTyping ? (
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
              {!isValidConfirmPassword && isConfirmPassTyping ? (
                <Text className="text-red-600 font-pregular m-2 self-start">
                  Please match with Password
                </Text>
              ) : null}

              <Text className="text-white text-base font-pmedium my-3 self-start">
                Upload your License ID
              </Text>
              <View className="rounded-2xl border-2 border-slate-800 bg-slate-800 h-14 w-full flex-row items-center justify-between focus:border-[#0D6EFD]">
                <TouchableOpacity
                  className="w-full h-full items-center justify-center"
                  onPress={() => pickImage(setIdDoc, setIsIdPicked)}
                >
                  {isSubmitting ? (
                    <ActivityIndicator color={"yellow"} size={"small"} />
                  ) : (
                    <Text className="text-[#ffffff] text-base">
                      {idDoc ? "ID Picked Successfully" : "Pick your ID"}
                    </Text>
                  )}
                </TouchableOpacity>
              </View>

              <Text className="text-white text-base font-pmedium my-3 self-start">
                Upload your License Certificate
              </Text>
              <View className="rounded-2xl border-2 border-slate-800 bg-slate-800 h-14 w-full flex-row items-center justify-between focus:border-[#0D6EFD]">
                <TouchableOpacity
                  className="w-full h-full items-center justify-center"
                  onPress={() =>
                    pickImage(setCertificate, setIsCertificatePicked)
                  }
                >
                  {isSubmitting ? (
                    <ActivityIndicator color={"yellow"} size={"small"} />
                  ) : (
                    <Text className="text-[#ffffff] text-base">
                      {certificate
                        ? "Certificate Picked Successfully"
                        : "Pick your Certificate"}
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
              <CustomButton
                name={"Register"}
                handlePress={handleDoctorRegister}
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
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
};

export default DoctorRegistration;
