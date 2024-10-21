import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

const _layout = () => {
  return (
    <Stack
    >
        <Stack.Screen name="index" options={{headerShown: false}}/>
        <Stack.Screen name="notifications" options={{
          headerTitle: 'Notifications',
          headerStyle: {backgroundColor: '#ffffff'},
          headerTintColor: '#000000',
          headerBackTitle: 'Back',
          headerTitleStyle: {fontFamily: "Poppins-Medium", color: '#000000'},
        }}/>
    </Stack>
  )
}

export default _layout