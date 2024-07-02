import { View, Text, StatusBar, ImageBackground, Touchable,Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { Redirect, router } from 'expo-router'
import Logo from "../assets/svg/images/MediVaultLogo.png";
import { useGlobalContext } from '../lib/GlobalProvider';

const StartScreen = () => {
  const {loading, isLoggedIn} = useGlobalContext();
  
  if(isLoggedIn && !loading) {
    return(
      <Redirect href={'/profile'}/>
    )
  }

  const handleStart = () => {
    router.navigate('/UserSelection')
  }

  const handleLogin = () => {
    router.navigate('/UserLogin')
  }
  return (
    <View className="flex-1">
      <StatusBar barStyle={'light-content'}/>
        <ImageBackground source={require('../assets/images/background.jpg')} resizeMode='cover' className="flex-1 justify-end">
          <View className="flex-[0.68] w-full h-full items-center justify-center">
            <Image resizeMode='contain' source={Logo} className="h-[20%] w-[20%]" tintColor={'#0D6EFD'}/>
            <Text className="text-5xl text-primary font-pbold">MediVault</Text>
          </View>
          <View className="items-center justify-center w-full h-[50%] flex-[0.268]">
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => handleStart()}
            className=" h-[60] w-[200] rounded-3xl border-fuchsia-500 border-2 bg-white-100 items-center justify-center"
          >
            <Text className="font-pbold text-center  text-2xl text-pink-600">Get Started</Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => handleLogin()}
            className=" h-[60] w-[300] rounded-3xl bg-white-100 items-center justify-center"
          >
            <Text className="font-pSEMIBOLD text-light-elevatedCard-label text-lg">`Login`</Text>
          </TouchableOpacity>
          </View>
        </ImageBackground>
    </View>
  )
}

export default StartScreen