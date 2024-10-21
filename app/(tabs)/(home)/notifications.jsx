import { View, Text, FlatList, Button, TouchableOpacity, StatusBar } from "react-native";
import React from "react";
import { useGlobalContext } from "../../../lib/GlobalProvider";
import { supabase } from "../../../lib/supabase";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

const notifications = () => {
  const [pendingRequests, setPendingRequests] = React.useState([]);
  const { userDetails } = useGlobalContext();
  const [isLoading, setIsLoading] = React.useState(false);

  const fetchPendingRequests = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("access_requests")
        .select("*")
        .eq("patient_id", userDetails.id)
        .eq("status", "pending");

      if (error) {
        console.error("Error fetching pending requests:", error);
      } else {
        setPendingRequests(data);
        console.log("Pending requests:", data);
      }
    } catch (error) {
      console.error("Fetch pending requests error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApproval = async (requestId, status) => {
    try {
      // Update request status
      const { error: requestError } = await supabase
        .from('access_requests')
        .update({ status })
        .eq('id', requestId);
  
      if (requestError) {
        console.error('Error updating request status:', requestError);
      }
  
      // Log the approval or denial in the `approvals` table
      const { error: approvalError } = await supabase
        .from('approvals')
        .insert([
          {
            request_id: requestId,
            approval_status: status,
          },
        ]);
  
      if (approvalError) {
        console.error('Error logging approval/denial:', approvalError);
      } else {
        Alert.alert('Response sent', `The request has been ${status}.`);
      }
    } catch (error) {
      console.error('Approval handling error:', error);
    }
  };

  React.useEffect(() => {
    fetchPendingRequests();
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-dark-background items-center justify-start">
      <StatusBar barStyle="dark-content" />
      <FlatList
        data={pendingRequests}
        keyExtractor={(item) => item.id}
        className="flex-1 w-[90%]"
        ListHeaderComponent={() => (
          <View className="w-full mb-5">
            <Text className="text-3xl font-pbold text-primary p-2">
            Pending Requests
          </Text>
          </View>
        )}
        renderItem={({ item }) => (
          <View className="flex-1 p-2 items-center justify-center bg-light-elevated-bg rounded-2xl space-y-3">
            <Text className="text-lg font-pmedium text-light-elevated-label">
              Request for Accessing Your Data
            </Text>
            <View className="flex-row items-center justify-center space-x-3 w-full">
              <TouchableOpacity
                onPress={() => handleApproval(item.id, "approved")}
                className="bg-primary p-2 w-[40%] rounded-lg"
              >
                <Text className="text-white font-pregular self-center">Approve</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleApproval(item.id, "denied")}
                className="bg-light-elevated-bg w-[40%] p-2 rounded-lg border border-gray-100"
              >
                <Text className="text-light-elevated-label font-pregular self-center">Reject</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

export default notifications;
