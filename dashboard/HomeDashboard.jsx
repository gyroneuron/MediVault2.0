import { View, Text, ActivityIndicator } from "react-native";
import React from "react";
import { useGlobalContext } from "../lib/GlobalProvider";
import { SafeAreaView } from "react-native-safe-area-context";
import PatientDashboard from '../dashboard/PatientDashboard';
import DoctorDashboard from '../dashboard/PatientDashboard';

const HomeDashboard = () => {
  const { userDetails,
    loading,
    isLoggedIn, } = useGlobalContext();

  if (loading) {
    return <ActivityIndicator color={"#0D6EFD"} size={"large"} />;
  }

  if (!isLoggedIn) {
    return (
      <Text className="self-center text-red-500">You are not logged in.</Text>
    );
  }

  if (userDetails?.role === "patient") {
    return <PatientDashboard/>
  } else if (userRole === "doctor") {
    return <DoctorDashboard />;
  } else {
    return <Text>Invalid user role.</Text>;
  }
};

export default HomeDashboard;
