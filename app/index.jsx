import { View, Text, StatusBar, ImageBackground, Touchable,Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { router } from 'expo-router'
import Logo from "../assets/svg/images/logo.png";

const StartScreen = () => {

  const handleStart = () => {
    router.navigate('/UserSelection')
  }
  return (
    <View className="flex-1">
      <StatusBar hidden/>
        <ImageBackground source={require('../assets/images/background.jpg')} resizeMode='cover' className="flex-1 justify-end">
          <View className="flex-[0.65] w-full items-center justify-center">
            <Image resizeMode='contain' source={Logo} className="h-[50%] w-[50%]"/>
          </View>
          <View className="items-center justify-center w-full h-[50%] flex-[0.35]">
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => handleStart()}
            className=" h-[60] w-[200] rounded-3xl border-r-fuchsia-500 border-2 bg-white-100 items-center justify-center"
          >
            <Text className="font-pbold text-center  text-2xl text-pink-900">Get Started</Text>
          </TouchableOpacity>
          </View>
        </ImageBackground>
    </View>
  )
}

export default StartScreen