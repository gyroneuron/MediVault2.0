import { Text, ActivityIndicator } from 'react-native'
import React from 'react'
import { useGlobalContext } from '../../../lib/GlobalProvider';
import DoctorDashboard from '../../../dashboard/DoctorDashBoard';
import PatientDashboard from '../../../dashboard/PatientDashboard';


const index = () => {

  const { userDetails, loading } = useGlobalContext();
  console.log(userDetails?.role);

  if (loading) {
    return <ActivityIndicator color={"#0D6EFD"} size={"large"} />;
  }

  if (userDetails?.role === "patient") {
    return (
    <PatientDashboard/>
    )
  } else if (userDetails?.role === "doctor") {
    return (
      <DoctorDashboard/>
    )
  } else {
    return <Text>Invalid user role.</Text>;
  }
}

export default index;