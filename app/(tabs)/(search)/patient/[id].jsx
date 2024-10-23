import {
  View,
  Text,
  SafeAreaView,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  Image,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { supabase } from "../../../../lib/supabase";
import { useGlobalContext } from "../../../../lib/GlobalProvider";

const PatientProfile = () => {
  const {userDetails} = useGlobalContext();
  const { id } = useLocalSearchParams();
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  console.log('Your ID:', userDetails.id);
  console.log('Patient id: ', id);

  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", id)
          .single();

        if (error) throw error;
        setProfile(data);
      } catch (error) {
        console.error("Error fetching profile:", error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [id]);

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-white dark:bg-dark-background justify-center items-center">
        <ActivityIndicator size="large" color="#0D6EFD" />
      </SafeAreaView>
    );
  }

  const requestAccess = async (patientId) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('access_requests')
        .insert([
          {
            doctor_id: userDetails.id,
            patient_id: id,
            status: 'pending',
          },
        ]);
  
      if (error) {
        console.error('Error creating access request:', error);
      } else {
        Alert.alert('Request sent', 'Access request has been sent to the patient.');
      }
    } catch (error) {
      console.error('Request access error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const checkAccess = async (patientId) => {
    
  }

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-white dark:bg-dark-background justify-center items-center">
        <ActivityIndicator size="large" color="#0D6EFD" />
      </SafeAreaView>
    );
  }

  if (!profile) {
    return (
      <SafeAreaView className="flex-1 bg-white dark:bg-dark-background justify-center items-center">
        <Text className="text-lg font-semibold text-gray-500">
          Profile not found
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-dark-background p-4 items-center justify-center">
      <View className="space-y-4 items-center justify-center w-full">
        <View className="h-24 w-24 rounded-full items-center justify-center">
          <Image
            source={{ uri: profile.avatar }}
            className="w-full h-full rounded-full"
            resizeMode="cover"
          />
        </View>
        <Text className="text-2xl font-pbold">{profile.full_name}</Text>
        <Text className="text-lg text-gray-600 font-pregular">{profile.email}</Text>
        <Text className="text-lg text-primary font-pregular">{profile.role}</Text>
        {/* Add more profile information as needed */}
        <TouchableOpacity
          onPress={() => requestAccess(id)}
          className="bg-primary p-2 rounded-md"
        >
          <Text className="text-lg text-white font-psemibold">Request for Document Access</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default PatientProfile;