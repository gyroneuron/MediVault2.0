import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Button,
  StatusBar,
  FlatList,
  Alert,
  Image,
  RefreshControl,
} from "react-native";
import { supabase } from "../../lib/supabase";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomButton from "../../components/CustomButton";
import NoData from '../../assets/images/Auth/no-data.png'

const AdminDashboard = () => {
  const [doctors, setDoctors] = useState([]);
  const [ isSubmitting, setIsSubmitting ] = useState(true);
  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchUnverifiedDoctors();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchUnverifiedDoctors();
    setRefreshing(false);
  };

  const fetchUnverifiedDoctors = async () => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("role", "doctor")
      .eq("verified", false);

    if (error) {
      Alert.alert("Error fetching users:", error);
    } else {
      setDoctors(data);
    } 
  };

  const handleVerifyDoctor = async (doctorId, doctorName) => {
    try {
      setIsSubmitting(true);
      const { data, error: VerifyingError } = await supabase
        .from("profiles")
        .update({ verified: true })
        .eq("id", doctorId);

      if (VerifyingError) {
        Alert.alert("Error updating user:", VerifyingError.message);
      } else {
        console.log("Verification successful for user:", doctorName);
        fetchUnverifiedDoctors();
        Alert.alert(doctorName, ":verified successfully");
      }
    } catch (error) {
      console.log("Error during verification:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const DeleteDoctor = async (doctorID, doctorName) => {
    try {
      setIsSubmitting(true);
      const { data, error: DeletingError } = await supabase
        .from("profiles")
        .delete()
        .eq("id", doctorID);

      if (DeletingError) {
        Alert.alert("Error:", DeletingError.message);
      } else {

        const {data, error: authDeletionError} = await supabase.auth.admin.deleteUser(
          doctorID,
          shouldSoftDelete,
        )

        if (authDeletionError) {
          Alert.alert(authDeletionError.name, authDeletionError.message)
        } else {
          fetchUnverifiedDoctors();
          Alert.alert(doctorName, ":Rejected for all Permissions");
        }
        
      }
    } catch (error) {
      console.log("Error during Deletion:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderItem = ({ item }) => (
    <View className="border-2 w-full rounded-2xl border-primary h-full p-3 items-start justify-center">
      <View className="flex-1 w-full h-full">
        <Text className="text-white font-pmedium text-base items-center justify-center">
          Dr. {item.full_name}
        </Text>
        <Text className="text-white font-pmedium text-sm">
          Email: {item.email}
        </Text>
        <Text className="text-white font-pmedium text-sm">
          License: {item.license}
        </Text>
      </View>
      <View className="w-full items-center justify-evenly flex-row">
        <CustomButton
          name={"Verify"}
          textstyle={"text-white font-pmedium"}
          buttonStyles={"w-[30%] h-[10]"}
          handlePress={() => handleVerifyDoctor(item.id, item.full_name)}
        />
        <CustomButton
          name={"Reject"}
          textstyle={"text-white font-pmedium"}
          buttonStyles={"bg-red-800 w-[30%]"}
          handlePress={() => DeleteDoctor(item.id, item.full_name)}
        />
      </View>
    </View>
  );

  return (
    <SafeAreaView className="w-full h-full bg-[#001524] items-center justify-center p-3">
      <StatusBar barStyle={"light-content"} />
      <View className="flex-1 h-full w-[90%] items-center justify-center">
        <View className="h-full w-full flex-1 items-center justify-center">
          <FlatList
            className="h-full w-full flex-1"
            data={doctors}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            ListHeaderComponent={() => (
              <View className=" h-[64] w-full bg-white rounded-2xl items-center flex-1 justify-center">
                <Text className="font-pbold text-xl text-primary">
                  MediVault's Unverified Doctors
                </Text>
              </View>
            )}
            ListEmptyComponent={() => (
              <View className="flex-1 h-full w-full">
                <Image source={NoData} resizeMode="contain" className="w-full h-[300]"/>
              </View>
            )}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={() => onRefresh()}
                colors={['#0D6EFD', '#ffffff']}
                size={24}
                tintColor={"#0D6EFD"}
                title="fetching"
                titleColor={"grey"}
                enabled
              />
            }
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default AdminDashboard;
