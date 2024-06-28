import { View, Text } from 'react-native'
import React, { useEffect } from 'react';
import { SplashScreen, Stack } from 'expo-router';
import { useFonts } from 'expo-font';

SplashScreen.preventAutoHideAsync();

const _layout = () => {
  const [fontsLoaded, error] = useFonts({
    "Poppins-Medium": require("../assets/fonts/Poppins-Medium.ttf"),
    "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
    "Poppins-SemiBold": require("../assets/fonts/Poppins-SemiBold.ttf"),
    "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
  })

  useEffect(() => {
    if(error) throw new Error(error);
    if(fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded, error])

  if (!fontsLoaded && !error) return null;
  return (
    <Stack>
        <Stack.Screen name='index' options={{
            headerShown: false
        }}/>
        <Stack.Screen name='(auth)'options={{
            headerShown: false
        }}/>
    </Stack>
  )
}

export default _layout