import { View, Text, Alert, FlatList, SafeAreaView, ActivityIndicator, TouchableOpacity } from 'react-native'
import React, {useState, useEffect} from 'react'
import { supabase } from '../../../lib/supabase';
import { useGlobalContext } from '../../../lib/GlobalProvider';
import { router } from 'expo-router';

const requests = () => {

    const { userDetails, loading } = useGlobalContext();
    const [requests, setRequests] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchRequest = async () => {
        setIsLoading(true);
        try {
            const {data, error} = await supabase
        .from('access_requests')
        .select('*')

        if (error) {
            Alert.alert('Error fetching requests', error.message);
            return;
        } else {
            console.log(data);
            setRequests(data);
            
        }} catch (error) {
            Alert.alert("Uncaught error", error.message);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchRequest();
    }, [])

    if (isLoading) {
        return <ActivityIndicator color={"#0D6EFD"} size={"large"} />;
    }

    const handleRequest = async () => {
        router.push('/SearchScreen');
    }
  return (
    <SafeAreaView className="flex-1 bg-white items-center justify-center">
        <FlatList
            data={requests}
            className="flex-1 w-[90%] self-center"
            ListHeaderComponent={<Text className="text-2xl font-bold mb-4">Requests</Text>}
            keyExtractor={(item) => item.id}
            ListEmptyComponent={() => (
                <View className="flex-1 items-center justify-center bg-light-elevated-bg rounded-2xl p-4">
                    <Text className="text-lg font-pmedium text-stone-500">No requests sent</Text>
                    <TouchableOpacity onPress={handleRequest} className="bg-primary p-2 rounded-xl">
                        <Text className="text-white font-pmedium">Send Your First Request to patient</Text>
                    </TouchableOpacity>
                </View>
            )}
            renderItem={({item}) => (
                <View className=" w-full space-y-1 rounded-2xl bg-light-elevated-bg p-2">
                    <Text className="font-pregular text-sm">{item.id}</Text>
                    <Text className={`font-pmedium ${item.status === "pending" ? "text-yellow-600" : item.status === "approved" ? "text-green-500" : "text-red-500"}`}>{item.status}</Text>
                    <Text>{item.patient_id}</Text>
                </View>
            )}
        />
    </SafeAreaView>
  )
}

export default requests