import {
    SafeAreaView,
    Image,
    StatusBar,
    Text,
    View,
  } from "react-native";
  import React, { useEffect, useState } from "react";
  import Logo from "../../assets/images/Auth/doctor-talking-patient.png";
  import CustomButton from "../../components/CustomButton";
  import PatientIcon from '../../assets/icons/patient-icon.png'
  import DoctorIcon from '../../assets/icons/doctor.png'
  import { router } from "expo-router";
  
  const UserSelection = () => {
    const [user, setUser] = useState('');
  
    const handlePatient = async () => {
      router.navigate('/PatientRegistration')
    };

    const handleDoctor = async () => {
      router.navigate('/DoctorRegistration')
    };
  
  
    return (
      <SafeAreaView className="w-full h-full items-center justify-center bg-[#001524]">
        <StatusBar barStyle={'light-content'}/>
          <View className="justify-center items-center flex-1 w-[90%] h-full bg-[#001524]">
            
            <View
              className="w-full flex-1 h-full items-center justify-center"
            >
              <Image
              source={Logo}
              className=" h-[60%] w-[60%] my-10 self-center"
            />
            </View>
            <View className="flex-[0.8] w-full shadow-lg shadow-slate-800 item-center justify-center bg-slate-800 rounded-2xl p-5 my-5">
              <Text className=" font-pbold text-center text-slate-300 text-2xl">
                I am a?
              </Text>
            
              <CustomButton textstyle="font-pbold text-base text-white" name={'Patient'} handlePress={handlePatient} image={PatientIcon}/>
              <CustomButton textstyle="font-pbold text-base text-white" name={'Doctor'} handlePress={handleDoctor} image={DoctorIcon}/>
            </View>
          </View>
      </SafeAreaView>
    );
  };
  
  export default UserSelection;
  