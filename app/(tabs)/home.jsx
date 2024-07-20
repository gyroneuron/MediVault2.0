import { StatusBar } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import HomeDashboard from '../../dashboard/HomeDashboard';


const home = () => {
  return(
    <SafeAreaView className="flex-1 h-full w-full bg-dark-background items-center justify-center">
      <HomeDashboard/>
    </SafeAreaView>
  );
}

export default home