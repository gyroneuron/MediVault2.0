import { View, Text } from 'react-native'
import React from 'react'
import { router, useLocalSearchParams } from 'expo-router';

const PatientProfileDisplay = () => {

    const {patientProfile} = useLocalSearchParams();

  return (
    <View>
      <Text>PatientProfileDisplay</Text>
    </View>
  )
}

export default PatientProfileDisplay