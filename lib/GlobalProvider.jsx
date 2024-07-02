import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "./supabase";
import { Alert } from "react-native";
import { router } from "expo-router";

const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  const [userAuthInfo, setUserAuthInfo] = useState([]);
  const [userDetails, setUserDetails] = useState([])
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const initializeAuth = async () => {
      //Checking for existing session
      const { data, error: fetchSessionError } =
        await supabase.auth.getSession();

      if (fetchSessionError) {
        Alert.alert(fetchSessionError.name, fetchSessionError.message);
      } else {
        if (data.session) {
          console.log(
            "A session exists for User:",
            data.session.user.user_metadata.fullName
          );
          // console.log("A session exists:", data.session.user);
          setUserAuthInfo(data.session.user);
          setIsLoggedIn(true);
        }
        setLoading(false);
      }

      //Listen for auth state Changes
      const { data: authListener } = supabase.auth.onAuthStateChange(
        (event, session) => {
          // console.log(event)

          if (event === "INITIAL_SESSION") {
            // handle initial session
            if (session) {
              setIsLoggedIn(true);
              setUserAuthInfo(session.user);
              getUserDetails(session.user.id);
            }
            setLoading(false);
          } else if (event === "SIGNED_IN") {
            // handle sign in event
            getUserDetails(session.user.id);
            setIsLoggedIn(true);
            setUserAuthInfo(session.user);
            setLoading(false);
          } else if (event === "SIGNED_OUT") {
            // handle sign out event
            router.replace('/index');
            setIsLoggedIn(false);
            setUserAuthInfo(null);
            setLoading(false);

          } else if (event === "PASSWORD_RECOVERY") {
            // handle password recovery event
            console.log('Password recovery event');
            router.navigate('/(auth)/ForgotPassword')
          } else if (event === "TOKEN_REFRESHED") {
            // handle token refreshed event
            setUserAuthInfo(session.user);
            console.log('Token refreshed');
          } else if (event === "USER_UPDATED") {
            // handle user updated event
            setUserAuthInfo(session.user);
            console.log('User updated:');
          }
        }
      );

      return () => {
        authListener.subscription.unsubscribe();
      };
    };

    initializeAuth();
  }, []);

  const getUserDetails = async (userId) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select()
        .eq("id", userId)
        .single()

      if (error) {
        console.error("Error fetching user Info:", error);
        // router.navigate("/(auth)/UserSelection");
      } else {
        setUserDetails(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <GlobalContext.Provider
      value={{
        userAuthInfo,
        userDetails,
        loading,
        isLoggedIn,
        userRole,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => {
  return useContext(GlobalContext);
};
