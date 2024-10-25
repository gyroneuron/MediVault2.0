import { Text, SafeAreaView} from "react-native";
import React, {useEffect, useState, useCallback} from "react";
import { useGlobalContext } from "../../../lib/GlobalProvider";
import DoctorSearch from "../../../components/DoctorSearch";
import PatientDashboard from "../../../dashboard/PatientDashboard";

const SearchScreen = () => {
  const { userDetails, loading, isLoggedIn } = useGlobalContext();

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-dark-background p-4">
      {
        userDetails?.role === "patient" ? (
          <PatientDashboard/>
        ) : userDetails?.role === "doctor" ? (
          <DoctorSearch/>
        ) : (
          <Text>Invalid user role.</Text>
        )
      }
    </SafeAreaView>
  )
}

export default SearchScreen;
