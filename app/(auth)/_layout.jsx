import { View, Text } from 'react-native';
import React from 'react';
import {Stack} from 'expo-router';

const _layout = () => {
  return (
    <Stack>
        <Stack.Screen name='UserSelection' options={{
          headerShown: false
        }}/>
        <Stack.Screen name='ForgotPassword' options={{
          headerShown: false
        }}/>
        <Stack.Screen name='DoctorRegistration' options={{
          headerShown: false
        }}/>
        <Stack.Screen name='PatientRegistration' options={{
          headerShown: false
        }}/>
        <Stack.Screen name='AdminLogin' options={{
          headerShown: false
        }}/>
        <Stack.Screen name='AdminDashboard' options={{
          headerShown: false
        }}/>
        <Stack.Screen name='UserLogin' options={{
          headerShown: false
        }}/>
    </Stack>
  )
}

export default _layout