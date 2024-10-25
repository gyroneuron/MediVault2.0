import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

const _layout = () => {
  return (
    <Stack initialRouteName="SearchScreen"
            screenOptions={{
              headerShown: false,
              title: 'Search',
            }}
    >
        <Stack.Screen name="SearchScreen"/>
        <Stack.Screen 
        name="patient/[id]"
        options={{
          title: 'Patient Profile',
          headerShown: true,
          headerBackTitle: 'Back',
          headerBackVisible: true,
        }}
      />
      <Stack.Screen 
        name="doctor/[id]"
        options={{
          title: 'Doctor Profile',
          headerShown: true,
          headerBackTitle: 'Back',
          headerBackVisible: true,
        }}
      />
      <Stack.Screen 
        name="patient/document/ViewDocuments"
        options={{
          title: 'View Documents',
          headerShown: true,
          headerBackTitle: 'Back',
          headerBackVisible: true,
        }}
      />
      <Stack.Screen
        name="patient/document/UploadByDoctor"
        options={{
          title: 'Upload Document',
          headerShown: true,
          headerBackTitle: 'Back',
          headerBackVisible: true,
        }}
      />
    </Stack>
  )
}

export default _layout