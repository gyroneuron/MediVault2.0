import { StatusBar } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import HomeDashboard from '../../dashboard/HomeDashboard';


const home = () => {
  return(
    <SafeAreaView className="w-full h-full bg-[#001524] items-center justify-center">
      <HomeDashboard/>
    </SafeAreaView>
  );
}

export default home