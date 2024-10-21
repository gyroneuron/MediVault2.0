import {
  View,
  Text,
  Image,
  ScrollView,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import React, { useState, useEffect } from "react";
import { useGlobalContext } from "../../../lib/GlobalProvider";
import { SafeAreaView } from "react-native-safe-area-context";
import ProfilePic from "../../../assets/icons/profile-avatar.png";
import CustomButton from "../../../components/CustomButton";
import { supabase } from "../../../lib/supabase";
import { router } from "expo-router";
import { MaterialIcons, Octicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { decode } from "base64-arraybuffer";

const index = () => {
  const { userDetails, loading, isLoggedIn, Logout, fetchProfile } =
    useGlobalContext();

  const [avatarUri, setAvatarUri] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleLogout = async () => {
    try {
      await Logout();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const openPicker = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled) {
        const selectedImage = result.assets[0];
        setAvatarUri(selectedImage.uri);
        setAvatar(selectedImage);

        const userFolder = userDetails.email;
        await uploadToStorage(selectedImage, "avatars", userFolder);
      } else {
        setTimeout(() => {
          Alert.alert("Image picked", JSON.stringify(result, null, 2));
        }, 100);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const uploadToStorage = async (file, bucketName, folderName) => {
    setUploading(true);
    try {
      const contentType = "image/png";
      const filePath = `${folderName}/${new Date().getTime()}.png`;
      const base64 = await FileSystem.readAsStringAsync(file.uri, {
        encoding: "base64",
      });

      const { data, error } = await supabase.storage
        .from(bucketName)
        .upload(filePath, decode(base64), {
          contentType,
        });

      if (error) {
        Alert.alert("Error Uploading to Storage", error.message);
        throw error;
      } else {
        const avatarPublicUrl = supabase.storage
          .from(bucketName)
          .getPublicUrl(filePath).data.publicUrl;

        setAvatarUri(avatarPublicUrl);

        const userId = userDetails.id;

        const { error: uploadToProfileTableError } = await supabase
          .from("profiles")
          .update({ avatar: avatarPublicUrl })
          .eq("id", userDetails.id);

        if (uploadToProfileTableError) {
          Alert.alert("Error Updating Profile", uploadToProfileTableError.message);
        }

        Alert.alert("Avatar Updated!");
        await fetchProfile(userDetails.id);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 h-full w-full bg-dark-background items-center justify-center space-y-3">
        <ActivityIndicator color={"yellow"} size={"small"} />
        <Text className="text-lg font-pmedium text-stone-700">
          Please Wait...
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-dark-background items-center justify-center">
      <ScrollView className="flex-1 w-[90%] bg-dark-background self-center">
        {/* {userDetails ? (
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
                Email:{" "}
                <Text className="text-center text-lg font-pmedium text-dark-elevated-secLbl">
                  {userDetails.email}
                </Text>
              </Text>
              <Text className="text-center text-lg font-pmedium text-dark-elevated-lbl">
                Role:{" "}
                <Text className="text-center text-lg font-pmedium text-dark-elevated-secLbl">
                  {userDetails.role}
                </Text>
              </Text>
              {userDetails.role === "doctor" ? (
                <View className="items-start justify-center my-2">
                  <Text className=" text-xs font-pmedium text-dark-elevated-lbl my-3">
                    Certificate:{" "}
                    <Text className="text-center text-xs font-pmedium text-dark-elevated-secLbl">
                      {userDetails.certificate_url}
                    </Text>
                  </Text>
                  <Text className=" text-xs font-pmedium text-dark-elevated-lbl">
                    ID:{" "}
                    <Text className="text-center text-xs font-pmedium text-dark-elevated-secLbl">
                      {userDetails.id_url}
                    </Text>
                  </Text>
                </View>
              ) : null} */}
        {/* </View>
            <CustomButton
              name={"Logout"}
              handlePress={handleLogout}
              textstyle={"font-pbold text-white"}
              submittingStatus={loading}
            />
          </View>
        ) : (
          <Text className="text-center text-lg font-pmedium text-dark-elevated-lbl">
            Login to view Profile
          </Text>
        )} */}
        {userDetails?.avatar ? (
          <View className="h-24 w-24 rounded-full border-2 p-2 border-dark-black-100 items-center justify-center self-center">
            <Image
              source={{ uri: userDetails?.avatar }}
              resizeMode="contain"
              className="h-full w-full rounded-full"
            />
            {uploading ? (
              <ActivityIndicator
                className="absolute right-13 bottom-2"
                size={30}
                color={"yellow"}
              />
            ) : (
              <TouchableOpacity
                className="absolute right-13 bottom-2"
                onPress={openPicker}
              >
                <MaterialIcons name="add-a-photo" size={26} color={"#ffffff"} />
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <View className="h-24 w-24 rounded-full border-2 p-2 border-dark-black-100 items-center justify-center self-center">
            <Image
              source={{
                uri: "https://img.freepik.com/free-photo/androgynous-avatar-non-binary-queer-person_23-2151100226.jpg?t=st=1720326349~exp=1720329949~hmac=ce9bdf5474aa1c797ca7f6f9cbfdd3980482279e9a7b6f1c442d74e36a00deb3&w=740",
              }}
              resizeMode="contain"
              className="h-full w-full rounded-full"
            />

            {uploading ? (
              <ActivityIndicator
                className="absolute right-13 bottom-2"
                size={30}
                color={"yellow"}
              />
            ) : (
              <TouchableOpacity
                className="absolute right-13 bottom-2"
                onPress={openPicker}
              >
                <MaterialIcons name="add-a-photo" size={26} color={"#ffffff"} />
              </TouchableOpacity>
            )}
          </View>
        )}
        <Text className="text-center text-3xl font-psemibold text-dark-elevated-lbl mt-3">
          {userDetails?.full_name}
        </Text>
        <View className="h-full w-full flex-1 p-5 items-start justify-center mt-3 bg-dark-elevated-bg rounded-2xl">
          <Text className="text-center text-lg font-pmedium text-dark-elevated-lbl">
            Email:{" "}
            <Text className="text-center text-lg font-pmedium text-dark-elevated-secLbl">
              {userDetails?.email}
            </Text>
          </Text>
          <Text className="text-center text-lg font-pmedium text-dark-elevated-lbl">
            Role:{" "}
            <Text className="text-center text-lg font-pmedium text-dark-elevated-secLbl">
              {userDetails?.role}
            </Text>
          </Text>
          {userDetails?.role === "doctor" ? (
            <View className="items-start justify-center my-2">
              <Text className=" text-xs font-pmedium text-dark-elevated-lbl my-3">
                Certificate:{" "}
                <Text className="text-center text-xs font-pmedium text-dark-elevated-secLbl">
                  {userDetails?.certificate_url}
                </Text>
              </Text>
              <Text className=" text-xs font-pmedium text-dark-elevated-lbl">
                ID:{" "}
                <Text className="text-center text-xs font-pmedium text-dark-elevated-secLbl">
                  {userDetails?.id_url}
                </Text>
              </Text>
            </View>
          ) : null}
        </View>
        <CustomButton
          name={"Logout"}
          handlePress={handleLogout}
          textstyle={"font-pbold text-white"}
          submittingStatus={loading}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default index;
