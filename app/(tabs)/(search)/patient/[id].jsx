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
import { router, useLocalSearchParams } from "expo-router";
import { supabase } from "../../../../lib/supabase";
import { useGlobalContext } from "../../../../lib/GlobalProvider";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

const PatientProfile = () => {
  const {userDetails} = useGlobalContext();
  const { id } = useLocalSearchParams();
  const [patient, setPatient] = useState(null);
  const [button, setButton] = useState('Request for Document Access');
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // console.log('Your ID:', userDetails.id);
  // console.log('Patient id: ', id);

  const handleNavigateToUpload = () => {
    router.push({
      pathname: "patient/document/UploadByDoctor",
      params: {
        patient_id: id,
        patient_email: profile.email,
      }
    });
  };

  const handleNavigateToView = () => {
    router.push({
      pathname: "patient/document/ViewDocuments",
      params: {
        patient_id: id,
      }
    });
  };

  const checkAccess = async (patientId) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('access_requests')
        .select('*')
        .eq('doctor_id', userDetails.id)
        .eq('patient_id', patientId)
        .single();

      // If no record exists, error.code will be 'PGRST116'
      if (error) {
        if (error.code === 'PGRST116') {
          // No access request exists yet
          setButton('Request for Document Access');
        } else {
          // Handle other types of errors
          console.error('Error checking access:', error);
          Alert.alert('Error', 'Failed to check access status');
        }
      } else if (data) {
        // Handle existing access request based on status
        switch (data.status) {
          case 'pending':
            setButton('Request pending');
            break;
          case 'approved':
            setButton('View Documents');
            setPatient(data.patient_id);
            break;
          case 'rejected':
            setButton('Request for Document Access');
            break;
          default:
            setButton('Request for Document Access');
        }
      }
    } catch (error) {
      console.error('Uncaught error in checkAccess:', error);
      Alert.alert('Error', 'An unexpected error occurred');
      setButton('Request for Document Access'); // Fallback to default state
    } finally {
      setIsLoading(false);
    }
  };

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
          if (error.code === '23505') {
            Alert.alert("Request Already Exists", "Please wait for the patient to respond to your request.");
          } else {
            Alert.alert("Error", error.message);
          }
        } else {
          Alert.alert("Request Sent", "Your access request has been sent to the patient.");
        }
    } catch (error) {
      console.error('Request access error:', error);
    } finally {
      setIsLoading(false);
    }
  };


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
    checkAccess(id);
  }, [id]);

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
        {
          button === 'Request for Document Access' ? (
            <TouchableOpacity
          onPress={() => {
            requestAccess(id);
          }}
          className="bg-primary p-2 rounded-md"
        >
          <MaterialCommunityIcons name="file-document" size={24} color="white" />
          <Text className="text-lg text-white font-psemibold">{button}</Text>
        </TouchableOpacity>
          ) : 
          button === 'Request pending' ? (
            <View className="bg-yellow-500 p-2 rounded-md space-x-2 flex-row">
              <Ionicons name="time" size={24} color="white" />
              <Text className="text-lg text-white font-psemibold">{button}</Text>
            </View>
          ) : (
            (<View className="w-[90%] space-y-2">
              <TouchableOpacity
                className="bg-primary p-2 rounded-2xl items-center justify-center"
                onPress={() => {
                  handleNavigateToUpload();
                }}
              >
                <Text className="text-lg text-white font-psemibold">Upload Documents</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  handleNavigateToView();
                }}
                className="bg-primary p-2 rounded-2xl items-center justify-center"
              >
                <Text className="text-lg text-white font-psemibold">View Documents</Text>
              </TouchableOpacity>
            </View>)
          )
        }
      </View>
    </SafeAreaView>
  );
};

export default PatientProfile;